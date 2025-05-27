import { CreateEventDto } from './dto/create-event.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { EmailService } from '../email/email.service';
export type RecurrenceRule = 'daily' | 'weekly' | 'monthly' | 'annually' | 'weekdays' | 'customDays' | 'customDates';
export declare class EventsService {
    private readonly databaseService;
    private readonly usersService;
    private emailService;
    constructor(databaseService: DatabaseService, usersService: UsersService, emailService: EmailService);
    update(id: string, updateEventDto: UpdateEventDto): Promise<{
        waitlist: {
            user: {
                email: string;
                id: string;
            };
        }[];
        users: (import("@prisma/client/runtime").GetResult<{
            userId: string;
            eventId: string;
            isCompleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            waitlistEventId: string;
            visitedEventId: string;
        }, unknown, never> & {})[];
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
    }, unknown, never> & {}>;
    create({ repeatDays, ...body }: CreateEventDto): Promise<import("@prisma/client/runtime").GetResult<{
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
    }, unknown, never> & {}>;
    createMany(createEventDto: CreateEventDto): Promise<import("@prisma/client/runtime").GetResult<{
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
    }, unknown, never> & {}>;
    deleteMany(id: string, recurrenceRule: RecurrenceRule): Promise<void>;
    findAll(where?: Prisma.EventWhereInput): Promise<{
        courses: {
            id: string;
            name: string;
        }[];
        isClub: boolean;
        title: string;
        id: string;
        endDate: Date;
        startDate: Date;
        totalSlots: number;
        users: {
            pictureUrl: string;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            profilePicturePath: string;
            idNumber: string;
        }[];
        waitlist: {
            pictureUrl: string;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            profilePicturePath: string;
            idNumber: string;
        }[];
        description: string;
        color: string;
        recurrenceRule: string;
        recurrenceEnd: Date;
        enableBooking: boolean;
        visitedUsers: string[];
    }[]>;
    remove(id: string, recurrenceRule?: RecurrenceRule): Promise<void>;
    findOne(id: string): Promise<{
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
    }, unknown, never> & {}>;
}
