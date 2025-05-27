import { UpdateBookingDto } from './dto/update-booking.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';
import { UpdateWaitlistDto } from './dto/update-waitlist.dto';
import { EmailService } from '../email/email.service';
export declare class UsersOnEventsService {
    private databaseService;
    private emailService;
    constructor(databaseService: DatabaseService, emailService: EmailService);
    checkFindAllPermissions({ resourceUserId, loggedInUser, }: {
        resourceUserId: string;
        loggedInUser: User;
    }): Promise<void>;
    findAllByUserId(userId: string): Promise<({
        event: {
            predefinedEvent: {
                courses: (import("@prisma/client/runtime").GetResult<{
                    predefinedEventId: string;
                    courseId: string;
                }, unknown, never> & {})[];
            } & import("@prisma/client/runtime").GetResult<{
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
            }, unknown, never> & {};
        } & import("@prisma/client/runtime").GetResult<{
            id: string;
            startDate: Date;
            endDate: Date;
            totalSlots: number;
            description: string;
            predefinedEventId: string;
            title: string;
            isClub: boolean;
            isHidden: boolean;
            enableBooking: boolean;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            recurrenceRule: string;
            recurrenceEnd: Date;
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        userId: string;
        eventId: string;
        isCompleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        waitlistEventId: string;
        visitedEventId: string;
    }, unknown, never> & {})[]>;
    delete(userId: string, eventId: string): Promise<void>;
    markPastAsCompleted(): Promise<void>;
    artificiallyMarkPendingAsCompleted(userId: string, predefinedEventId: string): Promise<void>;
    updateBooking(updateBookingDto: UpdateBookingDto, eventId: string, userId: string): Promise<void>;
    updateWaitlist(updateWaitlistDto: UpdateWaitlistDto, eventId: string, userId: string): Promise<void>;
    markUsersAsVisited(eventId: string, userId: string, isPresent: boolean): Promise<void>;
}
