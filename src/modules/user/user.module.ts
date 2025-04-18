import { SessionModule } from '@modules/session/session.module';
import { AdminUserController } from '@modules/user/controller/admin-user.controller';
import { UserEntity } from '@modules/user/entities/user.entity';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SessionModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
