import {
  StringField,
  StringFieldOptional,
  UUIDFieldOptional,
} from '@common/decorators/field.decorators';
import { IsArrayDistinct } from '@common/decorators/validators/is-array-disctinct.validator';
import { Uuid } from '@common/types/common.type';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @StringField()
  name: string;

  @StringFieldOptional()
  description?: string;

  @UUIDFieldOptional({ each: true, uniqueItems: true })
  @IsArrayDistinct({ message: 'permission id must contain unique values' })
  @Transform(({ obj }) => {
    return obj.permission_ids && typeof obj.permission_ids === 'string'
      ? [obj.permission_ids]
      : obj.permission_ids;
  })
  permission_ids?: Array<Uuid>;
}
