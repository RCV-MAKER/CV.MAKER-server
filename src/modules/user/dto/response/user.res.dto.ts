import { ROLE } from '@common/constants/entity.enum';
import {
  StringField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import { BaseResDto } from '@common/dto/base.res.dto';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
@Expose({ toPlainOnly: true })
export class UserResDto extends BaseResDto {
  @StringField()
  @Expose()
  email: string;

  @Exclude()
  password: string;

  @StringField()
  @Transform(({ obj }) => (obj.role ? obj.role.name : ROLE.USER))
  @Expose()
  role: ROLE;

  @StringField()
  @Expose()
  name: string;

  @StringFieldOptional()
  @Expose()
  avatar: string;

  @StringField()
  @Expose()
  username: string;
}
