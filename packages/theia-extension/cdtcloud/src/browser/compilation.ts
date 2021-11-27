import Task from '@theia/task/lib/node/task';


export class Compilation extends Task {
    execute(myCustomValue: number) {

        this.logger.info(`Start running custom task: ${myCustomValue}`);
        setTimeout(() => {
            this.logger.info(`Finished running custom task: ${myCustomValue}`);
            this.fireTaskExited({ taskId: this.taskId, code: 0 });
        }, 5000);
    }
 }