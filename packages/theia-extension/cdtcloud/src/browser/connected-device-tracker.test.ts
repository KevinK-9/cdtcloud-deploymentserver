import 'reflect-metadata';
import { ConnectedDeviceTracker } from './connected-device-tracker';


describe('ConnectedDeviceTracker', () => {

    let deviceTracker: ConnectedDeviceTracker;

    beforeEach(async () => {
        deviceTracker = new ConnectedDeviceTracker();
    });

    it('should fetch device types', async () => {
        const types = await deviceTracker.updateDevices()
        expect(typeof types).toBe('object')
        expect(types.length).toBeDefined()

    });
});
