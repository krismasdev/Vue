import { CreateVideoDto, UpdateVideoDto } from './dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';
export declare class VideosService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    canUserAccessVideos(user: User, courseId?: string | null): boolean;
    create(createVideoDto: CreateVideoDto): Promise<void>;
    findAll(courseId?: string | null): Promise<{
        courses: {
            id: string;
            name: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        url: string;
        date: Date;
    }[]>;
    findOne(id: string): Promise<{
        courses: {
            id: string;
            name: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        url: string;
        date: Date;
    }>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<void>;
    remove(id: string): Promise<void>;
}
