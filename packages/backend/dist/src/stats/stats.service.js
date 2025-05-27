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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let StatsService = class StatsService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getUserStats() {
        const LAST_WEEK = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const LAST_MONTH = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const totalUsers = await this.databaseService.user.count();
        const totalUsersRegisteredLastWeek = await this.databaseService.user.count({
            where: {
                createdAt: {
                    gte: LAST_WEEK,
                },
            },
        });
        const totalUsersRegisteredLastMonth = await this.databaseService.user.count({
            where: {
                createdAt: {
                    gte: LAST_MONTH,
                },
            },
        });
        const totalActiveUsers = await this.databaseService.user.count({
            where: {
                isActive: true,
            },
        });
        const totalAwaitingApproval = await this.databaseService.user.count({
            where: {
                role: {
                    in: ['AWAITINGTEACHER', 'AWAITINGSTUDENT'],
                },
            },
        });
        return {
            registered: {
                allTime: totalUsers,
                lastWeek: totalUsersRegisteredLastWeek,
                lastMonth: totalUsersRegisteredLastMonth,
            },
            active: totalActiveUsers,
            awaitingApproval: totalAwaitingApproval,
        };
    }
    async getStatsStudent(user) {
        const quizAttemptsSummary = (await this.databaseService.$queryRaw `
      SELECT DATE(createdAt) AS day, COUNT(*) AS numberTaken
      FROM QuizAttempt
      WHERE userId = ${user.id}
      AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY day
    `);
        const usersOnEventsCompleted = await this.databaseService.usersOnEvents.count({
            where: {
                userId: user.id,
                isCompleted: true,
            },
        });
        const payments = await this.databaseService.payment.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                paidAt: 'desc',
            },
        });
        return {
            payments: payments.map((payment) => ({
                date: payment.paidAt,
                amount: Number(payment.amount),
                isSubscription: payment.type === 'SUBSCRIPTION',
            })),
            quizAttemptsSummary: {
                lastMonth: quizAttemptsSummary.map((summary) => ({
                    day: summary.day,
                    numberTaken: Number(summary.numberTaken),
                })),
            },
            usersOnEventsCompleted: {
                total: usersOnEventsCompleted,
            },
        };
    }
    async getStatsAdmin() {
        const LAST_WEEK = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const LAST_MONTH = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const paymentsAllTime = await this.databaseService.payment.findMany();
        const revenueAllTime = paymentsAllTime.reduce((acc, curr) => acc + curr.amount, 0);
        const numberOfSalesAllTime = paymentsAllTime.length;
        const paymentsLastWeek = await this.databaseService.payment.findMany({
            where: {
                paidAt: {
                    gte: LAST_WEEK,
                },
            },
        });
        const revenueLastWeek = paymentsLastWeek.reduce((acc, curr) => acc + curr.amount, 0);
        const numberOfSalesLastWeek = paymentsLastWeek.length;
        const paymentsLastMonth = await this.databaseService.payment.findMany({
            where: {
                paidAt: {
                    gte: LAST_MONTH,
                },
            },
        });
        const revenueLastMonth = paymentsLastMonth.reduce((acc, curr) => acc + curr.amount, 0);
        const numberOfSalesLastMonth = paymentsLastMonth.length;
        const revenuePerCourse = (await this.databaseService.$queryRaw `
      SELECT Course.id, Course.name, SUM(Payment.amount) AS totalRevenue, COUNT(*) AS numberOfSales
        FROM Payment
        JOIN User ON User.id = Payment.userId
        JOIN Course ON Course.id = User.courseId
        GROUP BY Course.id
    `);
        const users = await this.getUserStats();
        return {
            finances: {
                perCourse: revenuePerCourse.map((course) => ({
                    id: course.id,
                    name: course.name,
                    totalRevenue: Number(course.totalRevenue),
                    numberOfSales: Number(course.numberOfSales),
                })),
                allTime: {
                    totalRevenue: revenueAllTime,
                    numberOfSales: numberOfSalesAllTime,
                },
                lastWeek: {
                    totalRevenue: revenueLastWeek,
                    numberOfSales: numberOfSalesLastWeek,
                },
                lastMonth: {
                    totalRevenue: revenueLastMonth,
                    numberOfSales: numberOfSalesLastMonth,
                },
            },
            users,
        };
    }
    async getStatsTeacher() {
        const users = await this.getUserStats();
        return {
            users,
        };
    }
};
StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], StatsService);
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map