import { CreateCourseDto, UpdateCourseDto } from './dto';
import { DatabaseService } from 'src/database/database.service';
import { FileSystemService } from 'src/file-system/file-system.service';
export declare class CoursesService {
    private readonly databaseService;
    private readonly fileSystemService;
    constructor(databaseService: DatabaseService, fileSystemService: FileSystemService);
    create(createCourseDto: CreateCourseDto): Promise<void>;
    findAll(): Promise<{
        rootFolder: {
            id: string;
            name: string;
        };
        folders: {
            id: string;
            name: string;
        }[];
        predefinedEvents: ({
            predefinedEvent: import("@prisma/client/runtime").GetResult<{
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
            }, unknown, never> & {};
        } & import("@prisma/client/runtime").GetResult<{
            predefinedEventId: string;
            courseId: string;
        }, unknown, never> & {})[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }[]>;
    getStudentCounts(): Promise<(import(".prisma/client").Prisma.PickArray<import(".prisma/client").Prisma.UserGroupByOutputType, "courseId"[]> & {
        _count: number;
    })[]>;
    findOne(id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<void>;
    remove(id: string): Promise<void>;
}
