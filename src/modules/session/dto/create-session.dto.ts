import { StringField, UUIDField } from '@common/decorators/field.decorators';
import { Uuid } from '@common/types/common.type';

export class CreateSessionDto {
  @StringField()
  hash!: string;

  @UUIDField()
  userId!: Uuid;
}
