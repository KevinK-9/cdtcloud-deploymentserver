import { injectable } from '@theia/core/shared/inversify';
import { DeploymentService } from '../common/protocol';
import { RPCClient } from '../browser/client';

@injectable()
export class DeploymentServiceImpl implements DeploymentService {

    async deployToBoard(fqbn: string, id: string, sketchPath: string): Promise<void> {
        let binaryFile: string;
        let binaryFileContent: string;
        let artifactUrl: string;
        
        binaryFile = "Error";
        binaryFileContent= "Error 2";
        artifactUrl="Error 3"

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
                    binaryFile = file
                }
            });


            console.log('binary file: ' + binaryFile)


        });
        fs.readfile(binaryFile, (err: any, content: any) => {
            if(err != null){
                return new Error(err.message)
            }
            
            if(content == null){
                return new Error('no content found in binary file')
            }
            binaryFileContent = content

        });

        var form = new FormData();
        form.append('binary_file', binaryFileContent)
        form.submit('http://localhost:3001/deployment-artifacts', (err: any, res: any) => {
            if(err){
                new Error(err.message)
            }
            if (res == null){
                new Error('No artifact url received')
            }
            artifactUrl = res.artifactUrl
            console.log('URL: ' + artifactUrl)
        })

        form.append('artifactUrl', artifactUrl)
        form.append('id', id)
        form.submit('http://localhost:3001/deploymentRequests', (err: any, res: any) => {
            if(err){
                new Error(err.message)
            }
            //TODO: handle response
        })
    }
}
