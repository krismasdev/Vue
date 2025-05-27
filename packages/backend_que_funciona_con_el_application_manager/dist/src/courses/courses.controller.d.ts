import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesFindAllResponseItem, StudentCountsResponseItem } from './response';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto): Promise<void>;
    findAll(): Promise<CoursesFindAllResponseItem[]>;
    getStudentCounts(): Promise<StudentCountsResponseItem[]>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<void>;
    remove(id: string): Promise<void>;
}
