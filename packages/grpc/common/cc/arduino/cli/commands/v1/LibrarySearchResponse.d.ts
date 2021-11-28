import type { SearchedLibrary as _cc_arduino_cli_commands_v1_SearchedLibrary, SearchedLibrary__Output as _cc_arduino_cli_commands_v1_SearchedLibrary__Output } from './SearchedLibrary';
import type { LibrarySearchStatus as _cc_arduino_cli_commands_v1_LibrarySearchStatus } from './LibrarySearchStatus';
export interface LibrarySearchResponse {
    'libraries'?: (_cc_arduino_cli_commands_v1_SearchedLibrary)[];
    'status'?: (_cc_arduino_cli_commands_v1_LibrarySearchStatus | keyof typeof _cc_arduino_cli_commands_v1_LibrarySearchStatus);
}
export interface LibrarySearchResponse__Output {
    'libraries': (_cc_arduino_cli_commands_v1_SearchedLibrary__Output)[];
    'status': (keyof typeof _cc_arduino_cli_commands_v1_LibrarySearchStatus);
}
//# sourceMappingURL=LibrarySearchResponse.d.ts.map