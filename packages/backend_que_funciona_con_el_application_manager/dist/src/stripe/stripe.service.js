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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
const stripe_module_1 = require("./stripe.module");
const database_service_1 = require("./../database/database.service");
let StripeService = class StripeService {
    constructor(options, databaseService) {
        this.options = options;
        this.databaseService = databaseService;
        if (!this.options.isActivated) {
            this.stripe = null;
            return;
        }
        this.stripe = new stripe_1.default(this.options.apiKey, this.options.options);
    }
};
StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(stripe_module_1.MODULE_OPTIONS_TOKEN)),
    __metadata("design:paramtypes", [Object, database_service_1.DatabaseService])
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map