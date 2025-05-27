"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosFindAllResponseItem = void 0;
const openapi = require("@nestjs/swagger");
class VideosFindAllResponseItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { courses: { required: true, type: () => [CourseItem] }, id: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, url: { required: true, type: () => String }, title: { required: true, type: () => String }, date: { required: true, type: () => Date } };
    }
}
exports.VideosFindAllResponseItem = VideosFindAllResponseItem;
class CourseItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String } };
    }
}
//# sourceMappingURL=videos.find-all.response.js.map