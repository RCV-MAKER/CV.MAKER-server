import { CommonModule } from '@common/common.module';
import { AdminAuthController } from '@modules/auth/controllers/admin-auth.controller';
import { SessionModule } from '@modules/session/session.module';
import { UserModule } from '@modules/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [UserModule, SessionModule, CommonModule, HttpModule.register({})],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService],
})
export class AuthModule {}
