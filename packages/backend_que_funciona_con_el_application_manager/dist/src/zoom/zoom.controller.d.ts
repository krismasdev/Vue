/// <reference types="cookie-parser" />
import { RawBodyRequest } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { Request } from 'express';
import { ZoomBodyMeetingCreated, ZoomBodyMeetingDeleted, ZoomBodyUrlValidation } from './zoom.interface';
import { ZoomMeetingResponse } from './response/zoom-meeting.response';
export declare class ZoomController {
    private readonly zoomService;
    constructor(zoomService: ZoomService);
    webhook(body: ZoomBodyMeetingCreated | ZoomBodyMeetingDeleted | ZoomBodyUrlValidation, req: RawBodyRequest<Request>): Promise<{
        plainToken: string;
        encryptedToken: string;
    }>;
    getCurrentMeeting(): Promise<ZoomMeetingResponse>;
}
