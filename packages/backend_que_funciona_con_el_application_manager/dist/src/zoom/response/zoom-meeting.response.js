"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomMeetingResponse = void 0;
const openapi = require("@nestjs/swagger");
class ZoomMeetingResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, meetingId: { required: true, type: () => String }, joinUrl: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.ZoomMeetingResponse = ZoomMeetingResponse;
//# sourceMappingURL=zoom-meeting.response.js.map