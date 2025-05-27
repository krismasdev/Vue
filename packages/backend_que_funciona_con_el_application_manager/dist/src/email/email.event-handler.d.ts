import { EmailService } from './email.service';
import { UserOnboardedEvent } from 'src/event-emitter/users/user-onboarded.event';
import { UserAcceptedEvent } from 'src/event-emitter/users/user-accepted.event';
import { EventCreatedEvent } from 'src/event-emitter/events/event-created.event';
export declare class EmailEventHandler {
    private readonly emailService;
    constructor(emailService: EmailService);
    handleUserOnboardedEvent(payload: UserOnboardedEvent): Promise<void>;
    handleUserAcceptedEvent(payload: UserAcceptedEvent): Promise<void>;
    handleEventCreatedEvent(payload: EventCreatedEvent): Promise<void>;
    handleUserBlockedCalendar(to: string): Promise<void>;
    handleBookingForWaitlist(to: string): Promise<void>;
}
