/// <reference types="multer" />
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizQuestionsDto } from './dto/update-quiz-questions.dto';
import { UpdateQuizMetadataDto } from './dto/update-quiz-metadata.dto';
import { User as IUser } from '@prisma/client';
import { QuizRandomQuestionsResponse } from './response/quiz-random-questions.response';
import { QuizFindOneResponse } from './response/quiz-find-one.response';
import { QuizFindAllResponse } from './response/quiz-find-all.response';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    create(createFileDto: CreateQuizDto, excelFile: Express.Multer.File): Promise<void>;
    findAll(user: IUser, courseId?: string): Promise<QuizFindAllResponse>;
    findOne(id: string): Promise<QuizFindOneResponse>;
    getWithRandomQuestions(id: string): Promise<QuizRandomQuestionsResponse>;
    updateQuestions(id: string, dto: UpdateQuizQuestionsDto): Promise<void>;
    updateMetadata(id: string, dto: UpdateQuizMetadataDto): Promise<void>;
    submit(user: IUser): Promise<void>;
    remove(id: string): Promise<void>;
}
