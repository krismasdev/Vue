import { Role } from '@prisma/client';
export declare function Auth(...roles: (Role | 'ALL')[]): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
