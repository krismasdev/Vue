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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const users_service_1 = require("../users/users.service");
const date_fns_1 = require("date-fns");
const email_service_1 = require("../email/email.service");
let EventsService = class EventsService {
    constructor(databaseService, usersService, emailService) {
        this.databaseService = databaseService;
        this.usersService = usersService;
        this.emailService = emailService;
    }
    async update(id, updateEventDto) {
        const event = await this.databaseService.event.findUnique({
            where: {
                id,
            },
        });
        const takenSlots = await this.databaseService.usersOnEvents.count({
            where: {
                eventId: id,
                waitlistEventId: null,
            },
        });
        if (updateEventDto.enableBooking &&
            updateEventDto.totalSlots < takenSlots) {
            throw new common_1.BadRequestException('events.TOTAL_SLOTS_LESS_THAN_BOOKED');
        }
        if (updateEventDto.title) {
            if (!event.isClub) {
                throw new common_1.BadRequestException('Cannot update title if the event is not a club event');
            }
        }
        const updatedEvent = await this.databaseService.event.update({
            where: {
                id,
            },
            include: {
                waitlist: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    where: {
                        waitlistEventId: id,
                    },
                    select: {
                        user: {
                            select: {
                                email: true,
                                id: true,
                            },
                        },
                    },
                },
                users: {
                    where: {
                        waitlistEventId: null,
                    },
                },
            },
            data: updateEventDto,
        });
        const freeSlots = updatedEvent.totalSlots - updatedEvent.users.length;
        if (freeSlots < 2) {
            this.emailService.sendSlotsWarningForAdmins(updatedEvent);
        }
        if (updateEventDto.enableBooking &&
            event.totalSlots !== updateEventDto.totalSlots) {
            if (updatedEvent.waitlist.length > 0 &&
                updatedEvent.totalSlots > updatedEvent.users.length) {
                const freeSlots = updatedEvent.totalSlots - updatedEvent.users.length;
                const waitlistedUsers = updatedEvent.waitlist.slice(0, freeSlots);
                const waitlistedUsersIds = waitlistedUsers.map(({ user }) => user.id);
                if (waitlistedUsersIds.length > 0) {
                    await this.databaseService.usersOnEvents.updateMany({
                        where: {
                            userId: {
                                in: waitlistedUsersIds,
                            },
                            eventId: updatedEvent.id,
                            waitlistEventId: updatedEvent.id,
                        },
                        data: {
                            waitlistEventId: null,
                        },
                    });
                    for (const { user } of waitlistedUsers) {
                        await this.emailService.sendEmailAboutWaitlist(user.email);
                    }
                }
            }
            return updatedEvent;
        }
    }
    async create(_a) {
        var { repeatDays } = _a, body = __rest(_a, ["repeatDays"]);
        if (body.recurrenceRule || repeatDays) {
            return this.createMany(Object.assign(Object.assign({}, body), { repeatDays }));
        }
        if (body.isClub) {
            return this.databaseService.event.create({
                data: Object.assign(Object.assign({}, body), { predefinedEventId: null }),
            });
        }
        return this.databaseService.event.create({
            data: Object.assign(Object.assign({}, body), { title: null }),
        });
    }
    async createMany(createEventDto) {
        const events = [];
        let { startDate, endDate } = createEventDto;
        const { repeatDays, repeatDates, recurrenceRule, recurrenceEnd } = createEventDto, body = __rest(createEventDto, ["repeatDays", "repeatDates", "recurrenceRule", "recurrenceEnd"]);
        const isWeekdays = recurrenceRule === 'weekdays';
        if (repeatDates && repeatDates.length > 0) {
            const firstDate = new Date(Math.min(...repeatDates.map((date) => date.getTime())));
            if ((0, date_fns_1.isBefore)(firstDate, new Date())) {
                throw new common_1.BadRequestException('events.START_DATE_MUST_BE_IN_THE_FUTURE');
            }
            startDate = firstDate;
            endDate = (0, date_fns_1.addHours)(firstDate, 1);
        }
        const end = recurrenceEnd
            ? (0, date_fns_1.addDays)(recurrenceEnd, 1)
            : (0, date_fns_1.addYears)(startDate, recurrenceRule === 'annually' ? 10 : 1);
        const days = isWeekdays ? [1, 2, 3, 4, 5] : repeatDays !== null && repeatDays !== void 0 ? repeatDays : [];
        while ((0, date_fns_1.isBefore)(startDate, end)) {
            if (repeatDates || repeatDays || isWeekdays) {
                if (repeatDates) {
                    if (repeatDates.some((date) => (0, date_fns_1.isSameDay)(date, startDate))) {
                        events.push(Object.assign(Object.assign({}, body), { recurrenceEnd: end, recurrenceRule,
                            startDate,
                            endDate }));
                    }
                }
                else {
                    const date = (0, date_fns_1.getDay)(startDate);
                    if (days.includes(date)) {
                        events.push(Object.assign(Object.assign({}, body), { recurrenceEnd: end, recurrenceRule,
                            startDate,
                            endDate }));
                    }
                }
                startDate = (0, date_fns_1.addDays)(startDate, 1);
                endDate = (0, date_fns_1.addDays)(endDate, 1);
            }
            else {
                events.push(Object.assign(Object.assign({}, body), { recurrenceEnd: end, recurrenceRule,
                    startDate,
                    endDate }));
                if (recurrenceRule === 'daily') {
                    startDate = (0, date_fns_1.addDays)(startDate, 1);
                    endDate = (0, date_fns_1.addDays)(endDate, 1);
                }
                else if (recurrenceRule === 'weekly') {
                    startDate = (0, date_fns_1.addWeeks)(startDate, 1);
                    endDate = (0, date_fns_1.addWeeks)(endDate, 1);
                }
                else if (recurrenceRule === 'monthly') {
                    startDate = (0, date_fns_1.addMonths)(startDate, 1);
                    endDate = (0, date_fns_1.addMonths)(endDate, 1);
                }
                else if (recurrenceRule === 'annually') {
                    startDate = (0, date_fns_1.addYears)(startDate, 1);
                    endDate = (0, date_fns_1.addYears)(endDate, 1);
                }
            }
        }
        if (events.length > 0) {
            const createdEvents = await this.databaseService.$transaction(events.map((event) => this.databaseService.event.create({
                data: event,
            })));
            return createdEvents[0];
        }
    }
    async deleteMany(id, recurrenceRule) {
        const targetEvent = await this.databaseService.event.findUnique({
            where: {
                id,
            },
        });
        const events = await this.databaseService.event.findMany({
            where: {
                recurrenceRule,
                createdAt: targetEvent.createdAt,
                startDate: {
                    gte: targetEvent.startDate,
                },
            },
        });
        const eventIds = events.map((event) => event.id);
        const eventDates = events.map((event) => event.createdAt);
        await this.databaseService.event.deleteMany({
            where: {
                id: {
                    in: eventIds,
                },
                createdAt: {
                    in: eventDates,
                },
            },
        });
    }
    async findAll(where) {
        const events = await this.databaseService.event.findMany({
            where: Object.assign(Object.assign({}, where), { isHidden: false }),
            include: {
                predefinedEvent: {
                    include: {
                        courses: {
                            include: {
                                course: true,
                            },
                        },
                    },
                },
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                profilePicturePath: true,
                                idNumber: true,
                            },
                        },
                    },
                },
                waitlist: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                profilePicturePath: true,
                                idNumber: true,
                            },
                        },
                        createdAt: true,
                    },
                },
                visitedUsers: {
                    select: {
                        user: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });
        return events.map((event) => {
            const waitlistUserIds = new Set(event.waitlist.map((relation) => relation.user.id));
            const common = {
                id: event.id,
                endDate: event.endDate,
                startDate: event.startDate,
                totalSlots: event.totalSlots,
                users: event.users
                    .map((relation) => relation.user)
                    .filter((user) => !waitlistUserIds.has(user.id))
                    .map((user) => (Object.assign(Object.assign({}, user), { pictureUrl: this.usersService.buildPictureUrl(user.profilePicturePath, user.id) }))),
                waitlist: event.waitlist.map((relation) => (Object.assign(Object.assign({}, relation.user), { pictureUrl: this.usersService.buildPictureUrl(relation.user.profilePicturePath, relation.user.id) }))),
                description: event.description,
                color: event.color,
                recurrenceRule: event.recurrenceRule,
                recurrenceEnd: event.recurrenceEnd,
                enableBooking: event.enableBooking,
                visitedUsers: event.visitedUsers.map((relation) => relation.user.id),
            };
            if (event.isClub) {
                return Object.assign(Object.assign({}, common), { title: event.title, courses: [], isClub: true });
            }
            else {
                return Object.assign(Object.assign({}, common), { courses: event.predefinedEvent.courses.map((relation) => ({
                        id: relation.course.id,
                        name: relation.course.name,
                    })), isClub: false, title: event.predefinedEvent.title });
            }
        });
    }
    async remove(id, recurrenceRule) {
        if (recurrenceRule) {
            return this.deleteMany(id, recurrenceRule);
        }
        await this.databaseService.event.delete({
            where: {
                id,
            },
        });
    }
    async findOne(id) {
        return this.databaseService.event.findUnique({
            where: {
                id,
            },
            include: {
                predefinedEvent: {
                    include: {
                        courses: true,
                    },
                },
            },
        });
    }
};
EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        users_service_1.UsersService,
        email_service_1.EmailService])
], EventsService);
exports.EventsService = EventsService;
//# sourceMappingURL=events.service.js.map