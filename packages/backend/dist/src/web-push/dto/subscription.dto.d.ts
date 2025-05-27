declare class PushSubscriptionKeys {
    p256dh: string;
    auth: string;
}
declare class PushSubscription {
    endpoint: string;
    keys: PushSubscriptionKeys;
    expirationTime?: number;
}
export declare class SubscriptionDto {
    subscription: PushSubscription;
    chatEnabled: boolean;
    calendarEnabled: boolean;
}
export declare class GetStatusDto {
    subscription: PushSubscription;
}
export {};
