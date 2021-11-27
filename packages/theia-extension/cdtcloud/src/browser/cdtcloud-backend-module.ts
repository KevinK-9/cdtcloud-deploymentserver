import { ContainerModule } from "@theia/task/node_modules/@theia/core/shared/inversify";
import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';
import { ConnectedDeviceTracker } from "./connected-device-tracker";

export default new ContainerModule(bind => {
    bind(ConnectedDeviceChecker).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(ConnectedDeviceTracker);
 });