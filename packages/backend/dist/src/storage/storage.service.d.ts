import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
export declare class StorageService extends S3 {
    private readonly configService;
    private readonly s3;
    constructor(configService: ConfigService);
    generateGetSignedUrl(opts: {
        s3Key: string;
        expires?: number;
        contentType?: string;
    }): Promise<string>;
}
