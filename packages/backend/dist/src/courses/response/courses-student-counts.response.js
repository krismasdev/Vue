"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentCountsResponseItem = void 0;
const openapi = require("@nestjs/swagger");
class StudentCountsResponseItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { courseId: { required: true, type: () => String }, _count: { required: true, type: () => Number } };
    }
}
exports.StudentCountsResponseItem = StudentCountsResponseItem;
//# sourceMappingURL=courses-student-counts.response.js.map