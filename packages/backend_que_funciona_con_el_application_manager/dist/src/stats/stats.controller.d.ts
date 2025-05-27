import { StatsService } from './stats.service';
import { User as IUser } from '@prisma/client';
import { StatsAdminResponse, StatsTeacherResponse, StatsStudentResponse } from './stats.response';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getStatsAdmin(): Promise<StatsAdminResponse>;
    getStatsTeacher(): Promise<StatsTeacherResponse>;
    getStatsStudent(user: IUser): Promise<StatsStudentResponse>;
}
