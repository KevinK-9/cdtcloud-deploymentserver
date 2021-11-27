import { ILogger } from "@theia/core";
import { inject, injectable } from '@theia/core/shared/inversify';
import { TaskConfiguration } from '@theia/task/src/common/task-protocol';
import { TaskManager } from '@theia/task/src/node/task-manager';
import { TaskRunner } from '@theia/task/lib/node/task-runner';
import { Compilation } from './compilation';
import { Task } from '@theia/task/lib/node/task';



@injectable()
export class CompilationRunner implements TaskRunner {

   @inject(TaskManager)
   protected readonly taskManager: TaskManager;

   @inject(ILogger)
   protected readonly logger: ILogger;

   async run(config: TaskConfiguration, ctx?: string): Promise<Task> {
       const compilation = new Compilation(this.taskManager, this.logger,
                                   { config, label: 'Compile Code' });
       compilation.execute(config.boardInfo);
       return compilation;
   }
}