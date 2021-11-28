/// <reference types="long" />
import type { Long } from '@grpc/proto-loader';
export interface BoardPlatform {
    'architecture'?: (string);
    'category'?: (string);
    'url'?: (string);
    'archive_filename'?: (string);
    'checksum'?: (string);
    'size'?: (number | string | Long);
    'name'?: (string);
}
export interface BoardPlatform__Output {
    'architecture': (string);
    'category': (string);
    'url': (string);
    'archive_filename': (string);
    'checksum': (string);
    'size': (string);
    'name': (string);
}
//# sourceMappingURL=BoardPlatform.d.ts.map