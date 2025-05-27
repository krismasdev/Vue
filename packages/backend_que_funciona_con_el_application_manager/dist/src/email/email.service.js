"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const SibApiV3Sdk = __importStar(require("@sendinblue/client"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const users_service_1 = require("../users/users.service");
const database_service_1 = require("../database/database.service");
const schedule_1 = require("@nestjs/schedule");
let EmailService = class EmailService {
    constructor(configService, usersService, databaseService) {
        this.configService = configService;
        this.usersService = usersService;
        this.databaseService = databaseService;
        this.SENDER_NAME = 'Aula Virtual Anclademia';
        this.VERIFICATION_CODE_SUBJECT = 'Código de verificación';
        this.PASSWORD_RECOVERY_SUBJECT = 'Solicitud de recuperación de contraseña';
        this.WELCOME_SUBJECT = 'Bienvenido a Anclademia';
        this.NEW_USER_ONBOARDED_SUBJECT = 'Nuevo usuario registrado';
        this.NEW_EVENT_NOTIFICATION_SUBJECT = 'Nuevo evento';
        this.WAITING_LIST = 'Estabas en Lista de Espera para una Práctica';
        this.CALENDAR_BLOCKED = 'Tu Calendario está bloqueado';
        this.EVENT_REMINDER_SUBJECT = 'Recordatorio de tu Práctica';
        this.SLOTS_WARNING_SUBJECT = 'Quedan pocas plazas para la Práctica';
        this.templatesHtml = {
            emailVerificationCodeRegister: '',
            emailVerificationCodeChange: '',
            forgotPasswordCode: '',
            welcome: '',
            newUserOnboarded: '',
            newEventNotification: '',
            waitingList: '',
            calendarBlocked: '',
            eventReminder: '',
            slotsWarning: '',
        };
        this.loadEmailsIntoMemory();
        const instance = new SibApiV3Sdk.TransactionalEmailsApi();
        instance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, configService.getOrThrow('SENDINBLUE_API_KEY'));
        this.sendinblueInstance = instance;
    }
    loadEmailsIntoMemory() {
        const templates = {
            emailVerificationCodeRegister: 'email-verification-code-register.html',
            emailVerificationCodeChange: 'email-verification-code-change.html',
            forgotPasswordCode: 'password-recovery-request.html',
            welcome: 'welcome.html',
            newUserOnboarded: 'new-user-onboarded.html',
            newEventNotification: 'new-event-notification.html',
            waitingList: 'waiting-list.html',
            calendarBlocked: 'calendar-blocked.html',
            eventReminder: 'event-reminder.html',
            slotsWarning: 'slots-warning.html',
        };
        Object.entries(templates).forEach(([templateKey, templateFileName]) => {
            try {
                const templatePath = path_1.default.join(__dirname, 'templates', templateFileName);
                this.templatesHtml[templateKey] = fs_1.default.readFileSync(templatePath, 'utf-8');
            }
            catch (error) {
                common_1.Logger.error(`Failed to load template: ${templateKey}`, error);
            }
        });
        common_1.Logger.log('Emails loaded into memory');
    }
    formatDate(date) {
        return date.toLocaleString('es-ES', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }
    async sendEmail({ to, subject, htmlContent, params, }) {
        try {
            const sendSmtpEmailParams = {
                params,
                bcc: Array.isArray(to)
                    ? to.map((email) => ({ email }))
                    : [{ email: to }],
                subject,
                htmlContent,
                sender: {
                    name: this.SENDER_NAME,
                    email: this.configService.getOrThrow('SENDINBLUE_SENDER_EMAIL'),
                },
            };
            await this.sendinblueInstance.sendTransacEmail(sendSmtpEmailParams);
        }
        catch (error) {
            common_1.Logger.error(error);
            throw new common_1.InternalServerErrorException('Error sending email');
        }
    }
    async sendEmailVerificationCodeRegister({ to, verificationCode, }) {
        const template = this.templatesHtml.emailVerificationCodeRegister;
        await this.sendEmail({
            params: {
                verification_code: verificationCode,
            },
            to,
            subject: this.VERIFICATION_CODE_SUBJECT,
            htmlContent: template,
        });
    }
    async sendEmailVerificationCodeChange({ to, verificationCode, }) {
        const template = this.templatesHtml.emailVerificationCodeChange;
        await this.sendEmail({
            params: {
                verification_code: verificationCode,
            },
            to,
            subject: this.VERIFICATION_CODE_SUBJECT,
            htmlContent: template,
        });
    }
    async sendForgotPasswordCode({ to, recoveryToken, }) {
        const template = this.templatesHtml.forgotPasswordCode;
        await this.sendEmail({
            params: {
                password_recovery_token: recoveryToken,
            },
            to,
            subject: this.PASSWORD_RECOVERY_SUBJECT,
            htmlContent: template,
        });
    }
    async sendWelcome({ to, fullName }) {
        const template = this.templatesHtml.welcome;
        await this.sendEmail({
            params: {
                fullName: fullName,
            },
            to,
            subject: this.WELCOME_SUBJECT,
            htmlContent: template,
        });
    }
    async sendEmailAboutWaitlist(to) {
        const template = this.templatesHtml.waitingList;
        await this.sendEmail({
            to,
            subject: this.WAITING_LIST,
            htmlContent: template,
        });
    }
    async sendEmailAboutBlockedCalendar(to) {
        const template = this.templatesHtml.calendarBlocked;
        await this.sendEmail({
            to,
            subject: this.CALENDAR_BLOCKED,
            htmlContent: template,
        });
    }
    async sendUserOnboardedToAdmins({ fullName }) {
        const admins = await this.usersService.findAll({
            role: 'ADMIN',
        });
        const template = this.templatesHtml.newUserOnboarded;
        for (const admin of admins) {
            await this.sendEmail({
                to: admin.email,
                params: {
                    fullName,
                },
                subject: this.NEW_USER_ONBOARDED_SUBJECT,
                htmlContent: template,
            });
        }
    }
    async sendNewEventNotification({ eventId }) {
        common_1.Logger.log('Sending new event notification');
        const template = this.templatesHtml.newEventNotification;
        const event = await this.getEventWithDetails(eventId);
        if (event.isClub) {
            await this.sendClubEventNotification(event, template);
        }
        else {
            await this.sendCourseEventNotification(event, template);
        }
    }
    async sendEventReminders() {
        const now = new Date();
        const reminderTime = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        const upcomingEvents = await this.databaseService.event.findMany({
            where: {
                startDate: {
                    gte: new Date(reminderTime.setMinutes(0, 0, 0)),
                    lt: new Date(reminderTime.setMinutes(59, 59, 999)),
                },
            },
            include: {
                users: {
                    include: {
                        user: true,
                    },
                    where: {
                        waitlistEventId: null,
                    },
                },
            },
        });
        if (upcomingEvents.length === 0) {
            return;
        }
        for (const event of upcomingEvents) {
            const emails = event.users.map(({ user }) => user.email);
            if (emails.length > 0) {
                await this.sendEventReminderEmails(emails, event);
            }
        }
    }
    async getEventWithDetails(eventId) {
        return this.databaseService.event.findUniqueOrThrow({
            where: {
                id: eventId,
            },
            include: {
                predefinedEvent: {
                    include: {
                        courses: {
                            include: {
                                course: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async sendSlotsWarningForAdmins(event) {
        const admins = await this.usersService.findAll({
            role: 'ADMIN',
        });
        const emails = this.filterEmails(admins);
        if (emails.length > 0) {
            await this.sendEmail({
                to: emails,
                params: {
                    title: event.title,
                    date: this.formatDate(event.startDate),
                },
                subject: this.SLOTS_WARNING_SUBJECT,
                htmlContent: this.templatesHtml.slotsWarning,
            });
        }
    }
    async sendClubEventNotification(event, template) {
        const users = await this.usersService.findAll({
            isInClub: true,
            role: 'STUDENT',
            receiveEmailsOnNewEvent: true,
        });
        const emails = this.filterEmails(users);
        if (emails.length > 0) {
            await this.sendEmail({
                to: emails,
                params: {
                    title: event.title,
                },
                subject: this.NEW_EVENT_NOTIFICATION_SUBJECT,
                htmlContent: template,
            });
        }
    }
    async sendCourseEventNotification(event, template) {
        var _a;
        const courseIds = (_a = event.predefinedEvent) === null || _a === void 0 ? void 0 : _a.courses.map((c) => c.courseId);
        const users = await this.usersService.findAll({
            courseId: {
                in: courseIds,
            },
            role: 'STUDENT',
            receiveEmailsOnNewEvent: true,
        });
        const emails = this.filterEmails(users);
        if (emails.length > 0) {
            await this.sendEmail({
                to: emails,
                params: {
                    title: event.predefinedEvent.title,
                },
                subject: this.NEW_EVENT_NOTIFICATION_SUBJECT,
                htmlContent: template,
            });
        }
    }
    filterEmails(users) {
        let emails = users.map((user) => user.email);
        if (process.env.NODE_ENV === 'development') {
            emails = emails.filter((email) => email === process.env.TEST_DEV_STUDENT_EMAIL);
        }
        return emails;
    }
    async sendEventReminderEmails(to, event) {
        await this.sendEmail({
            to,
            params: {
                title: event.title,
                date: this.formatDate(event.startDate),
            },
            subject: this.EVENT_REMINDER_SUBJECT,
            htmlContent: this.templatesHtml.eventReminder,
        });
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "sendEventReminders", null);
EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        database_service_1.DatabaseService])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map