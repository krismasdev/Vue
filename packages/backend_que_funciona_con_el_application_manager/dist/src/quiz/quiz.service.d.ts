/// <reference types="multer" />
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizQuestionsDto } from './dto/update-quiz-questions.dto';
import { UpdateQuizMetadataDto } from './dto/update-quiz-metadata.dto';
import { DatabaseService } from '../database/database.service';
export declare class QuizService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    validateQuizMimeType(excelFile: Express.Multer.File): void;
    addQuizSubmission(userId: string): Promise<void>;
    private readDataFromExcel;
    private transformRow;
    create(createQuizDto: CreateQuizDto, excelFile: Express.Multer.File): Promise<void>;
    findAll(courseId?: string): Promise<{
        courses: (import("@prisma/client/runtime").GetResult<{
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        nQuestionsPerAttempt: number;
    }[]>;
    findOne(id: string): Promise<{
        questions: ({
            answers: (import("@prisma/client/runtime").GetResult<{
                id: string;
                content: string;
                isCorrect: boolean;
                questionId: string;
                createdAt: Date;
                updatedAt: Date;
            }, unknown, never> & {})[];
        } & import("@prisma/client/runtime").GetResult<{
            id: string;
            content: string;
            quizId: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
        nQuestionsPerAttempt: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    private pickRandomQuestions;
    getWithRandomQuestions(id: string): Promise<{
        questions: ({
            answers: (import("@prisma/client/runtime").GetResult<{
                id: string;
                content: string;
                isCorrect: boolean;
                questionId: string;
                createdAt: Date;
                updatedAt: Date;
            }, unknown, never> & {})[];
        } & import("@prisma/client/runtime").GetResult<{
            id: string;
            content: string;
            quizId: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
        nQuestionsPerAttempt: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    updateQuestions(id: string, dto: UpdateQuizQuestionsDto): Promise<void>;
    updateMetadata(id: string, dto: UpdateQuizMetadataDto): Promise<void>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__QuizClient<import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
        nQuestionsPerAttempt: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}, never, import("@prisma/client/runtime").DefaultArgs>;
}
