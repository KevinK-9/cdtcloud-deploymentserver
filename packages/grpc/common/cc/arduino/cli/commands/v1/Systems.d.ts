/// <reference types="long" />
import type { Long } from '@grpc/proto-loader';
export interface Systems {
    'checksum'?: (string);
    'host'?: (string);
    'archive_filename'?: (string);
    'url'?: (string);
    'size'?: (number | string | Long);
}
export interface Systems__Output {
    'checksum': (string);
    'host': (string);
    'archive_filename': (string);
    'url': (string);
    'size': (string);
}
//# sourceMappingURL=Systems.d.ts.map