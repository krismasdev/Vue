"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsStudentLastMonth = exports.StatsAdminRegistered = exports.StatsAdminLastMonth = exports.StatsAdminLastWeek = exports.StatsAdminAllTime = exports.StatsAdminPerCourse = exports.StatsTeacherRegistered = exports.StatsStudentPayment = exports.StatsStudentUsersOnEventsCompleted = exports.StatsStudentQuizAttemptsSummary = exports.StatsAdminUsers = exports.StatsAdminFinances = exports.StatsTeacherUsers = exports.StatsStudentResponse = exports.StatsAdminResponse = exports.StatsTeacherResponse = void 0;
const openapi = require("@nestjs/swagger");
class StatsTeacherResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { users: { required: true, type: () => require("./stats.response").StatsTeacherUsers } };
    }
}
exports.StatsTeacherResponse = StatsTeacherResponse;
class StatsAdminResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { finances: { required: true, type: () => require("./stats.response").StatsAdminFinances }, users: { required: true, type: () => require("./stats.response").StatsAdminUsers } };
    }
}
exports.StatsAdminResponse = StatsAdminResponse;
class StatsStudentResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { quizAttemptsSummary: { required: true, type: () => require("./stats.response").StatsStudentQuizAttemptsSummary }, usersOnEventsCompleted: { required: true, type: () => require("./stats.response").StatsStudentUsersOnEventsCompleted }, payments: { required: true, type: () => [require("./stats.response").StatsStudentPayment] } };
    }
}
exports.StatsStudentResponse = StatsStudentResponse;
class StatsTeacherUsers {
    static _OPENAPI_METADATA_FACTORY() {
        return { registered: { required: true, type: () => require("./stats.response").StatsTeacherRegistered }, active: { required: true, type: () => Number }, awaitingApproval: { required: true, type: () => Number } };
    }
}
exports.StatsTeacherUsers = StatsTeacherUsers;
class StatsAdminFinances {
    static _OPENAPI_METADATA_FACTORY() {
        return { perCourse: { required: true, type: () => [require("./stats.response").StatsAdminPerCourse] }, allTime: { required: true, type: () => require("./stats.response").StatsAdminAllTime }, lastWeek: { required: true, type: () => require("./stats.response").StatsAdminLastWeek }, lastMonth: { required: true, type: () => require("./stats.response").StatsAdminLastMonth } };
    }
}
exports.StatsAdminFinances = StatsAdminFinances;
class StatsAdminUsers {
    static _OPENAPI_METADATA_FACTORY() {
        return { registered: { required: true, type: () => require("./stats.response").StatsAdminRegistered }, active: { required: true, type: () => Number }, awaitingApproval: { required: true, type: () => Number } };
    }
}
exports.StatsAdminUsers = StatsAdminUsers;
class StatsStudentQuizAttemptsSummary {
    static _OPENAPI_METADATA_FACTORY() {
        return { lastMonth: { required: true, type: () => [require("./stats.response").StatsStudentLastMonth] } };
    }
}
exports.StatsStudentQuizAttemptsSummary = StatsStudentQuizAttemptsSummary;
class StatsStudentUsersOnEventsCompleted {
    static _OPENAPI_METADATA_FACTORY() {
        return { total: { required: true, type: () => Number } };
    }
}
exports.StatsStudentUsersOnEventsCompleted = StatsStudentUsersOnEventsCompleted;
class StatsStudentPayment {
    static _OPENAPI_METADATA_FACTORY() {
        return { date: { required: true, type: () => Date }, amount: { required: true, type: () => Number }, isSubscription: { required: true, type: () => Boolean } };
    }
}
exports.StatsStudentPayment = StatsStudentPayment;
class StatsTeacherRegistered {
    static _OPENAPI_METADATA_FACTORY() {
        return { allTime: { required: true, type: () => Number }, lastWeek: { required: true, type: () => Number }, lastMonth: { required: true, type: () => Number } };
    }
}
exports.StatsTeacherRegistered = StatsTeacherRegistered;
class StatsAdminPerCourse {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, totalRevenue: { required: true, type: () => Number }, numberOfSales: { required: true, type: () => Number } };
    }
}
exports.StatsAdminPerCourse = StatsAdminPerCourse;
class StatsAdminAllTime {
    static _OPENAPI_METADATA_FACTORY() {
        return { totalRevenue: { required: true, type: () => Number }, numberOfSales: { required: true, type: () => Number } };
    }
}
exports.StatsAdminAllTime = StatsAdminAllTime;
class StatsAdminLastWeek {
    static _OPENAPI_METADATA_FACTORY() {
        return { totalRevenue: { required: true, type: () => Number }, numberOfSales: { required: true, type: () => Number } };
    }
}
exports.StatsAdminLastWeek = StatsAdminLastWeek;
class StatsAdminLastMonth {
    static _OPENAPI_METADATA_FACTORY() {
        return { totalRevenue: { required: true, type: () => Number }, numberOfSales: { required: true, type: () => Number } };
    }
}
exports.StatsAdminLastMonth = StatsAdminLastMonth;
class StatsAdminRegistered {
    static _OPENAPI_METADATA_FACTORY() {
        return { allTime: { required: true, type: () => Number }, lastWeek: { required: true, type: () => Number }, lastMonth: { required: true, type: () => Number } };
    }
}
exports.StatsAdminRegistered = StatsAdminRegistered;
class StatsStudentLastMonth {
    static _OPENAPI_METADATA_FACTORY() {
        return { day: { required: true, type: () => Date }, numberTaken: { required: true, type: () => Number } };
    }
}
exports.StatsStudentLastMonth = StatsStudentLastMonth;
//# sourceMappingURL=stats.response.js.map