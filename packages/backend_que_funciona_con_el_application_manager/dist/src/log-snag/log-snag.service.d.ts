import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class LogSnagService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    logSnagUrl: string;
    config: {
        project: string;
        apiKey: string;
        active: boolean;
    };
    log(event: string, description: string, channel: string, userIdentifier: string): Promise<void>;
}
