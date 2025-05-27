import { NewMessageEvent } from 'src/event-emitter/chat';
import { WebPushService } from './web-push.service';
import { DatabaseService } from 'src/database/database.service';
import { EventCreatedEvent } from 'src/event-emitter/events/event-created.event';
export declare class WebpushEventHandler {
    private readonly webPushService;
    private readonly databaseService;
    constructor(webPushService: WebPushService, databaseService: DatabaseService);
    newMessage(payload: NewMessageEvent): Promise<void>;
    eventCreated(payload: EventCreatedEvent): Promise<void>;
}
