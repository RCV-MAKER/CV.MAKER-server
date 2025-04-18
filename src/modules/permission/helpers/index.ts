import { ActionList } from '@common/constants/app.constant';
import { PermissionPayload } from '@config/permission.config';
import { PermissionEntity } from '@modules/permission/entities/permission.entity';

export const createPermissions = (items: Array<PermissionPayload>) => {
  const permissions: Partial<PermissionEntity>[] = [];

  items.forEach((item) => {
    item.actions.forEach((action) => {
      permissions.push({
        resource: item.resource,
        action: action as ActionList,
        name: `${action} ${item.resource}`,
        description: `${action} ${item.resource}`,
      });
    });
  });

  return permissions;
};

export const preparePermissionPayload = (
  permissions: Partial<PermissionEntity>[],
) => {
  return permissions.map(
    (permission) => `${permission.resource}:${permission.action}`,
  );
};

export const prepareConditionFindPermissions = (
  permissions: Partial<PermissionEntity>[],
) =>
  permissions.map((permission) => ({
    action: permission.action,
    resource: permission.resource,
  }));
