import { ROLE } from '@common/constants/entity.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@common/decorators/http.decorators';
import { RolesGuard } from '@common/guards/role.guard';
import { AuthService } from '@modules/auth/auth.service';
import { LoginReqDto } from '@modules/auth/dto/request/login.req.dto';
import { RefreshReqDto } from '@modules/auth/dto/request/refresh.req.dto';
import { LoginResDto } from '@modules/auth/dto/response/login.res.dto';
import { RefreshResDto } from '@modules/auth/dto/response/refresh.res.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin auth APIs')
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublic({
    type: LoginResDto,
    summary: 'Sign in for admin',
  })
  @Post('login')
  async signInAdmin(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
    return this.authService.signIn(userLogin, true);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token for admin',
  })
  @Post('refresh')
  async refreshAdmin(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return this.authService.refreshToken(dto, true);
  }

  @ApiAuth({
    summary: 'Logout for admin',
    roles: [ROLE.ADMIN],
  })
  @UseGuards(RolesGuard)
  @Post('logout')
  logoutAdmin(@CurrentUser('sessionId') sessionId: string): Promise<void> {
    return this.authService.logout(sessionId);
  }
}
