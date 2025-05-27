"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPushModule = void 0;
const common_1 = require("@nestjs/common");
const web_push_service_1 = require("./web-push.service");
const web_push_controller_1 = require("./web-push.controller");
const web_push_event_handler_1 = require("./web-push.event-handler");
const log_snag_module_1 = require("../log-snag/log-snag.module");
let WebPushModule = class WebPushModule {
};
WebPushModule = __decorate([
    (0, common_1.Module)({
        providers: [web_push_service_1.WebPushService, web_push_event_handler_1.WebpushEventHandler],
        controllers: [web_push_controller_1.WebPushController],
        exports: [web_push_service_1.WebPushService],
        imports: [log_snag_module_1.LogSnagModule],
    })
], WebPushModule);
exports.WebPushModule = WebPushModule;
//# sourceMappingURL=web-push.module.js.map