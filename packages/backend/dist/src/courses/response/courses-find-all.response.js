"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesFindAllResponseItem = void 0;
const openapi = require("@nestjs/swagger");
class RootFolder {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String } };
    }
}
class Folder {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String } };
    }
}
class PredefinedEventDetail {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
class PredefinedEvent {
    static _OPENAPI_METADATA_FACTORY() {
        return { predefinedEvent: { required: true, type: () => PredefinedEventDetail }, courseId: { required: true, type: () => String }, predefinedEventId: { required: true, type: () => String } };
    }
}
class CoursesFindAllResponseItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, rootFolder: { required: true, type: () => RootFolder }, folders: { required: true, type: () => [Folder] }, predefinedEvents: { required: true, type: () => [PredefinedEvent] } };
    }
}
exports.CoursesFindAllResponseItem = CoursesFindAllResponseItem;
//# sourceMappingURL=courses-find-all.response.js.map