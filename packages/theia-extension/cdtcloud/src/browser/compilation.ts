import { MaybePromise } from '@theia/task/node_modules/@theia/core';
import { Task } from '@theia/task/src/node/task';
import { TaskInfo } from '@theia/task/src/common/task-protocol';

export class Compilation extends Task {
    
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