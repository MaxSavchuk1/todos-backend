import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsNotEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} is equal to ${property}!`,
        ...validationOptions,
      },
      constraints: [property],
      validator: IsNotEqualToConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsNotEqualTo' })
export class IsNotEqualToConstraint implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments: ValidationArguments) {
    const relatedPropertyName = validationArguments.constraints[0];
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];
    return value !== relatedValue;
  }
}
