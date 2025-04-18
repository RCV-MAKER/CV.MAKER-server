import { PermissionConfiguration } from '@config/permission.config';
import { PermissionEntity } from '@modules/permission/entities/permission.entity';
import {
  createPermissions,
  prepareConditionFindPermissions,
} from '@modules/permission/helpers';
import { RoleEntity } from '@modules/role/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class RoleSeeder1742113420242 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(RoleEntity);

    const countRecord = await repository.count();

    if (countRecord === 0) {
      const items: Partial<RoleEntity>[] = PermissionConfiguration.map(
        (permission) => ({
          name: permission.name,
          description: permission.description,
        }),
      );

      await repository.insert(items).then(() => {
        console.log('Seeded data for role table: ', items.length, ' record');
      });

      await Promise.all(
        PermissionConfiguration.map(async (role) => {
          const items = createPermissions(role.permissions);
          const condition = prepareConditionFindPermissions(items);

          const roleEntity = await repository.findOneBy({ name: role.name });

          roleEntity.permissions = await dataSource
            .getRepository(PermissionEntity)
            .findBy(condition);

          await roleEntity.save();
        }),
      ).then(() => {
        console.log('Seeded permissions for role success');
      });
    }
  }
}
