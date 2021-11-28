// Original file: src\cc\arduino\cli\commands\v1\commands.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from './Instance';

export interface UpgradeRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'skip_post_install'?: (boolean);
}

export interface UpgradeRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'skip_post_install': (boolean);
}
