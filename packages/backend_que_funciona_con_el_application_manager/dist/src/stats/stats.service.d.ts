import { DatabaseService } from 'src/database/database.service';
import { StatsTeacherResponse, StatsAdminResponse, StatsStudentResponse } from './stats.response';
import { User } from '@prisma/client';
export declare class StatsService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    private getUserStats;
    getStatsStudent(user: User): Promise<StatsStudentResponse>;
    getStatsAdmin(): Promise<StatsAdminResponse>;
    getStatsTeacher(): Promise<StatsTeacherResponse>;
}
