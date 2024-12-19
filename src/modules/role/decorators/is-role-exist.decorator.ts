import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Role } from 'src/modules/role/enums/role.enum';

export function IsRoleExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: 'Role does not exist!',
        ...validationOptions,
      },
      constraints: [property],
      validator: IsRoleExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsRoleExist' })
export class IsRoleExistConstraint implements ValidatorConstraintInterface {
  async validate(value: string) {
    const availableRoles = Object.values(Role) as string[];
    if (value && !availableRoles.includes(value)) {
      return false;
    }
    return true;
  }
}
