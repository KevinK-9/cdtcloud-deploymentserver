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
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core'
import { ContainerModule } from '@theia/core/shared/inversify'
import {
  DeviceTypeService,
  DEVICE_TYPES_PATH,
  CompilationService,
  COMPILATION_PATH,
  ConfigService,
  CONFIG_PATH
} from '../common/protocol'
import { CompilationServiceImpl } from './compilation-service'
import { ConfigServiceImpl } from './config-service'
import { DeviceTypeServiceImpl } from './device-types-service'

export default new ContainerModule((bind) => {
  bind(DeviceTypeService).to(DeviceTypeServiceImpl).inSingletonScope()
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler(DEVICE_TYPES_PATH, () => {
          return ctx.container.get<DeviceTypeService>(DeviceTypeService)
        })
    )
    .inSingletonScope()

  bind(CompilationService).to(CompilationServiceImpl).inSingletonScope()
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler(COMPILATION_PATH, () => {
          return ctx.container.get<CompilationService>(CompilationService)
        })
    )
    .inSingletonScope()

  bind(ConfigService).to(ConfigServiceImpl).inSingletonScope()
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler(CONFIG_PATH, () => {
          return ctx.container.get<ConfigService>(ConfigService)
        })
    )
    .inSingletonScope()
})
