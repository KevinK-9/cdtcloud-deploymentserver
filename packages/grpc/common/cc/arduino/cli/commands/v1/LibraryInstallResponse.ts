// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { DownloadProgress as _cc_arduino_cli_commands_v1_DownloadProgress, DownloadProgress__Output as _cc_arduino_cli_commands_v1_DownloadProgress__Output } from './DownloadProgress';
import type { TaskProgress as _cc_arduino_cli_commands_v1_TaskProgress, TaskProgress__Output as _cc_arduino_cli_commands_v1_TaskProgress__Output } from './TaskProgress';

export interface LibraryInstallResponse {
  'progress'?: (_cc_arduino_cli_commands_v1_DownloadProgress | null);
  'task_progress'?: (_cc_arduino_cli_commands_v1_TaskProgress | null);
}

export interface LibraryInstallResponse__Output {
  'progress': (_cc_arduino_cli_commands_v1_DownloadProgress__Output | null);
  'task_progress': (_cc_arduino_cli_commands_v1_TaskProgress__Output | null);
}
