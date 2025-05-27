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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersOnEventsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const email_service_1 = require("../email/email.service");
const date_fns_1 = require("date-fns");
let UsersOnEventsService = class UsersOnEventsService {
    constructor(databaseService, emailService) {
        this.databaseService = databaseService;
        this.emailService = emailService;
    }
    async checkFindAllPermissions({ resourceUserId, loggedInUser, }) {
        if (resourceUserId !== loggedInUser.id &&
            loggedInUser.role !== 'ADMIN' &&
            loggedInUser.role !== 'TEACHER') {
            throw new common_1.ForbiddenException();
        }
    }
    async findAllByUserId(userId) {
        return await this.databaseService.usersOnEvents.findMany({
            where: {
                user: {
                    id: userId,
                },
            },
            orderBy: {
                event: {
                    predefinedEvent: {
                        createdAt: 'asc',
                    },
                },
            },
            include: {
                event: {
                    include: {
                        predefinedEvent: {
                            include: {
                                courses: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async delete(userId, eventId) {
        await this.databaseService.usersOnEvents.delete({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
        });
    }
    async markPastAsCompleted() {
        await this.databaseService.usersOnEvents.updateMany({
            where: {
                event: {
                    endDate: {
                        lte: new Date(),
                    },
                },
            },
            data: {
                isCompleted: true,
            },
        });
    }
    async artificiallyMarkPendingAsCompleted(userId, predefinedEventId) {
        const user = await this.databaseService.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
            include: {
                course: true,
            },
        });
        const studentCourseId = user.courseId;
        const predEvent = await this.databaseService.predefinedEvent.findUniqueOrThrow({
            where: {
                id: predefinedEventId,
            },
            include: {
                courses: true,
            },
        });
        const courseIds = predEvent.courses.map((c) => c.courseId);
        if (!courseIds.includes(studentCourseId)) {
            throw new common_1.BadRequestException('User is not in the course of the event');
        }
        const usersOnEvents = await this.databaseService.usersOnEvents.findMany({
            where: {
                user: {
                    id: userId,
                },
                event: {
                    predefinedEventId,
                },
            },
        });
        if (usersOnEvents.length > 0) {
            throw new common_1.BadRequestException('User already booked or participated in this event');
        }
        const startDate = new Date();
        const lessDays = Math.floor(Math.random() * 60);
        startDate.setDate(startDate.getDate() - lessDays);
        startDate.setHours(Math.floor(Math.random() * 12) + 9);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);
        await this.databaseService.usersOnEvents.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                event: {
                    create: {
                        isHidden: true,
                        predefinedEventId,
                        startDate,
                        endDate,
                        description: null,
                        totalSlots: 1,
                        isClub: false,
                    },
                },
                isCompleted: true,
            },
        });
    }
    async updateBooking(updateBookingDto, eventId, userId) {
        await this.databaseService.$transaction(async (txClient) => {
            var _a;
            const event = await txClient.event.findUniqueOrThrow({
                where: {
                    id: eventId,
                },
                include: {
                    users: {
                        select: {
                            userId: true,
                            waitlistEventId: true,
                        },
                    },
                    waitlist: {
                        orderBy: {
                            createdAt: 'asc',
                        },
                        select: {
                            user: {
                                select: {
                                    email: true,
                                    id: true,
                                },
                            },
                            createdAt: true,
                        },
                    },
                    predefinedEvent: {
                        include: {
                            courses: true,
                        },
                    },
                },
            });
            const user = await txClient.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
                include: {
                    course: true,
                },
            });
            const bookedUsers = event.users.filter((user) => !user.waitlistEventId);
            const courseIds = (_a = event.predefinedEvent) === null || _a === void 0 ? void 0 : _a.courses.map((c) => c.courseId);
            if (event.isClub && !user.isInClub) {
                throw new common_1.UnauthorizedException('You are not allowed to book this event because you are not in the club');
            }
            else if (!event.isClub && !courseIds.includes(user.courseId)) {
                throw new common_1.UnauthorizedException('You are not allowed to book this event because you are not in the course');
            }
            const { book } = updateBookingDto;
            if (book &&
                !user.isCalendarEnable &&
                (0, date_fns_1.isBefore)(new Date(), new Date(user.calendarBlockingDeadline))) {
                throw new common_1.BadRequestException('events.CALENDAR_BLOCKED');
            }
            if (event.startDate < new Date()) {
                throw new common_1.BadRequestException('events.ALREADY_STARTED');
            }
            if (book) {
                if (!event.enableBooking) {
                    throw new common_1.BadRequestException('events.BOOKING_DISABLED');
                }
                if (event.totalSlots <= bookedUsers.length) {
                    throw new common_1.BadRequestException('events.NO_MORE_SLOTS');
                }
                const userAlreadyBooked = bookedUsers.some((user) => user.userId === userId);
                if (userAlreadyBooked) {
                    throw new common_1.BadRequestException('User already booked');
                }
                if (event.isClub) {
                    const usersOnEvents = await txClient.usersOnEvents.findMany({
                        where: {
                            user: {
                                id: userId,
                            },
                            isCompleted: false,
                            event: {
                                isClub: true,
                            },
                        },
                        include: {
                            event: true,
                        },
                    });
                    if (usersOnEvents.length >= 2) {
                        throw new common_1.BadRequestException('events.CANNOT_BOOK_MORE_THAN_2_CLUB_EVENTS');
                    }
                }
                else if (event.predefinedEventId) {
                    const usersOnEvents = await txClient.usersOnEvents.findMany({
                        where: {
                            user: {
                                id: userId,
                            },
                            event: {
                                predefinedEventId: event.predefinedEventId,
                            },
                        },
                    });
                    if (usersOnEvents.length > 0) {
                        throw new common_1.BadRequestException('events.ALREADY_BOOKED_OR_COMPLETED');
                    }
                }
                const updatedEvent = await txClient.event.update({
                    where: {
                        id: eventId,
                    },
                    data: {
                        users: {
                            create: {
                                userId,
                            },
                        },
                    },
                    include: {
                        users: true,
                    },
                });
                const freeSlots = updatedEvent.totalSlots - updatedEvent.users.length;
                if (freeSlots < 2) {
                    this.emailService.sendSlotsWarningForAdmins(updatedEvent);
                }
                return updatedEvent;
            }
            if (!book) {
                const userAlreadyBooked = bookedUsers.some((user) => user.userId === userId);
                if (!userAlreadyBooked) {
                    throw new common_1.BadRequestException('User has not booked this event');
                }
                await txClient.event.update({
                    where: {
                        id: eventId,
                    },
                    data: {
                        users: {
                            delete: {
                                userId_eventId: {
                                    userId,
                                    eventId,
                                },
                            },
                        },
                    },
                });
                if (event.waitlist.length > 0) {
                    const { user: nextUserInWaitlist } = event.waitlist[0];
                    await txClient.usersOnEvents.update({
                        where: {
                            userId_eventId: {
                                userId: nextUserInWaitlist.id,
                                eventId: eventId,
                            },
                        },
                        data: {
                            waitlistEventId: null,
                        },
                    });
                    await this.emailService.sendEmailAboutWaitlist(nextUserInWaitlist.email);
                }
            }
        }, {
            isolationLevel: 'Serializable',
        });
    }
    async updateWaitlist(updateWaitlistDto, eventId, userId) {
        await this.databaseService.$transaction(async (txClient) => {
            var _a;
            const event = await txClient.event.findUniqueOrThrow({
                where: {
                    id: eventId,
                },
                include: {
                    users: {
                        select: {
                            userId: true,
                            waitlistEventId: true,
                        },
                    },
                    predefinedEvent: {
                        include: {
                            courses: true,
                        },
                    },
                    waitlist: {
                        select: {
                            userId: true,
                            waitlistEventId: true,
                        },
                    },
                },
            });
            const user = await txClient.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
                include: {
                    course: true,
                },
            });
            const courseIds = (_a = event.predefinedEvent) === null || _a === void 0 ? void 0 : _a.courses.map((c) => c.courseId);
            if (event.startDate < new Date()) {
                throw new common_1.BadRequestException('events.ALREADY_STARTED');
            }
            if (event.isClub && !user.isInClub) {
                throw new common_1.UnauthorizedException('You are not allowed to sign up for this event because you are not in the club');
            }
            else if (!event.isClub && !courseIds.includes(user.courseId)) {
                throw new common_1.UnauthorizedException('You are not allowed to sign up for this event because you are not in the course');
            }
            const userAlreadyBooked = event.users
                .filter((user) => !user.waitlistEventId)
                .some((eventUser) => eventUser.userId === userId);
            if (userAlreadyBooked) {
                throw new common_1.BadRequestException('events.ALREADY_BOOKED_IN_WAITLIST');
            }
            const userAlreadyInWaitList = event.waitlist.some((waitlistedUser) => waitlistedUser.userId === userId);
            if (updateWaitlistDto.join) {
                if (!user.isCalendarEnable &&
                    (0, date_fns_1.isBefore)(new Date(), new Date(user.calendarBlockingDeadline))) {
                    throw new common_1.BadRequestException('events.CALENDAR_BLOCKED');
                }
                if (!event.enableBooking) {
                    throw new common_1.BadRequestException('events.BOOKING_DISABLED');
                }
                if (userAlreadyInWaitList) {
                    throw new common_1.BadRequestException('events.ALREADY_IN_WAITLIST');
                }
                if (event.isClub) {
                    const usersOnEvents = await txClient.usersOnEvents.findMany({
                        where: {
                            user: {
                                id: userId,
                            },
                            isCompleted: false,
                            event: {
                                isClub: true,
                            },
                        },
                        include: {
                            event: true,
                        },
                    });
                    if (usersOnEvents.length >= 2) {
                        throw new common_1.BadRequestException('events.CANNOT_JOIN_WAITLIST_MORE_THAN_2_CLUB_EVENTS');
                    }
                }
                return txClient.event.update({
                    where: {
                        id: eventId,
                    },
                    data: {
                        waitlist: {
                            create: {
                                userId,
                                eventId,
                            },
                        },
                    },
                });
            }
            else {
                if (!userAlreadyInWaitList) {
                    throw new common_1.BadRequestException('events.NOT_IN_WAITLIST');
                }
                return txClient.event.update({
                    where: {
                        id: eventId,
                    },
                    data: {
                        waitlist: {
                            delete: {
                                userId_eventId: {
                                    userId,
                                    eventId,
                                },
                            },
                        },
                    },
                });
            }
        }, {
            isolationLevel: 'Serializable',
        });
    }
    async markUsersAsVisited(eventId, userId, isPresent) {
        await this.databaseService.$transaction(async (txClient) => {
            if (isPresent) {
                const existingRecord = await txClient.usersOnEvents.findUnique({
                    where: {
                        userId_eventId: {
                            userId,
                            eventId,
                        },
                    },
                });
                if (!existingRecord) {
                    throw new Error(`Cannot mark as visited: user ${userId} is not associated with event ${eventId}`);
                }
                return txClient.event.update({
                    where: {
                        id: eventId,
                    },
                    data: {
                        visitedUsers: {
                            connect: {
                                userId_eventId: { userId, eventId },
                            },
                        },
                    },
                });
            }
            else {
                return txClient.event.update({
                    where: {
                        id: eventId,
                    },
                    data: {
                        visitedUsers: {
                            disconnect: {
                                userId_eventId: { userId, eventId },
                            },
                        },
                    },
                });
            }
        }, {
            isolationLevel: 'Serializable',
        });
    }
};
UsersOnEventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        email_service_1.EmailService])
], UsersOnEventsService);
exports.UsersOnEventsService = UsersOnEventsService;
//# sourceMappingURL=users-events.service.js.map