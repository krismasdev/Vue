"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const database_service_1 = require("../database/database.service");
const storage_service_1 = require("../storage/storage.service");
const config_1 = require("@nestjs/config");
const common_2 = require("@aula-anclademia/common");
let FileSystemService = class FileSystemService {
    constructor(storageService, dbService, configService) {
        this.storageService = storageService;
        this.dbService = dbService;
        this.configService = configService;
    }
    async deleteOrphanedFiles() {
        const files = await this.dbService.file.findMany({
            select: { s3Key: true },
        });
        const allS3Keys = await this.storageService
            .listObjects({
            Bucket: this.configService.getOrThrow('S3_PRIVATE_BUCKET_NAME'),
        })
            .then((res) => { var _a; return (_a = res.Contents) === null || _a === void 0 ? void 0 : _a.map((obj) => obj.Key); });
        if (!allS3Keys || allS3Keys.length === 0) {
            return 0;
        }
        const s3KeysToDelete = allS3Keys.filter((s3Key) => !files.some((file) => file.s3Key === s3Key));
        if (s3KeysToDelete.length === 0) {
            return 0;
        }
        await this.storageService.deleteObjects({
            Bucket: this.configService.getOrThrow('S3_PRIVATE_BUCKET_NAME'),
            Delete: {
                Objects: s3KeysToDelete.map((s3Key) => ({ Key: s3Key })),
            },
        });
        return s3KeysToDelete.length;
    }
    async checkUserAccessToFolder(user, folderId) {
        if (user.role === 'ADMIN' || user.role === 'TEACHER') {
            return true;
        }
        if (user.role === 'STUDENT') {
            const folder = await this.dbService.folder.findFirst({
                where: {
                    id: folderId,
                    course: {
                        students: {
                            some: {
                                id: user.id,
                            },
                        },
                    },
                },
            });
            if (!folder) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }
    validateMimeType(allowedMimeTypes, file) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Must be one of ${allowedMimeTypes.join(', ')}`);
        }
    }
    async updateFile(id, updateFileDto) {
        await this.dbService.file.update({
            where: { id },
            data: updateFileDto,
        });
    }
    async updateFolder(id, updateFolderDto) {
        await this.dbService.folder.update({
            where: { id },
            data: updateFolderDto,
        });
    }
    async createFile(createFileDto, folderId, file) {
        await this.dbService.$transaction(async (tx) => {
            const uploadParams = {
                Bucket: this.configService.getOrThrow('S3_PRIVATE_BUCKET_NAME'),
                Key: (0, uuid_1.v4)(),
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const folder = await tx.folder.findUniqueOrThrow({
                where: { id: folderId },
                select: { courseId: true },
            });
            await tx.file.create({
                data: {
                    courseId: folder.courseId,
                    s3Key: uploadParams.Key,
                    folderId,
                    name: createFileDto.name,
                    contentType: file.mimetype,
                },
            });
            await this.storageService.putObject(uploadParams);
        });
    }
    async createMultipleFiles(folderId, files) {
        await this.dbService.$transaction(async (tx) => {
            const promises = files.map(async (file) => {
                const uploadParams = {
                    Bucket: this.configService.getOrThrow('S3_PRIVATE_BUCKET_NAME'),
                    Key: (0, uuid_1.v4)(),
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                const folder = await tx.folder.findUnique({
                    where: { id: folderId },
                    select: { courseId: true },
                });
                let name = file.originalname;
                if (!name) {
                    name = 'unnamed.any';
                }
                const extension = name.split('.').pop();
                if (extension) {
                    name = name.replace(`.${extension}`, '');
                }
                if (name.length > common_2.STR_MAX_LENGTH) {
                    name = name.slice(0, common_2.STR_MAX_LENGTH);
                }
                await tx.file.create({
                    data: {
                        courseId: folder.courseId,
                        s3Key: uploadParams.Key,
                        folderId,
                        name: name,
                        contentType: file.mimetype,
                    },
                });
                await this.storageService.putObject(uploadParams);
            });
            await Promise.all(promises);
        });
    }
    async createFolder(createFolderDto, parentId) {
        const parent = await this.dbService.folder.findUniqueOrThrow({
            where: { id: parentId },
            select: { id: true, course: { select: { id: true } } },
        });
        await this.dbService.folder.create({
            data: {
                courseId: parent.course.id,
                name: createFolderDto.name,
                parentId: parent.id,
                isRoot: false,
            },
        });
    }
    async getFolderContent(folderId) {
        const folder = await this.dbService.folder.findUnique({
            where: { id: folderId },
            select: {
                parentId: true,
                files: {
                    orderBy: { name: 'asc' },
                },
                folders: {
                    orderBy: { name: 'asc' },
                    include: {
                        _count: {
                            select: { files: true, folders: true },
                        },
                    },
                },
                name: true,
                id: true,
            },
        });
        return Object.assign(Object.assign({}, folder), { folders: folder.folders.map((folder) => (Object.assign(Object.assign({}, folder), { numberOfChildren: folder._count.folders + folder._count.files }))) });
    }
    async removeFile(id) {
        await this.dbService.$transaction(async (tx) => {
            const file = await tx.file.findUniqueOrThrow({
                where: { id },
                select: { s3Key: true },
            });
            const params = {
                Bucket: this.configService.getOrThrow('S3_PRIVATE_BUCKET_NAME'),
                Key: file.s3Key,
            };
            await this.storageService.deleteObject(params);
            await tx.file.delete({ where: { id } });
        }, {
            timeout: 10000,
        });
    }
    async generateDownloadUrl(id) {
        const file = await this.dbService.file.findUnique({
            where: { id },
            select: { s3Key: true },
        });
        return await this.storageService.generateGetSignedUrl({
            s3Key: file.s3Key,
            expires: 60 * 5,
        });
    }
    async removeFolder(id) {
        const subfolders = await this.dbService.folder.findMany({
            where: { parentId: id },
            select: { id: true },
        });
        await Promise.all(subfolders.map((folder) => this.removeFolder(folder.id)));
        await this.dbService.$transaction(async (tx) => {
            const files = await tx.file.findMany({
                where: { folderId: id },
                select: { s3Key: true },
            });
            const params = {
                Bucket: this.configService.getOrThrow('S3_PRIVATE_BUCKET_NAME'),
                Delete: {
                    Objects: files.map((file) => ({ Key: file.s3Key })),
                },
            };
            if (params.Delete.Objects.length > 0)
                await this.storageService.deleteObjects(params);
            await tx.file.deleteMany({ where: { folderId: id } });
            await tx.folder.delete({ where: { id } });
        }, {
            timeout: 10000,
        });
    }
};
FileSystemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService,
        database_service_1.DatabaseService,
        config_1.ConfigService])
], FileSystemService);
exports.FileSystemService = FileSystemService;
//# sourceMappingURL=file-system.service.js.map