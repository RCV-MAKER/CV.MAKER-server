import { UserEntity } from '@modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserEntity, (fake) => {
  const user = new UserEntity();

  const firstName = fake.person.firstName();
  const lastName = fake.person.lastName();
  user.email = fake.internet.email({ firstName, lastName });
  user.username = user.email.split('@')[0];
  user.name = `${firstName} ${lastName}`;
  user.password = 'nestboilerplate@2025';
  user.isActive = true;
  user.isConfirmed = true;
  return user;
});
