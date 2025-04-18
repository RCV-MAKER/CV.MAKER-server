import { ICurrentUser } from '@common/interfaces/index';

export interface PermissionHandlerInterface {
  handle(user: ICurrentUser): boolean;
}
