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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let VideosService = class VideosService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    canUserAccessVideos(user, courseId) {
        const { role } = user;
        if (role !== 'ADMIN' && role !== 'TEACHER') {
            if (!courseId) {
                return false;
            }
            if (courseId !== user.courseId) {
                return false;
            }
        }
        return true;
    }
    async create(createVideoDto) {
        const { courseIds } = createVideoDto, rest = __rest(createVideoDto, ["courseIds"]);
        await this.databaseService.video.create({
            data: Object.assign(Object.assign({}, rest), { courses: {
                    createMany: {
                        data: courseIds.map((courseId) => ({
                            courseId,
                        })),
                    },
                } }),
        });
    }
    async findAll(courseId) {
        const videos = await this.databaseService.video.findMany({
            orderBy: {
                date: 'asc',
            },
            where: courseId && {
                courses: {
                    some: {
                        courseId,
                    },
                },
            },
            include: {
                courses: {
                    select: {
                        course: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        const res = videos.map((video) => (Object.assign(Object.assign({}, video), { courses: video.courses.map((course) => course.course) })));
        return res;
    }
    async findOne(id) {
        const video = await this.databaseService.video.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                courses: {
                    select: {
                        course: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        return Object.assign(Object.assign({}, video), { courses: video.courses.map((course) => course.course) });
    }
    async update(id, updateVideoDto) {
        await this.databaseService.video.update({
            where: {
                id,
            },
            data: {
                title: updateVideoDto.title,
                url: updateVideoDto.url,
                courses: {
                    deleteMany: {},
                    createMany: {
                        data: updateVideoDto.courseIds.map((courseId) => ({
                            courseId,
                        })),
                    },
                },
                date: updateVideoDto.date,
            },
        });
    }
    async remove(id) {
        await this.databaseService.video.delete({
            where: {
                id,
            },
        });
    }
};
VideosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], VideosService);
exports.VideosService = VideosService;
//# sourceMappingURL=videos.service.js.map