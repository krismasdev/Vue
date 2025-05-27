"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const XLSX = __importStar(require("xlsx"));
const common_2 = require("@aula-anclademia/common");
const joi_1 = __importDefault(require("joi"));
let QuizService = class QuizService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    validateQuizMimeType(excelFile) {
        const type = excelFile.mimetype;
        if (common_2.VALID_QUIZ_MIMETYPES.includes(type) === false) {
            throw new common_1.BadRequestException('INVALID_MIMETYPE');
        }
    }
    async addQuizSubmission(userId) {
        await this.databaseService.quizAttempt.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }
    readDataFromExcel(excelFile) {
        const workBook = XLSX.read(excelFile.buffer);
        const data = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
        return data;
    }
    transformRow(row) {
        joi_1.default.assert(row, joi_1.default.object({
            opt1: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.number()).required(),
            opt2: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.number()).required(),
            opt3: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.number()).required(),
            opt4: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.number()).required(),
            correct: joi_1.default.alternatives()
                .try(joi_1.default.number().valid(1, 2, 3, 4), joi_1.default.string())
                .optional(),
            title: joi_1.default.string().required(),
        }), 'INVALID_FORMAT', {
            stripUnknown: true,
            allowUnknown: true,
        });
        const _row = row;
        _row.opt1 = _row.opt1.toString();
        _row.opt2 = _row.opt2.toString();
        _row.opt3 = _row.opt3.toString();
        _row.opt4 = _row.opt4.toString();
        _row.correct = isNaN(parseInt((_row.correct || '1')))
            ? 1
            : parseInt((_row.correct || '1'));
        return _row;
    }
    async create(createQuizDto, excelFile) {
        await this.databaseService.$transaction(async (tx) => {
            const data = this.readDataFromExcel(excelFile);
            const quiz = await tx.quiz.create({
                data: {
                    name: createQuizDto.name,
                    courses: {
                        createMany: {
                            data: createQuizDto.courseIds.map((courseId) => ({
                                courseId,
                            })),
                        },
                    },
                },
            });
            for (const _row of data) {
                const row = this.transformRow(_row);
                const question = await tx.question.create({
                    data: {
                        content: row.title,
                        quiz: {
                            connect: {
                                id: quiz.id,
                            },
                        },
                    },
                });
                await tx.answer.createMany({
                    data: [
                        {
                            content: row.opt1,
                            isCorrect: row.correct === 1,
                            questionId: question.id,
                        },
                        {
                            content: row.opt2,
                            isCorrect: row.correct === 2,
                            questionId: question.id,
                        },
                        {
                            content: row.opt3,
                            isCorrect: row.correct === 3,
                            questionId: question.id,
                        },
                        {
                            content: row.opt4,
                            isCorrect: row.correct === 4,
                            questionId: question.id,
                        },
                    ],
                });
            }
        }, {
            timeout: 30000,
        });
    }
    async findAll(courseId) {
        const data = await this.databaseService.quiz.findMany({
            include: {
                courses: {
                    select: {
                        course: true,
                    },
                },
            },
            where: {
                courses: {
                    some: {
                        courseId,
                    },
                },
            },
            orderBy: {
                name: 'desc',
            },
        });
        return data.map((quiz) => (Object.assign(Object.assign({}, quiz), { courses: quiz.courses.map((c) => c.course) })));
    }
    async findOne(id) {
        const quiz = await this.databaseService.quiz.findUniqueOrThrow({
            where: {
                id: id,
            },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
        return quiz;
    }
    pickRandomQuestions(arr, count) {
        const result = [];
        for (let i = 0; i < count; i++) {
            const random = Math.floor(Math.random() * arr.length);
            result.push(arr.splice(random, 1)[0]);
        }
        return result;
    }
    async getWithRandomQuestions(id) {
        const quiz = await this.databaseService.quiz.findUnique({
            where: {
                id: id,
            },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
        quiz.questions = this.pickRandomQuestions(quiz.questions, quiz.nQuestionsPerAttempt);
        return quiz;
    }
    async updateQuestions(id, dto) {
        const { questions } = dto;
        for (const q of questions) {
            await this.databaseService.question.update({
                where: {
                    id: q.id,
                },
                data: {
                    answers: {
                        update: {
                            where: {
                                id: q.newCorrectAnswerId,
                            },
                            data: {
                                isCorrect: true,
                            },
                        },
                        updateMany: {
                            where: {
                                id: {
                                    not: q.newCorrectAnswerId,
                                },
                            },
                            data: {
                                isCorrect: false,
                            },
                        },
                    },
                },
            });
        }
    }
    async updateMetadata(id, dto) {
        const { nQuestionsPerAttempt, name, courseIds } = dto;
        await this.databaseService.quiz.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                nQuestionsPerAttempt: nQuestionsPerAttempt,
                courses: {
                    deleteMany: {},
                    createMany: {
                        data: courseIds.map((courseId) => ({
                            courseId,
                        })),
                    },
                },
            },
        });
    }
    remove(id) {
        return this.databaseService.quiz.delete({
            where: {
                id: id,
            },
        });
    }
};
QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], QuizService);
exports.QuizService = QuizService;
//# sourceMappingURL=quiz.service.js.map