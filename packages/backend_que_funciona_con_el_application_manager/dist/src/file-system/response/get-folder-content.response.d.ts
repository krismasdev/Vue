export declare class GetFolderContentResponse {
    folders: GetFolderContentResponseFolder[];
    parentId: string;
    files: GetFolderContentResponseFile[];
    name: string;
    id: string;
}
export declare class GetFolderContentResponseFolder {
    numberOfChildren: number;
    _count: {
        files: number;
        folders: number;
    };
    id: string;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    parentId: string;
    isRoot: boolean;
}
export declare class GetFolderContentResponseFile {
    id: string;
    name: string;
    contentType: string;
    createdAt: Date;
    updatedAt: Date;
    folderId: string;
}
