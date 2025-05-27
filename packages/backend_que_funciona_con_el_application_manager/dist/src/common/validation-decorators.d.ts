import { ValidationOptions } from 'class-validator';
export declare const IsAfterProperty: (property: string, options?: ValidationOptions) => PropertyDecorator;
export declare const IsSameDay: (property: string, options?: ValidationOptions) => PropertyDecorator;
export declare const IsOneOf: (allowedValues: string[], options?: ValidationOptions) => PropertyDecorator;
