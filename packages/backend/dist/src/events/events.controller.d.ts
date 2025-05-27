import { EventsService, RecurrenceRule } from './events.service';
import { User as IUser } from '@prisma/client';
import { CreatePredefinedEventDto, UpdatePredefinedEventDto, UpdateEventDto, CreateEventDto, GetEventsPublicResponseDto, UpdateBookingDto } from './dto';
import { PredefinedEventsService } from './predefined-events.service';
import { UsersOnEventsService } from './users-events.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateWaitlistDto } from './dto/update-waitlist.dto';
import { WoocommerceService } from '../woocommerce/woocommerce.service';
export declare class EventsController {
    private readonly eventsService;
    private readonly usersOnEventsService;
    private readonly predefinedEventsService;
    private readonly eventEmitter;
    private readonly woocommerceService;
    constructor(eventsService: EventsService, usersOnEventsService: UsersOnEventsService, predefinedEventsService: PredefinedEventsService, eventEmitter: EventEmitter2, woocommerceService: WoocommerceService);
    markPastUsersOnEventsAsCompleted(): Promise<void>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<void>;
    findAllPredefined(courseId?: string): Promise<({
        courses: (import("@prisma/client/runtime").GetResult<{
            predefinedEventId: string;
            courseId: string;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    createPredefined(createPredefinedEventDto: CreatePredefinedEventDto): Promise<void>;
    updatePredefined(updatePredefinedEventDto: UpdatePredefinedEventDto, id: string): Promise<void>;
    deletePredefined(id: string): Promise<void>;
    findAllUsersOnEvents(userId: string, user: IUser): Promise<({
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
    deleteUserOnEvent(userId: string, eventId: string): Promise<void>;
    create(createEventDto: CreateEventDto): Promise<void>;
    loadBookingsFromWoocommerce(): Promise<{
        id: number;
        cost: string;
        dateCreated: Date;
        startDate: Date;
        endDate: Date;
        orderIds: number[];
        productId: number;
        status: import("../woocommerce/dto/get-bookings.response.dto").BookingStatus;
        event: {
            name: string;
            dateCreated: string;
            description: string;
        };
    }[]>;
    loadOrdersFromWoocommerce(ids: number[]): Promise<{
        id: number;
        status: import("../woocommerce/dto/get-bookings.response.dto").OrderStatus;
        dateCreated: string;
        dateCompleted: string;
        datePaid: string;
        user: {
            first_name: string;
            last_name: string;
            company: string;
            address_1: string;
            address_2: string;
            city: string;
            state: string;
            postcode: string;
            country: string;
            email: string;
            phone: string;
            customerId: number;
        };
    }[]>;
    findAllForUser(user: IUser, date: Date, onlyClub: boolean, predefinedEventId?: string, courseId?: string): Promise<{
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
    remove(id: string, recurrence?: RecurrenceRule): Promise<void>;
    updateBooking(updateBookingDto: UpdateBookingDto, currentUser: IUser, eventId: string, userId: string): Promise<void>;
    updateWaitlist(updateWaitlistDto: UpdateWaitlistDto, currentUser: IUser, eventId: string, userId: string): Promise<void>;
    markUsersAsVisited(eventId: string, userId: string, isPresent: boolean): Promise<void>;
    markUsersOnEventsAsCompleted(predefinedEventId: string, userId: string): Promise<void>;
    findAllPublic(date: Date, courseId: string): Promise<GetEventsPublicResponseDto[]>;
}
