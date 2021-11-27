import { ILogger } from "@theia/core";
import { inject, injectable } from '@theia/core/shared/inversify';
import { TaskConfiguration } from '@theia/task/src/common/task-protocol';
import { TaskManager } from '@theia/task/lib/node/task-manager';
import { TaskRunner } from '@theia/task/lib/node/task-runner';
import { Task } from '@theia/task/lib/node/task';
import { MaybePromise } from '@theia/task/node_modules/@theia/core';
import { TaskInfo } from '@theia/task/src/common/task-protocol';




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

class Compilation extends Task {
    
    getRuntimeInfo(): MaybePromise<TaskInfo> {
        throw new Error('Method not implemented.');
    }
    kill(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    execute(boardInfo: JSON) {
        this.logger.info(`Start running custom task: ${boardInfo}`);
        setTimeout(() => {
            this.logger.info(`Finished running custom task: ${boardInfo}`);
            this.fireTaskExited({ taskId: this.taskId, code: 0 });
        }, 5000);
   }
   
}