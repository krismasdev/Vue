"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseDatePipe = void 0;
const common_1 = require("@nestjs/common");
const bad_request_exception_1 = require("@nestjs/common/exceptions/bad-request.exception");
let ParseDatePipe = class ParseDatePipe {
    transform(value) {
        if (!value)
            throw new bad_request_exception_1.BadRequestException('Date is required');
        if (typeof value === 'function') {
            value = value();
        }
        const transformedValue = new Date(value);
        if (isNaN(transformedValue.getTime())) {
            throw new bad_request_exception_1.BadRequestException('Invalid date');
        }
        return transformedValue;
    }
};
ParseDatePipe = __decorate([
    (0, common_1.Injectable)()
], ParseDatePipe);
exports.ParseDatePipe = ParseDatePipe;
//# sourceMappingURL=parse-date.pipe.js.map