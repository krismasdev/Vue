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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const file_system_service_1 = require("../file-system/file-system.service");
let CoursesService = class CoursesService {
    constructor(databaseService, fileSystemService) {
        this.databaseService = databaseService;
        this.fileSystemService = fileSystemService;
    }
    async create(createCourseDto) {
        await this.databaseService.course.create({
            data: Object.assign(Object.assign({}, createCourseDto), { folders: {
                    create: {
                        name: 'root__' + createCourseDto.name,
                        isRoot: true,
                    },
                } }),
        });
    }
    async findAll() {
        const courses = await this.databaseService.course.findMany({
            include: {
                folders: {
                    where: {
                        isRoot: true,
                    },
                    select: {
                        id: true,
                        name: true,
                    },
                },
                predefinedEvents: {
                    include: {
                        predefinedEvent: true,
                    },
                    orderBy: {
                        predefinedEvent: {
                            title: 'asc',
                        },
                    },
                },
            },
        });
        return courses.map((course) => (Object.assign(Object.assign({ folders: undefined }, course), { rootFolder: course.folders[0] })));
    }
    async getStudentCounts() {
        return await this.databaseService.user.groupBy({
            by: ['courseId'],
            where: {
                role: 'STUDENT',
            },
            _count: true,
        });
    }
    async findOne(id) {
        return await this.databaseService.course.findUnique({
            where: {
                id,
            },
        });
    }
    async update(id, updateCourseDto) {
        await this.databaseService.course.update({
            where: {
                id,
            },
            data: Object.assign({}, updateCourseDto),
        });
    }
    async remove(id) {
        const rootFolder = await this.databaseService.folder.findFirst({
            where: {
                courseId: id,
                isRoot: true,
            },
        });
        await this.fileSystemService.removeFolder(rootFolder.id);
        const videos = await this.databaseService.video.findMany({
            where: {
                courses: {
                    every: {
                        courseId: id,
                    },
                },
            },
        });
        await this.databaseService.video.deleteMany({
            where: {
                id: {
                    in: videos.map((video) => video.id),
                },
            },
        });
        const predefinedEvents = await this.databaseService.predefinedEvent.findMany({
            where: {
                courses: {
                    every: {
                        courseId: id,
                    },
                },
            },
        });
        await this.databaseService.predefinedEvent.deleteMany({
            where: {
                id: {
                    in: predefinedEvents.map((predefinedEvent) => predefinedEvent.id),
                },
            },
        });
        const quizzes = await this.databaseService.quiz.findMany({
            where: {
                courses: {
                    every: {
                        courseId: id,
                    },
                },
            },
        });
        await this.databaseService.quiz.deleteMany({
            where: {
                id: {
                    in: quizzes.map((quiz) => quiz.id),
                },
            },
        });
        await this.databaseService.course.delete({
            where: {
                id,
            },
        });
    }
};
CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        file_system_service_1.FileSystemService])
], CoursesService);
exports.CoursesService = CoursesService;
//# sourceMappingURL=courses.service.js.map