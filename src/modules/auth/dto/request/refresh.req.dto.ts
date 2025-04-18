import { TokenField } from '@common/decorators/field.decorators';

export class RefreshReqDto {
  @TokenField({ name: 'refresh_token' })
  refreshToken!: string;
}
