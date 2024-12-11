import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new HttpException(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: errors.reduce(
          (accumulator, currentValue) => [
            ...accumulator,
            ...Object.values(currentValue.constraints),
          ],
          [],
        ),
        messageByField: errors.reduce(
          (accumulator, currentValue) => ({
            ...accumulator,
            [currentValue.property]: Object.values(
              currentValue.constraints,
            ).join(', '),
          }),
          {},
        ),
        error: 'Unprocessable Entity',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  },
};

export default validationOptions;
