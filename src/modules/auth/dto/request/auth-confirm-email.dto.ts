import { TokenField } from '@common/decorators/field.decorators';

export class AuthConfirmEmailDto {
  @TokenField()
  token: string;
}
