/// <reference types="cookie-parser" />
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class CsrfMiddleware implements NestMiddleware {
    private readonly csrfCsrf;
    use(req: Request, _res: Response, next: NextFunction): void;
}
