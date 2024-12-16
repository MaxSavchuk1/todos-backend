import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsConfirmed(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: 'Password confirmation does not match!',
        ...validationOptions,
      },
      constraints: [property],
      validator: IsConfirmedConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsConfirmed' })
export class IsConfirmedConstraint implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments: ValidationArguments) {
    const relatedPropertyName =
      validationArguments.constraints?.[0] || 'passwordConfirmation';
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];
    return value === relatedValue;
  }
}
