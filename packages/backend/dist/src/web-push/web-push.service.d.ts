import { ConfigService } from '@nestjs/config';
import { WebPushSubscription } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as webPush from 'web-push';
import { LogSnagService } from './../log-snag/log-snag.service';
import { IWebPushEvent, WebPushSubscriptionType } from './web-push.types';
import { SubscriptionDto } from './dto/subscription.dto';
export declare class WebPushService {
    private readonly configService;
    private readonly databaseService;
    private readonly logSnagService;
    webPush: typeof webPush;
    constructor(configService: ConfigService, databaseService: DatabaseService, logSnagService: LogSnagService);
    getSubscriptionStatus(subscription: webPush.PushSubscription, userId: string): Promise<{
        chatEnabled: boolean;
        calendarEnabled: boolean;
    }>;
    getVapidPublicKey(): any;
    sendNotification(subscriptions: webPush.PushSubscription[], { title, body, data, type }: IWebPushEvent): Promise<void>;
    updateSubscription(dto: SubscriptionDto, userId: string): Promise<void>;
    buildFromDatabase(dbObject: WebPushSubscription): {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
        userId: string;
    };
    getActiveSubscriptionsForUsers(userIds: string[], type: WebPushSubscriptionType): Promise<{
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
        userId: string;
    }[]>;
    deleteExpiredSubscriptions(): Promise<void>;
}
