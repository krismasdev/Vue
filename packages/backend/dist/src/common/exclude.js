"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = void 0;
function exclude(user, keys) {
    for (const key of keys) {
        delete user[key];
    }
    return user;
}
exports.exclude = exclude;
//# sourceMappingURL=exclude.js.map