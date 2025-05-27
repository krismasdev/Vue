export declare abstract class UpdateProfileDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
export declare class UpdateManagerProfileDto extends UpdateProfileDto {
}
export declare class UpdateStudentProfileDto extends UpdateProfileDto {
    birthDate: Date;
    address: string;
    zipCode: string;
    city: string;
    idNumber: string;
    idIssueDate: Date;
}
