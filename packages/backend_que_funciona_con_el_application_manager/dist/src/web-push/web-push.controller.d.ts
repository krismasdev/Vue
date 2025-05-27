import { WebPushService } from './web-push.service';
import { SubscriptionDto, GetStatusDto } from './dto/subscription.dto';
import { WebPushResponse } from './web-push.response';
export declare class WebPushController {
    private webPushService;
    constructor(webPushService: WebPushService);
    deleteExpiredSubscriptions(): Promise<void>;
    getVapidPublicKey(): Promise<string>;
    updateSubscription(body: SubscriptionDto, userId: string): Promise<void>;
    getSubscriptionStatus(body: GetStatusDto, userId: string): Promise<WebPushResponse>;
}
