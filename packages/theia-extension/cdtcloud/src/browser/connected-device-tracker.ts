import { DeviceType } from '.prisma/client';
import { RPCClient } from './client';
import { MaybePromise } from "@theia/core";
import { BackendApplicationContribution } from "@theia/core/lib/node/backend-application";
import { injectable } from "@theia/core/shared/inversify";
import { Application } from '@theia/core/shared/express';
import axios from 'axios';    



class Device {
    protected id: String;
    protected name: String;
    protected fqbn: String;

}
@injectable()
export class ConnectedDeviceTracker implements BackendApplicationContribution {

   protected devices: [Device];
   protected binaryFile: string;
   protected binaryFileContent: string;
   protected artifactUrl: string;

    configure(app: Application): void {
        app.get('/device-types', (request, response) => {
            
        });
    }

    initialize(): MaybePromise<void> {
        console.log("Checking for connected devices.");
   }

   protected getDevices(): [Device] {
       //TODO: necessary?
       return this.devices
   }

   public async updateDevices(): Promise<DeviceType[]> {
    let response = await axios.get(`http://localhost:3001/device-types`);
    let data: DeviceType[] = response.data;
    return data
   }

   async forwardBuildPath(fqbn: string, id:string, sketchPath: string): Promise<void> {
        const client = new RPCClient()
        await client.init()
        await client.createInstance()
        await client.initInstance()

        const buildPath = await client.getBuildPath(fqbn, sketchPath)


        console.log(buildPath)


        const fs = require('fs');
        const FormData = require('form-data');

        fs.readdir(buildPath, (err: any, files: any) => {
            if(err != null){
                return new Error(err.message)
            }
            files.forEach((file: any) => {
                if(file.contains('.bin')){
                    this.binaryFile = file
                }
            });


            console.log('binary file: ' + this.binaryFile)


        });
        fs.readfile(this.binaryFile, (err: any, content: any) => {
            if(err != null){
                return new Error(err.message)
            }
            
            if(content == null){
                return new Error('no content found in binary file')
            }
            this.binaryFileContent = content

        });

        var form = new FormData();
        form.append('binary_file', this.binaryFileContent)
        form.submit('http://localhost:3001/deployment-artifacts', (err: any, res: any) => {
            if(err){
                new Error(err.message)
            }
            if (res == null){
                new Error('No artifact url received')
            }
            this.artifactUrl = res.artifactUrl
            console.log('URL: ' + this.artifactUrl)
        })

        form.append('artifactUrl', this.artifactUrl)
        form.append('id', id)
        form.submit('http://localhost:3001/deploymentRequests', (err: any, res: any) => {
            if(err){
                new Error(err.message)
            }
            //TODO: handle response
        })
   }
}
