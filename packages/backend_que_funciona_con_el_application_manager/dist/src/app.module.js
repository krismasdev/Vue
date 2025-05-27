"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const videos_module_1 = require("./videos/videos.module");
const config_1 = require("@nestjs/config");
const joi_1 = __importDefault(require("joi"));
const csrf_middleware_1 = require("./auth/csrf.middleware");
const file_system_module_1 = require("./file-system/file-system.module");
const quiz_module_1 = require("./quiz/quiz.module");
const events_module_1 = require("./events/events.module");
const email_module_1 = require("./email/email.module");
const schedule_1 = require("@nestjs/schedule");
const chat_module_1 = require("./chat/chat.module");
const refresh_token_interceptor_1 = require("./auth/refresh-token.interceptor");
const core_1 = require("@nestjs/core");
const zoom_module_1 = require("./zoom/zoom.module");
const stripe_module_1 = require("./stripe/stripe.module");
const nestjs_i18n_1 = require("nestjs-i18n");
const payments_module_1 = require("./payments/payments.module");
const stats_module_1 = require("./stats/stats.module");
const web_push_module_1 = require("./web-push/web-push.module");
const path_1 = __importDefault(require("path"));
const event_emitter_1 = require("@nestjs/event-emitter");
const log_snag_module_1 = require("./log-snag/log-snag.module");
const woocommerce_module_1 = require("./woocommerce/woocommerce.module");
const throttler_1 = require("@nestjs/throttler");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(csrf_middleware_1.CsrfMiddleware).exclude('zoom/webhook').forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
                cache: true,
                load: [
                    () => ({
                        SECURE_COOKIES: process.env.NODE_ENV === 'production',
                        CORS_ORIGINS: [process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2],
                    }),
                ],
                validationSchema: joi_1.default.object({
                    NODE_ENV: joi_1.default.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    PORT: joi_1.default.number().default(3000),
                    DATABASE_URL: joi_1.default.string().required(),
                    AUTH_COOKIE_NAME: joi_1.default.string().default('__aula_anclademia_sessiontoken'),
                    JWT_SECRET: joi_1.default.string().required(),
                    COOKIE_SECRET: joi_1.default.string().required(),
                    S3_ACCESS_KEY_ID: joi_1.default.string().required(),
                    S3_SECRET_ACCESS_KEY: joi_1.default.string().required(),
                    S3_REGION: joi_1.default.string().required(),
                    S3_ENDPOINT: joi_1.default.string().required(),
                    S3_PUBLIC_URL: joi_1.default.string().required(),
                    S3_PUBLIC_BUCKET_NAME: joi_1.default.string().required(),
                    S3_PRIVATE_BUCKET_NAME: joi_1.default.string().required(),
                    CORS_ORIGIN_1: joi_1.default.string().required(),
                    CORS_ORIGIN_2: joi_1.default.string().required(),
                    HOST_DOMAIN: joi_1.default.string().required(),
                    SENDINBLUE_API_KEY: joi_1.default.string().required(),
                    GENERATE_RANDOM_PROFILE_PICTURE: joi_1.default.boolean().default(false),
                    ZOOM_WEBHOOK_SECRET: joi_1.default.string().required(),
                    VAPID_PUBLIC_KEY: joi_1.default.string().required(),
                    VAPID_PRIVATE_KEY: joi_1.default.string().required(),
                    AUTH_SESSION_DURATION_MS: joi_1.default.number().default(1000 * 60 * 60 * 24 * 3),
                    PASSWORD_RECOVERY_TOKEN_DURATION_MS: joi_1.default.number().default(1000 * 60 * 30),
                    LOG_SNAG_API_KEY: joi_1.default.string().optional(),
                    LOG_SNAG_ACTIVE: joi_1.default.boolean().default(false),
                    LOG_SNAG_PROJECT: joi_1.default.string().optional().default('aula-anclademia'),
                    WOOCOMMERCE_API_KEY: joi_1.default.string().required(),
                    WOOCOMMERCE_API_SECRET: joi_1.default.string().required(),
                    WOOCOMMERCE_API_BASE_URL: joi_1.default.string().required(),
                }),
                validationOptions: {
                    allowUnknown: true,
                    abortEarly: true,
                },
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            videos_module_1.VideosModule,
            config_1.ConfigModule,
            file_system_module_1.FileSystemModule,
            quiz_module_1.QuizModule,
            events_module_1.EventsModule,
            email_module_1.EmailModule,
            schedule_1.ScheduleModule.forRoot(),
            chat_module_1.ChatModule,
            zoom_module_1.ZoomModule,
            stripe_module_1.StripeModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: () => ({
                    isActivated: false,
                    apiKey: null,
                    options: {
                        apiVersion: '2023-08-16',
                    },
                }),
            }),
            nestjs_i18n_1.I18nModule.forRoot({
                resolvers: [new nestjs_i18n_1.HeaderResolver(['x-lang'])],
                fallbackLanguage: 'es',
                loaderOptions: {
                    path: path_1.default.join(__dirname, '/i18n/'),
                    watch: true,
                },
                loader: nestjs_i18n_1.I18nJsonLoader,
            }),
            payments_module_1.PaymentsModule,
            stats_module_1.StatsModule,
            web_push_module_1.WebPushModule,
            event_emitter_1.EventEmitterModule.forRoot({
                global: true,
            }),
            log_snag_module_1.LogSnagModule,
            woocommerce_module_1.WoocommerceModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 15000,
                    limit: 30,
                },
            ]),
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: refresh_token_interceptor_1.RefreshTokenInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map