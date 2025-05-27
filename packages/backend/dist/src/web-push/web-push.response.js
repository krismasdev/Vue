"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPushResponse = void 0;
const openapi = require("@nestjs/swagger");
class WebPushResponse {
    constructor(chatEnabled, calendarEnabled) {
        this.chatEnabled = chatEnabled;
        this.calendarEnabled = calendarEnabled;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.WebPushResponse = WebPushResponse;
//# sourceMappingURL=web-push.response.js.map