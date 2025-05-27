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
exports.EventsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const auth_decorator_1 = require("../auth/auth.decorator");
const user_decorator_1 = require("../auth/user.decorator");
const schedule_1 = require("@nestjs/schedule");
const dto_1 = require("./dto");
const predefined_events_service_1 = require("./predefined-events.service");
const users_events_service_1 = require("./users-events.service");
const parse_date_pipe_1 = require("../common/parse-date.pipe");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_created_event_1 = require("../event-emitter/events/event-created.event");
const update_waitlist_dto_1 = require("./dto/update-waitlist.dto");
const woocommerce_service_1 = require("../woocommerce/woocommerce.service");
let EventsController = class EventsController {
    constructor(eventsService, usersOnEventsService, predefinedEventsService, eventEmitter, woocommerceService) {
        this.eventsService = eventsService;
        this.usersOnEventsService = usersOnEventsService;
        this.predefinedEventsService = predefinedEventsService;
        this.eventEmitter = eventEmitter;
        this.woocommerceService = woocommerceService;
    }
    async markPastUsersOnEventsAsCompleted() {
        await this.usersOnEventsService.markPastAsCompleted();
    }
    async update(id, updateEventDto) {
        await this.eventsService.update(id, updateEventDto);
    }
    async findAllPredefined(courseId) {
        return await this.predefinedEventsService.findAll({
            courses: courseId && {
                some: {
                    courseId,
                },
            },
        });
    }
    async createPredefined(createPredefinedEventDto) {
        await this.predefinedEventsService.create(createPredefinedEventDto);
    }
    async updatePredefined(updatePredefinedEventDto, id) {
        await this.predefinedEventsService.update(id, updatePredefinedEventDto);
    }
    async deletePredefined(id) {
        await this.predefinedEventsService.delete(id);
    }
    async findAllUsersOnEvents(userId, user) {
        await this.usersOnEventsService.checkFindAllPermissions({
            resourceUserId: userId,
            loggedInUser: user,
        });
        return await this.usersOnEventsService.findAllByUserId(userId);
    }
    async deleteUserOnEvent(userId, eventId) {
        await this.usersOnEventsService.delete(userId, eventId);
    }
    async create(createEventDto) {
        const event = await this.eventsService.create(createEventDto);
        if (event) {
            this.eventEmitter.emit('event.created', new event_created_event_1.EventCreatedEvent(event.id));
        }
    }
    async loadBookingsFromWoocommerce() {
        return await this.woocommerceService.retrieveBookings();
    }
    async loadOrdersFromWoocommerce(ids) {
        return await this.woocommerceService.retrieveCurrentOrders(ids);
    }
    async findAllForUser(user, date, onlyClub, predefinedEventId, courseId) {
        const PREV_MONTH_FIRST_DAY = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const NEXT_MONTH_LAST_DAY = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        if (user.role === 'TEACHER' || user.role === 'ADMIN') {
            const OR = [];
            if ((onlyClub && predefinedEventId) ||
                (onlyClub && courseId) ||
                (predefinedEventId && courseId)) {
                throw new common_1.BadRequestException('You cannot filter by onlyClub, predefinedEventId or courseId at the same time');
            }
            if (onlyClub) {
                OR.push({
                    isClub: true,
                });
            }
            else if (predefinedEventId) {
                OR.push({
                    predefinedEventId,
                });
            }
            else if (courseId) {
                OR.push({
                    predefinedEvent: {
                        courses: {
                            some: {
                                courseId,
                            },
                        },
                    },
                });
            }
            return this.eventsService.findAll({
                OR: OR.length ? OR : undefined,
                startDate: {
                    gte: PREV_MONTH_FIRST_DAY,
                    lt: NEXT_MONTH_LAST_DAY,
                },
            });
        }
        else {
            if (predefinedEventId || onlyClub || courseId) {
                throw new common_1.ForbiddenException('You cannot filter by predefinedEventId, onlyClub or courseId');
            }
            const userIsInClub = user.isInClub;
            let OR = [];
            if (userIsInClub) {
                OR = [
                    {
                        isClub: true,
                    },
                    {
                        isClub: false,
                        predefinedEvent: user.courseId && {
                            courses: {
                                some: {
                                    courseId: user.courseId,
                                },
                            },
                        },
                    },
                ];
            }
            else {
                OR = [
                    {
                        isClub: false,
                        predefinedEvent: user.courseId && {
                            courses: {
                                some: {
                                    courseId: user.courseId,
                                },
                            },
                        },
                    },
                ];
            }
            return this.eventsService.findAll({
                OR,
                startDate: {
                    gte: PREV_MONTH_FIRST_DAY,
                    lt: NEXT_MONTH_LAST_DAY,
                },
            });
        }
    }
    async remove(id, recurrence) {
        await this.eventsService.remove(id, recurrence);
    }
    async updateBooking(updateBookingDto, currentUser, eventId, userId) {
        if (currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER') {
            await this.usersOnEventsService.updateBooking(updateBookingDto, eventId, userId);
            return;
        }
        else if (currentUser.id === userId) {
            await this.usersOnEventsService.updateBooking(updateBookingDto, eventId, userId);
            return;
        }
        throw new common_1.ForbiddenException();
    }
    async updateWaitlist(updateWaitlistDto, currentUser, eventId, userId) {
        if (currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER') {
            await this.usersOnEventsService.updateWaitlist(updateWaitlistDto, eventId, userId);
            return;
        }
        else if (currentUser.id === userId) {
            await this.usersOnEventsService.updateWaitlist(updateWaitlistDto, eventId, userId);
            return;
        }
        throw new common_1.ForbiddenException();
    }
    async markUsersAsVisited(eventId, userId, isPresent) {
        await this.usersOnEventsService.markUsersAsVisited(eventId, userId, isPresent);
    }
    async markUsersOnEventsAsCompleted(predefinedEventId, userId) {
        await this.usersOnEventsService.artificiallyMarkPendingAsCompleted(userId, predefinedEventId);
    }
    async findAllPublic(date, courseId) {
        if (!courseId) {
            throw new common_1.BadRequestException('courseId is required');
        }
        const PREV_MONTH_FIRST_DAY = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const NEXT_MONTH_LAST_DAY = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        const events = await this.eventsService.findAll({
            startDate: {
                gte: PREV_MONTH_FIRST_DAY,
                lt: NEXT_MONTH_LAST_DAY,
            },
            isClub: courseId === 'CLUB' ? true : undefined,
            predefinedEvent: courseId !== 'CLUB'
                ? {
                    courses: {
                        some: {
                            courseId,
                        },
                    },
                }
                : undefined,
        });
        return events.map((event) => new dto_1.GetEventsPublicResponseDto(event));
    }
};
__decorate([
    (0, schedule_1.Cron)(process.env.NODE_ENV === 'development'
        ? schedule_1.CronExpression.EVERY_10_SECONDS
        : schedule_1.CronExpression.EVERY_10_MINUTES),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "markPastUsersOnEventsAsCompleted", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Patch)('events/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "update", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)('predefined-events'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAllPredefined", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)('predefined-events'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePredefinedEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createPredefined", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Patch)('predefined-events/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdatePredefinedEventDto, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updatePredefined", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)('predefined-events/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "deletePredefined", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)('users-on-events/:userId'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAllUsersOnEvents", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)('/users-on-events/:userId/:eventId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "deleteUserOnEvent", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)('events'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "create", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Get)('bookings'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "loadBookingsFromWoocommerce", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)('booking-orders'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "loadOrdersFromWoocommerce", null);
__decorate([
    (0, auth_decorator_1.Auth)('STUDENT', 'ADMIN', 'TEACHER'),
    (0, common_1.Get)('events'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('date', new common_1.DefaultValuePipe(() => new Date()), parse_date_pipe_1.ParseDatePipe)),
    __param(2, (0, common_1.Query)('onlyClub', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __param(3, (0, common_1.Query)('predefinedEventId')),
    __param(4, (0, common_1.Query)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Date, Boolean, String, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAllForUser", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)('events/:id/'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('recurrence')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "remove", null);
__decorate([
    (0, auth_decorator_1.Auth)('STUDENT', 'ADMIN', 'TEACHER'),
    (0, common_1.Post)('users-on-events/:eventId/:userId/bookings'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('eventId')),
    __param(3, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateBookingDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateBooking", null);
__decorate([
    (0, auth_decorator_1.Auth)('STUDENT', 'ADMIN', 'TEACHER'),
    (0, common_1.Post)('users-on-events/:eventId/:userId/waitlist'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('eventId')),
    __param(3, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_waitlist_dto_1.UpdateWaitlistDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateWaitlist", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Put)('users-on-events/:eventId/:userId/mark-presence'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)('isPresent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "markUsersAsVisited", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)('mark-predefined-events-as-completed/:predefinedEventId/:userId'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('predefinedEventId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "markUsersOnEventsAsCompleted", null);
__decorate([
    (0, common_1.Get)('events/public'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/get-events-public.response.dto").GetEventsPublicResponseDto] }),
    __param(0, (0, common_1.Query)('date', new common_1.DefaultValuePipe(() => new Date()), parse_date_pipe_1.ParseDatePipe)),
    __param(1, (0, common_1.Query)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAllPublic", null);
EventsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        users_events_service_1.UsersOnEventsService,
        predefined_events_service_1.PredefinedEventsService,
        event_emitter_1.EventEmitter2,
        woocommerce_service_1.WoocommerceService])
], EventsController);
exports.EventsController = EventsController;
//# sourceMappingURL=events.controller.js.map