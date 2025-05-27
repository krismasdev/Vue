"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvents = exports.EventEvents = exports.ChatEvents = void 0;
var ChatEvents;
(function (ChatEvents) {
    ChatEvents["NEW_MESSAGE"] = "chat.newMessage";
})(ChatEvents = exports.ChatEvents || (exports.ChatEvents = {}));
var EventEvents;
(function (EventEvents) {
    EventEvents["EVENT_CREATED"] = "event.created";
})(EventEvents = exports.EventEvents || (exports.EventEvents = {}));
var UserEvents;
(function (UserEvents) {
    UserEvents["USER_ACCEPTED"] = "user.accepted";
    UserEvents["USER_ONBOARDED"] = "user.onboarded";
})(UserEvents = exports.UserEvents || (exports.UserEvents = {}));
//# sourceMappingURL=enums.js.map