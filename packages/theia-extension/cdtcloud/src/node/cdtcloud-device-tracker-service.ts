import { DeviceTrackerService } from "../common/protocol";
import { DeviceType } from '.prisma/client';
import axios from 'axios';    
import { injectable } from "@theia/core/shared/inversify";

@injectable()
export class DeviceTrackerServiceImpl implements DeviceTrackerService {
    async updateDevices(): Promise<DeviceType[]> {
    let response = await axios.get(`http://localhost:3001/device-types`)
    let data: DeviceType[] = response.data;
    return data
   }
}