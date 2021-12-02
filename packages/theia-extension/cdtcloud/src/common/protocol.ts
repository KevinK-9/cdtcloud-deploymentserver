import { DeviceType } from '.prisma/client';

export const DeploymentService = Symbol('DeploymentService');
export const DEPLOYMENT_PATH = '/services/deploy';
export interface DeploymentService {
    deployToBoard(fqbn: string, id: string, sketchPath: string): Promise<void>
}

export const DeviceTrackerService = Symbol('DeviceTracker');
export const DEVICE_TRACKER_PATH = '/services/deviceTracker';
export interface DeviceTrackerService {
    updateDevices(): Promise<DeviceType[]>
}