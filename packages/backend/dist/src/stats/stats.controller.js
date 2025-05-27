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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const stats_service_1 = require("./stats.service");
const auth_decorator_1 = require("../auth/auth.decorator");
const user_decorator_1 = require("../auth/user.decorator");
let StatsController = class StatsController {
    constructor(statsService) {
        this.statsService = statsService;
    }
    async getStatsAdmin() {
        return await this.statsService.getStatsAdmin();
    }
    async getStatsTeacher() {
        return await this.statsService.getStatsTeacher();
    }
    async getStatsStudent(user) {
        return await this.statsService.getStatsStudent(user);
    }
};
__decorate([
    (0, common_1.Get)('admin'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    openapi.ApiResponse({ status: 200, type: require("./stats.response").StatsAdminResponse }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getStatsAdmin", null);
__decorate([
    (0, common_1.Get)('teacher'),
    (0, auth_decorator_1.Auth)('TEACHER', 'ADMIN'),
    openapi.ApiResponse({ status: 200, type: require("./stats.response").StatsTeacherResponse }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getStatsTeacher", null);
__decorate([
    (0, common_1.Get)('student'),
    (0, auth_decorator_1.Auth)('STUDENT'),
    openapi.ApiResponse({ status: 200, type: require("./stats.response").StatsStudentResponse }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getStatsStudent", null);
StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
exports.StatsController = StatsController;
//# sourceMappingURL=stats.controller.js.map