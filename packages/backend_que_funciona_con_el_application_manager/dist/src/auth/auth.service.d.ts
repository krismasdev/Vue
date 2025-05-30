import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from './../database/database.service';
import { PasswordTokenReqDto } from './dto/password-token-req.dto';
import { ResetPasswordDto } from '@aula-anclademia/backend/src/auth/dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class AuthService {
    private readonly jwtService;
    private readonly databaseService;
    private readonly configService;
    constructor(jwtService: JwtService, databaseService: DatabaseService, configService: ConfigService);
    private readonly passwordRecoveryTokenDurationMs;
    private readonly saltRounds;
    private jwtCookieOptions;
    setAuthCookie(response: Response, { email, userId }: {
        email: string;
        userId: string;
    }): Promise<void>;
    getUserIdFromJwt(jwt: string): Promise<string | null>;
    resetPassword(dto: ResetPasswordDto): Promise<void>;
    generatePassRecoveryToken(forgotPasswordDto: PasswordTokenReqDto): Promise<string>;
    hashString(str: string): Promise<string>;
    checkEmailExists(email: string): Promise<boolean>;
    changePassword(userId: string, newPassword: string): Promise<void>;
    getUserEmailPassword(email: string, password: string): Promise<Omit<import("@prisma/client/runtime").GetResult<{
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
    authenticateIdPassword(userId: string, password: string): Promise<void>;
    generateJwtToken(email: string, userId: string): Promise<string>;
    checkEmailVerificationCode(email: string, code: string): Promise<boolean>;
    registerUser(email: string, password: string): Promise<Omit<import("@prisma/client/runtime").GetResult<{
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
    generateEmailVerificationCode(email: string): Promise<string>;
}
