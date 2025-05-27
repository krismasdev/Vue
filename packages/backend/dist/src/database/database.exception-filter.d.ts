import { ArgumentsHost, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
export type ErrorCodesStatusMapping = {
    [key: string]: number;
};
export type ErrorCodesMessageMapping = {
    [key: string]: (target: string) => string;
};
export declare class PrismaClientExceptionFilter extends BaseExceptionFilter {
    private errorCodesStatusMapping;
    private errorCodesMessage;
    constructor(applicationRef?: HttpServer);
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void;
    private catchClientKnownRequestError;
}
