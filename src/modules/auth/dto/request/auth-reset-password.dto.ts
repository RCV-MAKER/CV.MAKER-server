import { PasswordField, TokenField } from '@common/decorators/field.decorators';
import { MatchPassword } from '@common/decorators/validators/match-password.decorator';

export class AuthResetPasswordDto {
  @PasswordField()
  password!: string;

  @PasswordField()
  @MatchPassword('password')
  confirm_password!: string;

  @TokenField()
  token!: string;
}
