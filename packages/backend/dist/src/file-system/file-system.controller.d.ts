/// <reference types="multer" />
import { FileSystemService } from './file-system.service';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { User as IUser } from '@prisma/client';
import { GetFolderContentResponse } from './response/get-folder-content.response';
export declare class FileSystemController {
    private readonly fileSystemService;
    constructor(fileSystemService: FileSystemService);
    cleanUpOrphanedFiles(): Promise<void>;
    createFile(folderId: string, createFileDto: CreateFileDto, file: Express.Multer.File): Promise<void>;
    createMultipleFiles(folderId: string, files: Express.Multer.File[]): Promise<void>;
    updateFolder(folderId: string, updateFolderDto: UpdateFolderDto): Promise<void>;
    createFolder(createFolderDto: CreateFolderDto, folderId: string): Promise<void>;
    getFolderContent(folderId: string, user: IUser): Promise<GetFolderContentResponse>;
    removeFolder(id: string): Promise<void>;
    updateFile(id: string, updateFileDto: UpdateFileDto): Promise<void>;
    remove(id: string): Promise<void>;
    generateSignedUrl(id: string): Promise<string>;
}
