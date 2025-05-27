import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { Event } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
export declare class EmailService {
    private readonly configService;
    private readonly usersService;
    private readonly databaseService;
    private sendinblueInstance;
    constructor(configService: ConfigService, usersService: UsersService, databaseService: DatabaseService);
    SENDER_NAME: string;
    VERIFICATION_CODE_SUBJECT: string;
    PASSWORD_RECOVERY_SUBJECT: string;
    WELCOME_SUBJECT: string;
    NEW_USER_ONBOARDED_SUBJECT: string;
    NEW_EVENT_NOTIFICATION_SUBJECT: string;
    WAITING_LIST: string;
    CALENDAR_BLOCKED: string;
    EVENT_REMINDER_SUBJECT: string;
    SLOTS_WARNING_SUBJECT: string;
    private templatesHtml;
    private loadEmailsIntoMemory;
    private formatDate;
    sendEmail({ to, subject, htmlContent, params, }: {
        to: string | string[];
        subject: string;
        htmlContent: string;
        params?: any;
    }): Promise<void>;
    sendEmailVerificationCodeRegister({ to, verificationCode, }: {
        to: string;
        verificationCode: string;
    }): Promise<void>;
    sendEmailVerificationCodeChange({ to, verificationCode, }: {
        to: string;
        verificationCode: string;
    }): Promise<void>;
    sendForgotPasswordCode({ to, recoveryToken, }: {
        to: string;
        recoveryToken: string;
    }): Promise<void>;
    sendWelcome({ to, fullName }: {
        to: string;
        fullName: string;
    }): Promise<void>;
    sendEmailAboutWaitlist(to: string): Promise<void>;
    sendEmailAboutBlockedCalendar(to: string): Promise<void>;
    sendUserOnboardedToAdmins({ fullName }: {
        fullName: string;
    }): Promise<void>;
    sendNewEventNotification({ eventId }: {
        eventId: string;
    }): Promise<void>;
    sendEventReminders(): Promise<void>;
    private getEventWithDetails;
    sendSlotsWarningForAdmins(event: Event): Promise<void>;
    private sendClubEventNotification;
    private sendCourseEventNotification;
    private filterEmails;
    private sendEventReminderEmails;
}
