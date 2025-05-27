/// <reference types="multer" />
import { CreateFileDto } from './dto/create-file.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { StorageService } from 'src/storage/storage.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { User as IUser } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
export declare class FileSystemService {
    private readonly storageService;
    private readonly dbService;
    private readonly configService;
    constructor(storageService: StorageService, dbService: DatabaseService, configService: ConfigService);
    deleteOrphanedFiles(): Promise<number>;
    checkUserAccessToFolder(user: IUser, folderId: string): Promise<boolean>;
    validateMimeType(allowedMimeTypes: string[], file: Express.Multer.File): void;
    updateFile(id: string, updateFileDto: UpdateFileDto): Promise<void>;
    updateFolder(id: string, updateFolderDto: UpdateFolderDto): Promise<void>;
    createFile(createFileDto: CreateFileDto, folderId: string, file: Express.Multer.File): Promise<void>;
    createMultipleFiles(folderId: string, files: Express.Multer.File[]): Promise<void>;
    createFolder(createFolderDto: CreateFolderDto, parentId: string): Promise<void>;
    getFolderContent(folderId: string): Promise<{
        folders: {
            numberOfChildren: number;
            _count: {
                files: number;
                folders: number;
            };
            id: string;
            courseId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string;
            isRoot: boolean;
        }[];
        parentId: string;
        files: (import("@prisma/client/runtime").GetResult<{
            id: string;
            name: string;
            s3Key: string;
            contentType: string;
            folderId: string;
            courseId: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
        name: string;
        id: string;
    }>;
    removeFile(id: string): Promise<void>;
    generateDownloadUrl(id: string): Promise<string>;
    removeFolder(id: string): Promise<void>;
}
