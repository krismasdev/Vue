declare class RootFolder {
    id: string;
    name: string;
}
declare class Folder {
    id: string;
    name: string;
}
declare class PredefinedEventDetail {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}
declare class PredefinedEvent {
    predefinedEvent: PredefinedEventDetail;
    courseId: string;
    predefinedEventId: string;
}
export declare class CoursesFindAllResponseItem {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    rootFolder: RootFolder;
    folders: Folder[];
    predefinedEvents: PredefinedEvent[];
}
export {};
