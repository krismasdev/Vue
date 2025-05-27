import { RecurrenceRule } from '../events.service';
export declare class CreateEventDto {
    isClub: boolean;
    predefinedEventId?: string;
    title?: string;
    description?: string;
    color?: string;
    enableBooking?: boolean;
    startDate: Date;
    recurrenceEnd?: Date;
    recurrenceRule?: RecurrenceRule;
    repeatDays?: number[];
    repeatDates?: Date[];
    endDate: Date;
    totalSlots: number;
}
