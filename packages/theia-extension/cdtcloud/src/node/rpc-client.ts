/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/
import { ProtoGrpcType } from 'arduino-cli_proto_ts/common/commands'
import { ArduinoCoreServiceClient } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/ArduinoCoreService'
import { ServiceError } from '@grpc/grpc-js'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { CompileRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/CompileRequest'
import { CompileResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/CompileResponse'
import { CreateResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/CreateResponse'
import { InitRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/InitRequest'
import { Instance } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Instance'
import { join } from 'path'
export class RPCClient {
  address: string;
  private client: ArduinoCoreServiceClient | undefined;
  instance: Instance | undefined;
  buildPath?: string

  constructor (address: string = '127.0.0.1:50051') {
    this.address = address
  }

  async init (): Promise<void> {
    const address = this.address
    const packageDefinition = protoLoader.loadSync(
      join(__dirname, '../../../../grpc/proto/cc/arduino/cli/commands/v1/commands.proto'), {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      })

    const deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + 5)

    return await new Promise((resolve, reject) => {
      const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!proto) {
        return reject(new Error('Proto load failed'))
      }

      const arduinoServiceClient = new proto.cc.arduino.cli.commands.v1.ArduinoCoreService(address, grpc.credentials.createInsecure())
      arduinoServiceClient.waitForReady(deadline, (error: Error | undefined) => {
        if (error != null) {
          return reject(new Error(error.message))
        }
        this.client = arduinoServiceClient
        return resolve()
      })
    })
  };

  async createInstance (): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error('Client not initialized'))
      }
      this.client.Create({}, (err: ServiceError | null, data?: CreateResponse) => {
        if (err != null) {
          return reject(new Error(err.message))
        }
        if ((data == null) || (data.instance == null)) {
          return reject(new Error('No Instance created'))
        }
        this.instance = data.instance
        return resolve()
      })
    })
  }

  async initInstance (i?: Instance): Promise<void> {
    const instance = i ?? this.instance
    const initRequest: InitRequest = { instance }

    return await new Promise((resolve, reject) => {
      if ((instance == null) || (this.client == null)) {
        return reject(new Error('Client not connected'))
      }

      const stream = this.client.Init(initRequest)
      stream.on('status', (status) => {
        return status.code === 0 ? resolve() : reject(new Error(status.details))
      })

      stream.on('end', () => {
        stream.destroy()
      })

      stream.on('error', (err: Error) => {
        stream.destroy()
        return reject(new Error(err.message))
      })
    })
  }

  async getBuildPath (fqbn: string, sketchPath: string): Promise<string> {
    const compileRequest: CompileRequest = {
      instance: this.instance,
      fqbn: fqbn,
      export_binaries: { value: true },
      sketch_path: sketchPath
    }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error('Client not initialized'))
      }

      const response = this.client.Compile(compileRequest)
      response.on('data', (data: CompileResponse) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (data.err_stream && data.err_stream.length > 0) {
          return reject(new Error(data.err_stream.toString()))
        }
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!data.out_stream && !data.build_path) {
          return reject(new Error('No build path found'))
        }
        this.buildPath = data.build_path
      })

      response.on('end', () => {
        response.destroy()
      })
      response.on('status', (status) => {
        if (status.code === 0) {
          if (this.buildPath != null) { return resolve(this.buildPath) }
        } else reject(new Error(status.details))
      })
      response.on('error', (err: Error) => {
        return reject(new Error(err.message))
      })
    })
  }
}
