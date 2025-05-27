"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizFindAllPermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
let QuizFindAllPermissionsGuard = class QuizFindAllPermissionsGuard {
    async canActivate(context) {
        var _a;
        const request = context.switchToHttp().getRequest();
        const user = request === null || request === void 0 ? void 0 : request.user;
        const courseId = (_a = request === null || request === void 0 ? void 0 : request.query) === null || _a === void 0 ? void 0 : _a.courseId;
        if (courseId !== undefined && typeof courseId !== 'string') {
            return false;
        }
        if (user.role === 'ADMIN' || user.role === 'TEACHER')
            return true;
        if (!user.courseId)
            return false;
        if (!courseId)
            return false;
        if (user.courseId !== courseId)
            return false;
        return true;
    }
};
QuizFindAllPermissionsGuard = __decorate([
    (0, common_1.Injectable)()
], QuizFindAllPermissionsGuard);
exports.QuizFindAllPermissionsGuard = QuizFindAllPermissionsGuard;
//# sourceMappingURL=quiz-find-all-permissions.guard.js.map