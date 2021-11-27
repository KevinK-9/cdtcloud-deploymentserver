import { injectable, inject } from '@theia/core/shared/inversify';
import  { TaskRunnerRegistry, TaskRunnerContribution } from '@theia/task/lib/node/task-runner';
import { CompilationRunner } from './compilation-runner';

@injectable()
export class CompilationRunnerContribution implements TaskRunnerContribution {

   @inject(CompilationRunner)
   protected readonly compilationRunner: CompilationRunner;

   registerRunner(runners: TaskRunnerRegistry): void {
       runners.registerRunner('myTaskType', this.compilationRunner);
   }
}