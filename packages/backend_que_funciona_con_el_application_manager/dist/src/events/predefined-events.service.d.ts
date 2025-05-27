import { CreatePredefinedEventDto } from './dto/create-predefined-event.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { UpdatePredefinedEventDto } from './dto/update-predefined-event.dto';
export declare class PredefinedEventsService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    findAll(where?: Prisma.PredefinedEventWhereInput): Promise<({
        courses: (import("@prisma/client/runtime").GetResult<{
            predefinedEventId: string;
            courseId: string;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    create(createPredefinedEventDto: CreatePredefinedEventDto): Promise<void>;
    delete(id: string): Promise<void>;
    update(id: string, updatePredefinedEventDto: UpdatePredefinedEventDto): Promise<void>;
}
