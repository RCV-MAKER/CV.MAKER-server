import {
  EmailField,
  PasswordField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import { MatchPassword } from '@common/decorators/validators/match-password.decorator';

export class RegisterReqDto {
  @EmailField()
  email!: string;

  @StringFieldOptional()
  name: string;

  @PasswordField()
  password!: string;

  @PasswordField()
  @MatchPassword('password')
  confirm_password!: string;
}
