import { EmailField } from '@common/decorators/field.decorators';

export class EmailDto {
  @EmailField()
  email: string;
}
