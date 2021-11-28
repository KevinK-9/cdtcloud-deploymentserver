// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from './Instance';

export interface LibraryResolveDependenciesRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'name'?: (string);
  'version'?: (string);
}

export interface LibraryResolveDependenciesRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'name': (string);
  'version': (string);
}
