interface _Event {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    totalSlots: number;
    users: any[];
    waitlist: any[];
    description: string;
    color?: string;
    enableBooking: boolean;
}
export declare class GetEventsPublicResponseDto {
    constructor(event: _Event);
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    freeSlots: number;
    description: string;
    color?: string;
    enableBooking: boolean;
}
export {};
