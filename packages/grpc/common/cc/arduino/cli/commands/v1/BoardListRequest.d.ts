/// <reference types="long" />
import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from './Instance';
import type { Long } from '@grpc/proto-loader';
export interface BoardListRequest {
    'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
    'timeout'?: (number | string | Long);
}
export interface BoardListRequest__Output {
    'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
    'timeout': (string);
}
//# sourceMappingURL=BoardListRequest.d.ts.map