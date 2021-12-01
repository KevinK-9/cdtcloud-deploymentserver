import { ContainerModule } from "@theia/task/node_modules/@theia/core/shared/inversify";
import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';
import { ConnectedDeviceTracker } from "./connected-device-tracker";

export default new ContainerModule(bind => {
    bind(ConnectedDeviceTracker).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(ConnectedDeviceTracker);

    /*bind(HelloBackendWithClientService).to(HelloBackendWithClientServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler<BackendClient>(HELLO_BACKEND_WITH_CLIENT_PATH, client => {
            const server = ctx.container.get<HelloBackendWithClientServiceImpl>(HelloBackendWithClientService);
            server.setClient(client);
            client.onDidCloseConnection(() => server.dispose());
            return server;
        })
    ).inSingletonScope();*/
 });