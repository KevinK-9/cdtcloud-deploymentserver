import { ContainerModule } from "@theia/task/node_modules/@theia/core/shared/inversify";
import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';
import { ConnectedDeviceTracker } from "../browser/connected-device-tracker";
import { DeploymentService, DEPLOYMENT_PATH, DeviceTrackerService, DEVICE_TRACKER_PATH } from "../common/protocol";
import { ConnectionHandler, JsonRpcConnectionHandler } from "@theia/core";
import { DeploymentServiceImpl } from "./cdtcloud-deployment-service";
import { DeviceTrackerServiceImpl } from "./cdtcloud-device-tracker-service";

export default new ContainerModule(bind => {
    bind(ConnectedDeviceTracker).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(ConnectedDeviceTracker);

    bind(DeploymentService).to(DeploymentServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(DEPLOYMENT_PATH, () => {
            return ctx.container.get<DeploymentService>(DeploymentService);
        })
    ).inSingletonScope();

    bind(DeviceTrackerService).to(DeviceTrackerServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(DEVICE_TRACKER_PATH, () => {
            return ctx.container.get<DeviceTrackerService>(DeviceTrackerService);
        })
    ).inSingletonScope();

 });