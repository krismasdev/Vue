"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesModule = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const courses_controller_1 = require("./courses.controller");
const database_module_1 = require("../database/database.module");
const file_system_module_1 = require("../file-system/file-system.module");
let CoursesModule = class CoursesModule {
};
CoursesModule = __decorate([
    (0, common_1.Module)({
        controllers: [courses_controller_1.CoursesController],
        providers: [courses_service_1.CoursesService],
        imports: [database_module_1.DatabaseModule, file_system_module_1.FileSystemModule],
    })
], CoursesModule);
exports.CoursesModule = CoursesModule;
//# sourceMappingURL=courses.module.js.map