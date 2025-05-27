import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto';
import { User as IUser } from '@prisma/client';
import { VideosFindAllResponseItem } from './response/videos.find-all.response';
export declare class VideosController {
    private readonly videosService;
    constructor(videosService: VideosService);
    create(createVideoDto: CreateVideoDto): Promise<void>;
    findAll(user: IUser, courseId?: string): Promise<VideosFindAllResponseItem[]>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<void>;
    remove(id: string): Promise<void>;
}
