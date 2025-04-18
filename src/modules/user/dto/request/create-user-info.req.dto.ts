import {
  StringField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';

export class CreateUserInfoDto {
  @StringField()
  username!: string;

  @StringFieldOptional()
  name?: string;

  @StringFieldOptional()
  avatar?: string;
}
