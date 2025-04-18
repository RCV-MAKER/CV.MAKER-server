import { ROLE } from '@common/constants/entity.enum';
import { Uuid } from '@common/types/common.type';

export interface ICurrentUser {
  id: Uuid;
  role: ROLE;
  sessionId?: Uuid;
  permissions: string[];
}
