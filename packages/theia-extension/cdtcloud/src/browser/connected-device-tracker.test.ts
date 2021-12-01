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

    it('should log three strings in console', async () => {
        try { await deviceTracker.forwardBuildPath("arduino:avr:circuitplay32u4cat", "aa8083dd-4f36-4eeb-8fa3-9ac3c867f55e", "C:\\Users\\kevin\\Documents\\Arduino\\Light_Project_1")
    } catch (err){
        console.error(err)
    }
        expect(true).toBe(false)
    }, 15000);
});
