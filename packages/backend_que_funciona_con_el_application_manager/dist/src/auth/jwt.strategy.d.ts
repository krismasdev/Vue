import { Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private databaseService;
    private configService;
    constructor(databaseService: DatabaseService, configService: ConfigService);
    validate(payload: any): Promise<Omit<import("@prisma/client/runtime").GetResult<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").Role;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        birthDate: Date;
        address: string;
        zipCode: string;
        city: string;
        idNumber: string;
        idIssueDate: Date;
        profilePicturePath: string;
        isInClub: boolean;
        courseId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        isCalendarEnable: boolean;
        calendarBlockingDeadline: Date;
        receiveEmailsOnNewEvent: boolean;
    }, unknown, never> & {}, "password">>;
}
export {};
