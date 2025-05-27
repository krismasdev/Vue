import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class QuizFindAllPermissionsGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
