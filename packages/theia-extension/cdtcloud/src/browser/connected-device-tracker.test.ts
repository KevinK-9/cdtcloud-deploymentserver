import 'reflect-metadata';
import { ConnectedDeviceTracker } from './connected-device-tracker';


describe('ConnectedDeviceTracker', () => {

    let deviceTracker: ConnectedDeviceTracker;

    beforeEach(async () => {
        deviceTracker = new ConnectedDeviceTracker();
    });

    it('should fetch device types', async () => {
        const types = await deviceTracker.updateDevices()
        expect(types).toEqual(expect.arrayContaining([{
            id: '2d5a14c2-8e96-45ca-9a9f-290dfb700c33',
            name: 'Arduino Leonardo ETH',
            fqbn: 'arduino:avr:leonardoeth'
          }]))

    });
});
