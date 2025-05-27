export declare class QuizRandomQuestionsResponse {
    questions: QuizRandomQuestionsResponseQuestion[];
}
export declare class QuizRandomQuestionsResponseQuestion {
    answers: QuizRandomQuestionsResponseQuestionAnswer[];
}
export declare class QuizRandomQuestionsResponseQuestionAnswer {
    id: string;
    content: string;
    isCorrect: boolean;
    questionId: string;
    createdAt: Date;
    updatedAt: Date;
}
