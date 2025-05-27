"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizFindOneResponseQuestionAnswer = exports.QuizFindOneResponseQuestion = exports.QuizFindOneResponse = void 0;
const openapi = require("@nestjs/swagger");
class QuizFindOneResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { questions: { required: true, type: () => [require("./quiz-find-one.response").QuizFindOneResponseQuestion] } };
    }
}
exports.QuizFindOneResponse = QuizFindOneResponse;
class QuizFindOneResponseQuestion {
    static _OPENAPI_METADATA_FACTORY() {
        return { answers: { required: true, type: () => [require("./quiz-find-one.response").QuizFindOneResponseQuestionAnswer] } };
    }
}
exports.QuizFindOneResponseQuestion = QuizFindOneResponseQuestion;
class QuizFindOneResponseQuestionAnswer {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, content: { required: true, type: () => String }, isCorrect: { required: true, type: () => Boolean }, questionId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.QuizFindOneResponseQuestionAnswer = QuizFindOneResponseQuestionAnswer;
//# sourceMappingURL=quiz-find-one.response.js.map