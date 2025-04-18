import {
  EmailField,
  PasswordField,
  StringFieldOptional,
  URLFieldOptional,
} from '@common/decorators/field.decorators';

export class CreateUserDto {
  @StringFieldOptional()
  readonly name?: string;

  @EmailField()
  readonly email: string;

  @URLFieldOptional()
  readonly avatar?: string;

  @PasswordField()
  readonly password: string;
}
