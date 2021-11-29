import { RPCClient } from './client';
import { MaybePromise } from "@theia/core";
import { BackendApplicationContribution } from "@theia/core/lib/node/backend-application";
import { injectable } from "@theia/core/shared/inversify";
import { Application } from '@theia/core/shared/express';


class Device {
    protected id: String;
    protected name: String;
    protected fqbn: String;

}
@injectable()
export class ConnectedDeviceTracker implements BackendApplicationContribution {

   protected devices: [Device];
   protected binaryFile: string;
   protected binaryFileContent: String;

   configure(app: Application): void {
    app.get('/device-types', (request, response) => {
        
    });
}

    initialize(): MaybePromise<void> {
        console.log("Checking for connected devices.");
   }

   protected getDevices(): [Device] {
       return this.devices
   }

   protected updateDevices(): void {
    async () => {
        const response = await fetch(`http://localhost:3001/device-types/`);
        const data = await response.json();
        console.log(data);
    }
   }

   forwardBuildPath(fqbn: string): void {
        async () => {
            const client = new RPCClient()
            await client.init()
            await client.createInstance()
            await client.initInstance()

            const buildPath = await client.getBuildPath(fqbn)

            const fs = require('fs');

            fs.readdir(buildPath, (err: any, files: any) => {
                if(err != null){
                    return new Error(err.message)
                }
                files.forEach((file: any) => {
                    if(file.contains('.bin')){
                        this.binaryFile = file
                    }
                });
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
            //TODO: fs.readfile()

            const buffer = Buffer.from(this.binaryFileContent)
            
            //TODO: http request to send buffer
        }
   }
}
