import { ILogger, MaybePromise } from "@theia/core";
import { BackendApplicationContribution } from "@theia/core/lib/node/backend-application";
import { inject, injectable } from "@theia/core/shared/inversify";

class Device {
    protected id: String;
    protected name: String;
    protected fqbn: String;

}
@injectable()
export class ConnectedDeviceTracker implements BackendApplicationContribution {

   @inject(ILogger)
   protected readonly logger: ILogger;
   protected logTimer: NodeJS.Timer;
   protected memoryUsed = 0;
   protected devices: [Device];

    initialize(): MaybePromise<void> {
        console.log("Checking for connected devices.");
        async () => {
            const response = await fetch(`http://localhost:3001/device-types/`);
            const data = await response.json();
            console.log(data);
        }
   }

   protected listDevices(): void {
       const currentMemoryUsed = this.currentRoundedMemoryUsage();
       const diff = currentMemoryUsed - this.memoryUsed;
       if (Math.abs(diff) > 0.1) {
           const timestamp = new Date().toUTCString();
           this.logger.info(
               `[${timestamp}] PID ${process.pid} uses ${currentMemoryUsed} MB (${diff > 0 ? '+' : ''}${diff.toFixed(2)})`
           );
           this.memoryUsed = currentMemoryUsed;
       }
   }

   protected currentRoundedMemoryUsage() {
       return Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
   }

   onStop(): void {
       if (this.logTimer) {
           clearInterval(this.logTimer);
       }
   }
}