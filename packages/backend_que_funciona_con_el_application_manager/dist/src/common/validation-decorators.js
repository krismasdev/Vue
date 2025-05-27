"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOneOf = exports.IsSameDay = exports.IsAfterProperty = void 0;
const class_validator_1 = require("class-validator");
const IsAfterProperty = (property, options) => (0, class_validator_1.ValidateBy)({
    name: 'IsAfterProperty',
    constraints: [property],
    validator: {
        validate: (value, args) => {
            if (!(value instanceof Date)) {
                return false;
            }
            const relatedPropertyName = args.constraints[0];
            const relatedValue = args.object[relatedPropertyName];
            return value > relatedValue;
        },
        defaultMessage: (0, class_validator_1.buildMessage)((each) => each + '$property must be after $constraint1', options),
    },
}, options);
exports.IsAfterProperty = IsAfterProperty;
const IsSameDay = (property, options) => (0, class_validator_1.ValidateBy)({
    name: 'isSameDay',
    constraints: [property],
    validator: {
        validate: (value, args) => {
            if (!(value instanceof Date)) {
                return false;
            }
            const [relatedPropertyName] = args.constraints;
            const relatedValue = args.object[relatedPropertyName];
            return (value.getFullYear() === relatedValue.getFullYear() &&
                value.getMonth() === relatedValue.getMonth() &&
                value.getDate() === relatedValue.getDate());
        },
        defaultMessage: (0, class_validator_1.buildMessage)((each) => each + '$property must be at same day as $constraint1', options),
    },
}, options);
exports.IsSameDay = IsSameDay;
const IsOneOf = (allowedValues, options) => (0, class_validator_1.ValidateBy)({
    name: 'IsOneOf',
    constraints: [allowedValues],
    validator: {
        validate: (value, args) => {
            const [allowedValues] = args.constraints;
            return allowedValues.includes(value);
        },
        defaultMessage: (0, class_validator_1.buildMessage)((each) => each + '$property must be one of $constraint1', options),
    },
}, options);
exports.IsOneOf = IsOneOf;
//# sourceMappingURL=validation-decorators.js.map