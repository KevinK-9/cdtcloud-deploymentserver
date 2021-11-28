/// <reference types="node" />
import type { MonitorPortSetting as _cc_arduino_cli_commands_v1_MonitorPortSetting, MonitorPortSetting__Output as _cc_arduino_cli_commands_v1_MonitorPortSetting__Output } from './MonitorPortSetting';
export interface MonitorResponse {
    'error'?: (string);
    'rx_data'?: (Buffer | Uint8Array | string);
    'applied_settings'?: (_cc_arduino_cli_commands_v1_MonitorPortSetting)[];
}
export interface MonitorResponse__Output {
    'error': (string);
    'rx_data': (Buffer);
    'applied_settings': (_cc_arduino_cli_commands_v1_MonitorPortSetting__Output)[];
}
//# sourceMappingURL=MonitorResponse.d.ts.map