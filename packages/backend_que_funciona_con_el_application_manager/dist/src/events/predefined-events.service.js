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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredefinedEventsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let PredefinedEventsService = class PredefinedEventsService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async findAll(where) {
        return await this.databaseService.predefinedEvent.findMany({
            where,
            orderBy: {
                title: 'asc',
            },
            include: {
                courses: true,
            },
        });
    }
    async create(createPredefinedEventDto) {
        const { courseIds } = createPredefinedEventDto, rest = __rest(createPredefinedEventDto, ["courseIds"]);
        await this.databaseService.predefinedEvent.create({
            data: Object.assign(Object.assign({}, rest), { courses: {
                    create: courseIds.map((id) => ({
                        courseId: id,
                    })),
                } }),
        });
    }
    async delete(id) {
        await this.databaseService.predefinedEvent.delete({
            where: {
                id,
            },
        });
    }
    async update(id, updatePredefinedEventDto) {
        const { courseIds } = updatePredefinedEventDto, rest = __rest(updatePredefinedEventDto, ["courseIds"]);
        await this.databaseService.predefinedEvent.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign({}, rest), { courses: {
                    deleteMany: {},
                    create: courseIds.map((id) => ({
                        courseId: id,
                    })),
                } }),
        });
    }
};
PredefinedEventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PredefinedEventsService);
exports.PredefinedEventsService = PredefinedEventsService;
//# sourceMappingURL=predefined-events.service.js.map