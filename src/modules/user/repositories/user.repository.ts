import { ROLE } from '@common/constants/entity.enum';
import { OffsetPaginationDto } from '@common/dto/offset-pagination/offset-pagination.dto';
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@common/types/common.type';
import { AdminQueryUserReqDto } from '@modules/user/dto/request/admin-query-user.req.dto';
import { UserResDto } from '@modules/user/dto/response/user.res.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Brackets, DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async getListUser(filterOptions: AdminQueryUserReqDto) {
    const queryBuilder = this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.roleId',
        'user.username',
        'user.name',
        'user.avatar',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
      ])
      .leftJoinAndSelect('user.role', 'role')
      .andWhere('role.name != :roleName', { roleName: ROLE.ADMIN })
      .withDeleted();

    if (filterOptions.role && filterOptions.role.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const [index, role] of filterOptions.role.entries()) {
            qb.orWhere(`role.name ILIKE :role${index}`, {
              [`role${index}`]: `%${role}%`,
            });
          }
        }),
      );
    }

    if (filterOptions.keywords) {
      queryBuilder.andWhere('user.email ILIKE :email', {
        email: `%${filterOptions.keywords}%`,
      });
    }
    if (filterOptions.onlyDeleted) {
      queryBuilder.andWhere('user.deletedAt IS NOT NULL');
    }
    queryBuilder
      .take(filterOptions.limit)
      .skip(
        filterOptions.page ? (filterOptions.page - 1) * filterOptions.limit : 0,
      )
      .orderBy('user.createdAt', filterOptions.order);

    const [users, totalRecords] = await queryBuilder.getManyAndCount();

    const meta = new OffsetPaginationDto(totalRecords, filterOptions);
    return new OffsetPaginatedDto(
      plainToInstance(UserResDto, users, { excludeExtraneousValues: true }),
      meta,
    );
  }

  async getRoleAndUserAssigned(roleId: Uuid, filterOptions: PageOptionsDto) {
    const searchCriteria = ['user.email', 'userInfo.username', 'userInfo.name'];
    const queryBuilder = this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.roleId',
        'user.username',
        'user.name',
        'user.avatar',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
      ])
      .andWhere('user.roleId = :roleId', { roleId: roleId })
      .leftJoinAndSelect('user.role', 'role');

    if (filterOptions.keywords) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const field of searchCriteria) {
            qb.orWhere(`${field} ILIKE :keywords`, {
              keywords: `%${filterOptions.keywords}%`,
            });
          }
        }),
      );
    }

    queryBuilder
      .take(filterOptions.limit)
      .skip(
        filterOptions.page ? (filterOptions.page - 1) * filterOptions.limit : 0,
      )
      .orderBy('user.createdAt', filterOptions.order);

    const [users, totalRecords] = await queryBuilder.getManyAndCount();

    const meta = new OffsetPaginationDto(totalRecords, filterOptions);
    return new OffsetPaginatedDto(
      plainToInstance(UserResDto, users, { excludeExtraneousValues: true }),
      meta,
    );
  }
}
