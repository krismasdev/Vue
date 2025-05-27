import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto, LoginDto, EmailVerificationCodeReqDto, PasswordTokenReqDto, ResetPasswordDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
export declare class AuthController {
    private authService;
    private configService;
    private emailService;
    private usersService;
    constructor(authService: AuthService, configService: ConfigService, emailService: EmailService, usersService: UsersService);
    login(loginDto: LoginDto, response: Response): Promise<void>;
    register(createUserDto: RegisterDto, response: Response): Promise<void>;
    logout(response: Response): Promise<void>;
    generateEmailVerificationCode(emailVerificationCodeReqDto: EmailVerificationCodeReqDto): Promise<void>;
    changeEmail(emailVerificationCodeReqDto: EmailVerificationCodeReqDto): Promise<void>;
    emailPasswordRecoveryToken(dto: PasswordTokenReqDto): Promise<void>;
    changePassword(dto: ResetPasswordDto): Promise<void>;
}
