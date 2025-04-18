import { ICurrentUser } from '@common/interfaces';
import { PermissionHandlerInterface } from '@common/interfaces/permission-handler.interface';
import { PermissionPayload } from '@config/permission.config';

export class PermissionHandler implements PermissionHandlerInterface {
  constructor(private readonly permission: PermissionPayload) {}

  handle(user: ICurrentUser): boolean {
    const { resource, actions } = this.permission;
    if (user && user.role && user.permissions) {
      const setPermission = new Set(user.permissions);
      return actions.every((action) =>
        setPermission.has(`${resource}:${action}`),
      );
    }
    return false;
  }
}
