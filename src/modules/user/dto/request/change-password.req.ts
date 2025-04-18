import { PasswordField } from '@common/decorators/field.decorators';
import { MatchPassword } from '@common/decorators/validators/match-password.decorator';

export class ChangePasswordReqDto {
  @PasswordField()
  old_password: string;

  @PasswordField()
  new_password!: string;

  @PasswordField()
  @MatchPassword('new_password')
  confirm_new_password: string;
}
