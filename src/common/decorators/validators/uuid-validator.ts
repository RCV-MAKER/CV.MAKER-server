import { ErrorCode } from '@common/constants/error-code/error-code.constant';
import { ValidationException } from '@common/exceptions/validation.exception';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ValidateUuid implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (isUUID(value)) return value;
    throw new ValidationException(ErrorCode.COMMON, 'Id must be a uuid');
  }
}
