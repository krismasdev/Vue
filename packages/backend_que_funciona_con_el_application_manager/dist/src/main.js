"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const database_exception_filter_1 = require("./database/database.exception-filter");
const http_exception_filter_1 = require("./common/http.exception-filter");
const nestjs_i18n_1 = require("nestjs-i18n");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)(configService.getOrThrow('COOKIE_SECRET')));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    const i18nService = app.get(nestjs_i18n_1.I18nService);
    app.useGlobalFilters(new database_exception_filter_1.PrismaClientExceptionFilter(httpAdapter), new http_exception_filter_1.HttpExceptionFilter(i18nService));
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = configService.getOrThrow('CORS_ORIGINS');
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Aula anclademia backend')
        .setVersion('1.0')
        .setVersion('1.0')
        .addGlobalParameters({
        name: 'x-csrf-protection',
        in: 'header',
        required: true,
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
//# sourceMappingURL=main.js.map