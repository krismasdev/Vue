"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizFindAllResponseCourse = exports.QuizFindAllResponse = void 0;
const openapi = require("@nestjs/swagger");
class QuizFindAllResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { courses: { required: true, type: () => [require("./quiz-find-all.response").QuizFindAllResponseCourse] }, id: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, name: { required: true, type: () => String }, nQuestionsPerAttempt: { required: true, type: () => Number } };
    }
}
exports.QuizFindAllResponse = QuizFindAllResponse;
class QuizFindAllResponseCourse {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.QuizFindAllResponseCourse = QuizFindAllResponseCourse;
//# sourceMappingURL=quiz-find-all.response.js.map