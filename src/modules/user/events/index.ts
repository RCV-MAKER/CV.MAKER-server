import { IEvent } from '@common/events/event.interface';
import { Uuid } from '@common/types/common.type';

export enum USER_EVENT {
  GET_USER_PERMISSION_AND_CACHE = 'get-user-permission',
}

export const USER_SCOPE = 'user';

export class GetUserPermissionEvent implements IEvent<Uuid> {
  readonly scope = USER_SCOPE;
  readonly name = USER_EVENT.GET_USER_PERMISSION_AND_CACHE;

  constructor(readonly payload: Uuid) {}
}
