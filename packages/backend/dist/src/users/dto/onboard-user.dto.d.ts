declare abstract class OnboardUserDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
export declare class OnboardTeacherDto extends OnboardUserDto {
}
export declare class OnboardStudentDto extends OnboardUserDto {
    birthDate: Date;
    address: string;
    zipCode: string;
    city: string;
    idNumber: string;
    idIssueDate: Date;
    courseId: string;
    joinClub: boolean;
}
export {};
