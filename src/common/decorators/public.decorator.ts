import { IS_PUBLIC } from '@common/constants/app.constant';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(IS_PUBLIC, true);
