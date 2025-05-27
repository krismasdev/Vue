import { CreateEventDto } from './create-event.dto';
declare const UpdateEventDto_base: import("@nestjs/mapped-types").MappedType<Pick<CreateEventDto, "startDate" | "endDate" | "totalSlots" | "description" | "enableBooking" | "color">>;
export declare class UpdateEventDto extends UpdateEventDto_base {
    title?: string;
}
export {};
