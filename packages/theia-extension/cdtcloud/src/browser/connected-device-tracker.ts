import FormData from 'form-data';
import { readFile, readdir } from 'fs/promises';
import { DeviceType } from '.prisma/client';
import { RPCClient } from './client';
import { MaybePromise } from "@theia/core";
import { BackendApplicationContribution } from "@theia/core/lib/node/backend-application";
import { injectable } from "@theia/core/shared/inversify";
import { Application } from '@theia/core/shared/express';
import axios from 'axios'; 



@injectable()
export class ConnectedDeviceTracker implements BackendApplicationContribution {

   protected binaryFile: string;
   protected binaryFileContent: Buffer;
   protected artifactUrl: string;

    configure(app: Application): void {
        app.get('/device-types', (request, response) => {
            
        });
    }

    initialize(): MaybePromise<void> {
        console.log("Checking for connected devices.");
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
    
        const files = await readdir(buildPath)

        files.forEach((file: any) => {
            if(file.endsWith('.bin')){
                this.binaryFile = buildPath + "/" + file
            }
        }) 

        console.log('binary file: ' + this.binaryFile)

        this.binaryFileContent = await readFile(this.binaryFile)

        console.log(this.binaryFileContent)
        //const arraybuffer = Uint8Array.from(this.binaryFileContent)
        //const artifact = new File([arraybuffer], 'artifact', { type: 'text/plain' })
        let form = new FormData();

        form.append('file', this.binaryFileContent)

        const response = await axios.post(`http://localhost:3001/deployment-artifacts`, form, {headers:{"Content-Type": "multipart/form-data"}})
          console.log(response)
          /*const json = await response.json() as { artifactUrl: string}
          console.log(json)

          this.artifactUrl = json.artifactUrl

          */
          this.artifactUrl = response.data.artifactUrl


          console.log(this.artifactUrl)

        form.append('artifactUrl', this.artifactUrl)
        form.append('id', id)

        /*const res = await fetch(`http://localhost:3001/deploymentRequests`, {
            method: 'POST',
            body: form
          })
          const data = await response.json() as { artifactUri: string}
        */
    }
}
