/// <reference types="long" />
import type { Long } from '@grpc/proto-loader';
export interface DownloadProgress {
    'url'?: (string);
    'file'?: (string);
    'total_size'?: (number | string | Long);
    'downloaded'?: (number | string | Long);
    'completed'?: (boolean);
}
export interface DownloadProgress__Output {
    'url': (string);
    'file': (string);
    'total_size': (string);
    'downloaded': (string);
    'completed': (boolean);
}
//# sourceMappingURL=DownloadProgress.d.ts.map