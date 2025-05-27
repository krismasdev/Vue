import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly i18n;
    constructor(i18n: I18nService);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
