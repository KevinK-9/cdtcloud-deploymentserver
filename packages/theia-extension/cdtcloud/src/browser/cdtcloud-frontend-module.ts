import { ContainerModule } from '@theia/core/shared/inversify';
import { CdtcloudWidget } from './cdtcloud-widget';
import { CdtcloudContribution } from './cdtcloud-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';
import { CompilationRunnerContribution } from './compilation-runner-contribution';
import { CompilationRunner} from './compilation-runner';
import { TaskRunnerContribution } from '@theia/task/src/node/task-runner';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, CdtcloudContribution);
    bind(FrontendApplicationContribution).toService(CdtcloudContribution);
    bind(CdtcloudWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: CdtcloudWidget.ID,
        createWidget: () => ctx.container.get<CdtcloudWidget>(CdtcloudWidget)
    })).inSingletonScope();
    
    /*
    bind(CompilationRunner).toSelf().inSingletonScope();
    bind(TaskRunnerContribution).to(CompilationRunnerContribution);
    */
});
