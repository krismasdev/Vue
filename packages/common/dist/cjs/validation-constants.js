"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_QUIZ_MIMETYPES = exports.MAX_QUIZ_FILE_SIZE = exports.VALID_PROFILEPIC_MIMETYPES = exports.MAX_PROFILEPIC_FILE_SIZE = exports.MAX_FILESYSTEM_FILE_SIZE = exports.VALID_FILESYSTEM_MIMETYPES = exports.PASSWORD_REGEX = exports.QUIZ_MAX_QUESTIONS_ATTEMPT = exports.QUIZ_MIN_QUESTIONS_ATTEMPT = exports.EVENT_MAX_SLOTS = exports.EVENT_MIN_SLOTS = exports.STR_MIN_LENGTH_LONG = exports.STR_MAX_LENGTH_LONG = exports.STR_MIN_LENGTH_MEDIUM = exports.STR_MAX_LENGTH_MEDIUM = exports.STR_MIN_LENGTH = exports.STR_MAX_LENGTH = void 0;
exports.STR_MAX_LENGTH = 40;
exports.STR_MIN_LENGTH = 3;
exports.STR_MAX_LENGTH_MEDIUM = 120;
exports.STR_MIN_LENGTH_MEDIUM = 3;
exports.STR_MAX_LENGTH_LONG = 255;
exports.STR_MIN_LENGTH_LONG = 3;
exports.EVENT_MIN_SLOTS = 1;
exports.EVENT_MAX_SLOTS = 100;
exports.QUIZ_MIN_QUESTIONS_ATTEMPT = 5;
exports.QUIZ_MAX_QUESTIONS_ATTEMPT = 20;
exports.PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/;
exports.VALID_FILESYSTEM_MIMETYPES = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
    "image/png",
    "image/jpeg",
    "image/jpg",
];
exports.MAX_FILESYSTEM_FILE_SIZE = 104857600;
exports.MAX_PROFILEPIC_FILE_SIZE = 10485760;
exports.VALID_PROFILEPIC_MIMETYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
];
exports.MAX_QUIZ_FILE_SIZE = 10485760;
exports.VALID_QUIZ_MIMETYPES = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
];
//# sourceMappingURL=validation-constants.js.map