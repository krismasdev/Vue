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
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor(i18n) {
        this.i18n = i18n;
    }
    catch(exception, host) {
        var _a;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const locale = (Array.isArray(request.headers['x-lang'])
            ? request.headers['x-lang'][0]
            : request.headers['x-lang']) || 'en';
        const errorResponse = exception.getResponse();
        const traslatedMessages = Array.isArray(errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.message)
            ? (_a = errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.message) === null || _a === void 0 ? void 0 : _a.map((message) => {
                return this.i18n.translate(message, {
                    lang: locale,
                });
            })
            : this.i18n.translate((errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.message) || '', {
                lang: locale,
            });
        common_1.Logger.error(exception);
        response.status(status).json({
            message: traslatedMessages ||
                (errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.message) ||
                (errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.error) ||
                'Internal server error',
            statusCode: status,
        });
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [nestjs_i18n_1.I18nService])
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=http.exception-filter.js.map