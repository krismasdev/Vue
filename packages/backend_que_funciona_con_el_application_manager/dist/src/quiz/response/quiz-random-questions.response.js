"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRandomQuestionsResponseQuestionAnswer = exports.QuizRandomQuestionsResponseQuestion = exports.QuizRandomQuestionsResponse = void 0;
const openapi = require("@nestjs/swagger");
class QuizRandomQuestionsResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { questions: { required: true, type: () => [require("./quiz-random-questions.response").QuizRandomQuestionsResponseQuestion] } };
    }
}
exports.QuizRandomQuestionsResponse = QuizRandomQuestionsResponse;
class QuizRandomQuestionsResponseQuestion {
    static _OPENAPI_METADATA_FACTORY() {
        return { answers: { required: true, type: () => [require("./quiz-random-questions.response").QuizRandomQuestionsResponseQuestionAnswer] } };
    }
}
exports.QuizRandomQuestionsResponseQuestion = QuizRandomQuestionsResponseQuestion;
class QuizRandomQuestionsResponseQuestionAnswer {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, content: { required: true, type: () => String }, isCorrect: { required: true, type: () => Boolean }, questionId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.QuizRandomQuestionsResponseQuestionAnswer = QuizRandomQuestionsResponseQuestionAnswer;
//# sourceMappingURL=quiz-random-questions.response.js.map