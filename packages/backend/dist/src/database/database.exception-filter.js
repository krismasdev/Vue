"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClientExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
let PrismaClientExceptionFilter = class PrismaClientExceptionFilter extends core_1.BaseExceptionFilter {
    constructor(applicationRef) {
        super(applicationRef);
        this.errorCodesStatusMapping = {
            P2000: common_1.HttpStatus.BAD_REQUEST,
            P2002: common_1.HttpStatus.CONFLICT,
            P2025: common_1.HttpStatus.NOT_FOUND,
            P2034: common_1.HttpStatus.BAD_REQUEST,
        };
        this.errorCodesMessage = {
            P2000: (target) => 'VALUE_TOO_LONG_' + target,
            P2002: (target) => 'DUPLICATE_VALUE_' + target,
            P2025: (target) => 'NOT_FOUND_' + target,
            P2034: (_target) => 'GENERAL_ERROR',
        };
    }
    catch(exception, host) {
        return this.catchClientKnownRequestError(exception, host);
    }
    catchClientKnownRequestError(exception, host) {
        var _a;
        if (exception.code === 'P2034') {
            const ctx = host.switchToHttp();
            const request = ctx.getRequest();
            const locale = (Array.isArray(request.headers['x-lang'])
                ? request.headers['x-lang'][0]
                : request.headers['x-lang']) || 'en';
            const message = locale === 'en'
                ? 'There was an error. Please try again.'
                : 'Hubo un error. Por favor, inténtelo de nuevo.';
            return super.catch(new common_1.HttpException({ statusCode: common_1.HttpStatus.BAD_REQUEST, message }, common_1.HttpStatus.BAD_REQUEST), host);
        }
        if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
            return super.catch(exception, host);
        }
        const statusCode = this.errorCodesStatusMapping[exception.code];
        const baseStr = this.errorCodesMessage[exception.code](((_a = exception.meta) === null || _a === void 0 ? void 0 : _a.target) || '');
        const message = baseStr;
        return super.catch(new common_1.HttpException({ statusCode, message }, statusCode), host);
    }
};
PrismaClientExceptionFilter = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError),
    __metadata("design:paramtypes", [Object])
], PrismaClientExceptionFilter);
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter;
//# sourceMappingURL=database.exception-filter.js.map