"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemModule = void 0;
const common_1 = require("@nestjs/common");
const file_system_service_1 = require("./file-system.service");
const file_system_controller_1 = require("./file-system.controller");
let FileSystemModule = class FileSystemModule {
};
FileSystemModule = __decorate([
    (0, common_1.Module)({
        controllers: [file_system_controller_1.FileSystemController],
        providers: [file_system_service_1.FileSystemService],
        exports: [file_system_service_1.FileSystemService],
    })
], FileSystemModule);
exports.FileSystemModule = FileSystemModule;
//# sourceMappingURL=file-system.module.js.map