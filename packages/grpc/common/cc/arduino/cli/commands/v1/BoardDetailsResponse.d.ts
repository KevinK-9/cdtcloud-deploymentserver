import type { Package as _cc_arduino_cli_commands_v1_Package, Package__Output as _cc_arduino_cli_commands_v1_Package__Output } from './Package';
import type { BoardPlatform as _cc_arduino_cli_commands_v1_BoardPlatform, BoardPlatform__Output as _cc_arduino_cli_commands_v1_BoardPlatform__Output } from './BoardPlatform';
import type { ToolsDependencies as _cc_arduino_cli_commands_v1_ToolsDependencies, ToolsDependencies__Output as _cc_arduino_cli_commands_v1_ToolsDependencies__Output } from './ToolsDependencies';
import type { ConfigOption as _cc_arduino_cli_commands_v1_ConfigOption, ConfigOption__Output as _cc_arduino_cli_commands_v1_ConfigOption__Output } from './ConfigOption';
import type { Programmer as _cc_arduino_cli_commands_v1_Programmer, Programmer__Output as _cc_arduino_cli_commands_v1_Programmer__Output } from './Programmer';
import type { BoardIdentificationProperties as _cc_arduino_cli_commands_v1_BoardIdentificationProperties, BoardIdentificationProperties__Output as _cc_arduino_cli_commands_v1_BoardIdentificationProperties__Output } from './BoardIdentificationProperties';
export interface BoardDetailsResponse {
    'fqbn'?: (string);
    'name'?: (string);
    'version'?: (string);
    'properties_id'?: (string);
    'alias'?: (string);
    'official'?: (boolean);
    'pinout'?: (string);
    'package'?: (_cc_arduino_cli_commands_v1_Package | null);
    'platform'?: (_cc_arduino_cli_commands_v1_BoardPlatform | null);
    'tools_dependencies'?: (_cc_arduino_cli_commands_v1_ToolsDependencies)[];
    'config_options'?: (_cc_arduino_cli_commands_v1_ConfigOption)[];
    'programmers'?: (_cc_arduino_cli_commands_v1_Programmer)[];
    'debugging_supported'?: (boolean);
    'identification_properties'?: (_cc_arduino_cli_commands_v1_BoardIdentificationProperties)[];
}
export interface BoardDetailsResponse__Output {
    'fqbn': (string);
    'name': (string);
    'version': (string);
    'properties_id': (string);
    'alias': (string);
    'official': (boolean);
    'pinout': (string);
    'package': (_cc_arduino_cli_commands_v1_Package__Output | null);
    'platform': (_cc_arduino_cli_commands_v1_BoardPlatform__Output | null);
    'tools_dependencies': (_cc_arduino_cli_commands_v1_ToolsDependencies__Output)[];
    'config_options': (_cc_arduino_cli_commands_v1_ConfigOption__Output)[];
    'programmers': (_cc_arduino_cli_commands_v1_Programmer__Output)[];
    'debugging_supported': (boolean);
    'identification_properties': (_cc_arduino_cli_commands_v1_BoardIdentificationProperties__Output)[];
}
//# sourceMappingURL=BoardDetailsResponse.d.ts.map