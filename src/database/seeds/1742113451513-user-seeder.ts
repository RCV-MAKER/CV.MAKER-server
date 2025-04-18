import { ROLE } from '@common/constants/entity.enum';
import { RoleEntity } from '@modules/role/entities/role.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder1742113451513 implements Seeder {
  track = false;
  private userRepository: Repository<UserEntity>;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    this.userRepository = dataSource.getRepository(UserEntity);

    const adminUser = await this.userRepository.findOneBy({
      email: 'admin@gmail.com',
    });
    if (!adminUser) {
      await this.userRepository.insert(
        new UserEntity({
          email: 'admin@gmail.com',
          password: 'nestboilerplate@2025',
          username: 'admin',
          name: 'admin',
          isActive: true,
          isConfirmed: true,
        }),
      );
    }

    const countRecord = await this.userRepository.count();
    if (countRecord === 1) {
      const userFactory = factoryManager.get(UserEntity);
      await userFactory.saveMany(5);
    }

    await this.assignRoleForUser(dataSource);
  }

  private async assignRoleForUser(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(RoleEntity);
    const [adminRole, moderatorRole, basicRole] = await Promise.all([
      roleRepository.findOneBy({ name: ROLE.ADMIN }),
      roleRepository.findOneBy({ name: ROLE.MODERATOR }),
      roleRepository.findOneBy({ name: ROLE.USER }),
    ]);
    console.log(adminRole);

    const users = await this.userRepository.find();

    const usersUpdate = users.map((user) => {
      if (user.email === 'admin@gmail.com') {
        user.roleId = adminRole.id;
      } else if (user.email === 'moderator@gmail.com') {
        user.roleId = moderatorRole.id;
      } else {
        user.roleId = basicRole.id;
      }

      return { ...user, roleId: user.roleId };
    });

    await this.userRepository
      .upsert(usersUpdate, {
        conflictPaths: ['id'],
      })
      .then(() => {
        console.log(
          'Update data for user table: ',
          usersUpdate.length,
          ' record',
        );
      });
  }
}
