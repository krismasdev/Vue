import { ZoomMeeting } from '@prisma/client';
export declare class ZoomMeetingResponse implements ZoomMeeting {
    id: string;
    meetingId: string;
    joinUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
