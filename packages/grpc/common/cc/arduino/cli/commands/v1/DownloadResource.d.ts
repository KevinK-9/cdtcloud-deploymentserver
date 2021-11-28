/// <reference types="long" />
import type { Long } from '@grpc/proto-loader';
export interface DownloadResource {
    'url'?: (string);
    'archive_filename'?: (string);
    'checksum'?: (string);
    'size'?: (number | string | Long);
    'cache_path'?: (string);
}
export interface DownloadResource__Output {
    'url': (string);
    'archive_filename': (string);
    'checksum': (string);
    'size': (string);
    'cache_path': (string);
}
//# sourceMappingURL=DownloadResource.d.ts.map