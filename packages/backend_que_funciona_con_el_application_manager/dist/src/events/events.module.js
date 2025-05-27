"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const events_controller_1 = require("./events.controller");
const users_events_service_1 = require("./users-events.service");
const predefined_events_service_1 = require("./predefined-events.service");
const users_module_1 = require("../users/users.module");
const woocommerce_service_1 = require("../woocommerce/woocommerce.service");
const axios_1 = require("@nestjs/axios");
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    (0, common_1.Module)({
        controllers: [events_controller_1.EventsController],
        providers: [
            events_service_1.EventsService,
            users_events_service_1.UsersOnEventsService,
            predefined_events_service_1.PredefinedEventsService,
            woocommerce_service_1.WoocommerceService,
        ],
        imports: [users_module_1.UsersModule, axios_1.HttpModule],
    })
], EventsModule);
exports.EventsModule = EventsModule;
//# sourceMappingURL=events.module.js.map