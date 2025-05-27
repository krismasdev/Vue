export declare class StatsTeacherResponse {
    users: StatsTeacherUsers;
}
export declare class StatsAdminResponse {
    finances: StatsAdminFinances;
    users: StatsAdminUsers;
}
export declare class StatsStudentResponse {
    quizAttemptsSummary: StatsStudentQuizAttemptsSummary;
    usersOnEventsCompleted: StatsStudentUsersOnEventsCompleted;
    payments: StatsStudentPayment[];
}
export declare class StatsTeacherUsers {
    registered: StatsTeacherRegistered;
    active: number;
    awaitingApproval: number;
}
export declare class StatsAdminFinances {
    perCourse: StatsAdminPerCourse[];
    allTime: StatsAdminAllTime;
    lastWeek: StatsAdminLastWeek;
    lastMonth: StatsAdminLastMonth;
}
export declare class StatsAdminUsers {
    registered: StatsAdminRegistered;
    active: number;
    awaitingApproval: number;
}
export declare class StatsStudentQuizAttemptsSummary {
    lastMonth: StatsStudentLastMonth[];
}
export declare class StatsStudentUsersOnEventsCompleted {
    total: number;
}
export declare class StatsStudentPayment {
    date: Date;
    amount: number;
    isSubscription: boolean;
}
export declare class StatsTeacherRegistered {
    allTime: number;
    lastWeek: number;
    lastMonth: number;
}
export declare class StatsAdminPerCourse {
    id: string;
    name: string;
    totalRevenue: number;
    numberOfSales: number;
}
export declare class StatsAdminAllTime {
    totalRevenue: number;
    numberOfSales: number;
}
export declare class StatsAdminLastWeek {
    totalRevenue: number;
    numberOfSales: number;
}
export declare class StatsAdminLastMonth {
    totalRevenue: number;
    numberOfSales: number;
}
export declare class StatsAdminRegistered {
    allTime: number;
    lastWeek: number;
    lastMonth: number;
}
export declare class StatsStudentLastMonth {
    day: Date;
    numberTaken: number;
}
