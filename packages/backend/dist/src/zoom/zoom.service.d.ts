/// <reference types="cookie-parser" />
import { RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { DatabaseService } from './../database/database.service';
import { ZoomBodyMeetingCreated, ZoomBodyUrlValidation } from './zoom.interface';
export declare class ZoomService {
    private readonly configService;
    private readonly databaseService;
    constructor(configService: ConfigService, databaseService: DatabaseService);
    validateWebhook(req: RawBodyRequest<Request>): Promise<void>;
    handleUrlValidation(body: ZoomBodyUrlValidation): {
        plainToken: string;
        encryptedToken: string;
    };
    handleMeetingCreated(body: ZoomBodyMeetingCreated): Promise<void>;
    handleMeetingDeleted(): Promise<void>;
    getCurrentMeeting(): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        meetingId: string;
        joinUrl: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
}
