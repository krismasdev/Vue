export declare class QuizFindOneResponse {
    questions: QuizFindOneResponseQuestion[];
}
export declare class QuizFindOneResponseQuestion {
    answers: QuizFindOneResponseQuestionAnswer[];
}
export declare class QuizFindOneResponseQuestionAnswer {
    id: string;
    content: string;
    isCorrect: boolean;
    questionId: string;
    createdAt: Date;
    updatedAt: Date;
}
