import { IS_PUBLIC } from '@common/constants/app.constant';
import { ROLE } from '@common/constants/entity.enum';
import { ErrorCode } from '@common/constants/error-code/error-code.constant';
import { CHECK_PERMISSION_KEY } from '@common/decorators/permission.decorator';
import { EventService } from '@common/events/event.service';
import { PermissionHandlerInterface } from '@common/interfaces/permission-handler.interface';
import { preparePermissionPayload } from '@modules/permission/helpers';
import { UserEntity } from '@modules/user/entities/user.entity';
import { GetUserPermissionEvent } from '@modules/user/events';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ICurrentUser } from 'src/common/interfaces';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly eventService: EventService,
  ) {}

  /**
   * check if user authorized
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler(),
    );
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user: ICurrentUser = request.user;

    if (user.role === ROLE.ADMIN) return true;

    const permissionHandlers =
      this.reflector.get<PermissionHandlerInterface[]>(
        CHECK_PERMISSION_KEY,
        context.getHandler(),
      ) ?? [];

    const userPermission = (await this.eventService.emitAsync(
      new GetUserPermissionEvent(user.id),
    )) as UserEntity;

    user.permissions = preparePermissionPayload(
      userPermission.role.permissions,
    );
    const permitted = permissionHandlers.every((handler) =>
      handler.handle(user),
    );

    if (!permitted) {
      throw new ForbiddenException(ErrorCode.ACCESS_DENIED);
    }
    return permitted;
  }
}
