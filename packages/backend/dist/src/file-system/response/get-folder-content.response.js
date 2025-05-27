"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFolderContentResponseFile = exports.GetFolderContentResponseFolder = exports.GetFolderContentResponse = void 0;
const openapi = require("@nestjs/swagger");
class GetFolderContentResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { folders: { required: true, type: () => [require("./get-folder-content.response").GetFolderContentResponseFolder] }, parentId: { required: true, type: () => String }, files: { required: true, type: () => [require("./get-folder-content.response").GetFolderContentResponseFile] }, name: { required: true, type: () => String }, id: { required: true, type: () => String } };
    }
}
exports.GetFolderContentResponse = GetFolderContentResponse;
class GetFolderContentResponseFolder {
    static _OPENAPI_METADATA_FACTORY() {
        return { numberOfChildren: { required: true, type: () => Number }, _count: { required: true, type: () => ({ files: { required: true, type: () => Number }, folders: { required: true, type: () => Number } }) }, id: { required: true, type: () => String }, courseId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, name: { required: true, type: () => String }, parentId: { required: true, type: () => String }, isRoot: { required: true, type: () => Boolean } };
    }
}
exports.GetFolderContentResponseFolder = GetFolderContentResponseFolder;
class GetFolderContentResponseFile {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, contentType: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, folderId: { required: true, type: () => String } };
    }
}
exports.GetFolderContentResponseFile = GetFolderContentResponseFile;
//# sourceMappingURL=get-folder-content.response.js.map