import { ActionList, ResourceList } from '@common/constants/app.constant';
import { EnumField, StringField } from '@common/decorators/field.decorators';
import { BaseResDto } from '@common/dto/base.res.dto';
import { Expose } from 'class-transformer';

@Expose()
export class PermissionResDto extends BaseResDto {
  @EnumField(() => ResourceList)
  @Expose()
  resource: ResourceList;

  @EnumField(() => ActionList)
  @Expose()
  action: ActionList;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  description: string;
}
