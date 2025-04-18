import { CacheKey } from '@common/constants/cache.constant';
import { ROLE } from '@common/constants/entity.enum';
import { ErrorCode } from '@common/constants/error-code/error-code.constant';
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto';
import { EventService } from '@common/events/event.service';
import { CommonFunction } from '@common/helpers/common.function';
import { Uuid } from '@common/types/common.type';
import { Optional } from '@common/utils/optional';
import { verifyPassword } from '@common/utils/password.util';
import { MailService } from '@libs/mail/mail.service';
import { CacheTTL } from '@libs/redis/utils/cache-ttl.utils';
import { CreateCacheKey } from '@libs/redis/utils/create-cache-key.utils';
import { GetRoleEvent } from '@modules/role/events/get-role.event';
import { SessionService } from '@modules/session/session.service';
import { AdminQueryUserReqDto } from '@modules/user/dto/request/admin-query-user.req.dto';
import { ChangePasswordReqDto } from '@modules/user/dto/request/change-password.req';
import { CreateUserDto } from '@modules/user/dto/request/create-user.req.dto';
import { UserResDto } from '@modules/user/dto/response/user.res.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { USER_EVENT, USER_SCOPE } from '@modules/user/events';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
    private readonly eventService: EventService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const { email, password, name, avatar } = dto;
    const newUser = new UserEntity({
      email,
      username: email.split('@')[0],
      password,
      name,
      avatar,
      isConfirmed: false,
      isActive: false,
    });

    const role = await this.eventService.emitAsync(
      new GetRoleEvent({ name: ROLE.USER }),
    );

    if (role) {
      newUser.roleId = role.id;
      newUser.role = role;
    }

    return this.userRepository.save(newUser);
  }

  async findById(id: Uuid) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    console.log(user);
    return plainToInstance(UserResDto, user);
  }

  async findByUserId(id: Uuid, withDeleted: boolean = false) {
    return Optional.of(
      await this.userRepository.findOne({
        where: { id },
        withDeleted,
      }),
    )
      .throwIfNotPresent(new NotFoundException(ErrorCode.USER_NOT_FOUND))
      .get() as UserEntity;
  }

  async updateUser(userId: Uuid, dto: Partial<UserEntity>) {
    await this.findByUserId(userId);
    await this.userRepository.update({ id: userId }, dto);
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findOneByCondition(condition: FindOptionsWhere<UserEntity>) {
    return this.userRepository.findOne({
      where: condition,
      relations: { role: true },
    });
  }

  @OnEvent(`${USER_SCOPE}.${USER_EVENT.GET_USER_PERMISSION_AND_CACHE}`)
  async findUserByIdAndCache(userId: Uuid) {
    let user: UserEntity = await this.cacheService.get(
      CreateCacheKey(CacheKey.USER_PERMISSION, userId),
    );

    if (user) {
      return user;
    } else {
      user = await this.userRepository.findOneOrFail({
        where: { id: userId },
        relations: { role: { permissions: true } },
      });

      await this.cacheService.set(
        CreateCacheKey(CacheKey.USER_PERMISSION, userId),
        user,
        CacheTTL.days(1),
      );

      return user;
    }
  }

  async changePassword(dto: ChangePasswordReqDto, userId: Uuid) {
    const user = await this.findByUserId(userId);
    if ((await verifyPassword(dto.old_password, user.password)) === false) {
      throw new BadRequestException(ErrorCode.OLD_PASSWORD_INCORRECT);
    }

    user.password = dto.new_password;
    await this.userRepository.save(user);
  }

  async requestDeleteAccount(userId: Uuid) {
    const isExistRequest = await this.cacheService.get(
      CreateCacheKey(CacheKey.REQUEST_DELETE, userId),
    );
    if (isExistRequest) {
      throw new BadRequestException(ErrorCode.REQUEST_DELETE_ACCOUNT_INVALID);
    }
    const user = await this.findByUserId(userId);
    const code = await CommonFunction.generateCode(6);
    await this.cacheService.set(
      CreateCacheKey(CacheKey.REQUEST_DELETE, userId),
      code,
      CacheTTL.minutes(5),
    );
    await this.mailService.requestDeleteAccount(user.email, code);
  }

  async verifyDeleteAccount(userId: Uuid, code: string) {
    const codeInRedis = await this.cacheService.get(
      CreateCacheKey(CacheKey.REQUEST_DELETE, userId),
    );
    if (code !== codeInRedis || codeInRedis === null) {
      throw new BadRequestException(ErrorCode.CODE_INCORRECT);
    }
    const user = await this.findByUserId(userId);
    user.deletedAt = new Date();
    await this.userRepository.save(user);

    await this.cacheService.del(
      CreateCacheKey(CacheKey.REQUEST_DELETE, userId),
    );
    await this.sessionService.deleteByUserId({ userId: user.id });
  }

  async getListUser(filter: AdminQueryUserReqDto) {
    return this.userRepository.getListUser(filter);
  }

  async getListUserByRole(roleId: Uuid, filterOptions: PageOptionsDto) {
    return this.userRepository.getRoleAndUserAssigned(roleId, filterOptions);
  }

  async deleteUser(userId: Uuid) {
    const user = await this.findByUserId(userId);
    if (user.deletedAt === null) {
      await this.userRepository.softDelete({ id: userId });
    }
  }

  async restoreUser(userId: Uuid) {
    const user = await this.findByUserId(userId, true);
    if (user.deletedAt !== null) {
      user.deletedAt = null;
      await this.userRepository.save(user);
    }
  }

  async isExistUserByEmail(email: string) {
    const user = await this.userRepository.count({
      where: { email },
      withDeleted: true,
    });

    return user > 0;
  }
}
