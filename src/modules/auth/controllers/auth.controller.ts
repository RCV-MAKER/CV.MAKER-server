import { TOKEN_TYPE } from '@common/constants/token-type.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@common/decorators/http.decorators';
import { ICurrentUser } from '@common/interfaces';
import { AuthConfirmEmailDto } from '@modules/auth/dto/request/auth-confirm-email.dto';
import { AuthResetPasswordDto } from '@modules/auth/dto/request/auth-reset-password.dto';
import { EmailDto } from '@modules/auth/dto/request/email.dto';
import { LoginWithGoogleReqDto } from '@modules/auth/dto/request/login-with-google.req.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { LoginReqDto } from '../dto/request/login.req.dto';
import { RefreshReqDto } from '../dto/request/refresh.req.dto';
import { RegisterReqDto } from '../dto/request/register.req.dto';
import { LoginResDto } from '../dto/response/login.res.dto';
import { RefreshResDto } from '../dto/response/refresh.res.dto';
import { RegisterResDto } from '../dto/response/register.res.dto';

@ApiTags('Auth APIs')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublic({
    type: RegisterResDto,
    summary: 'Register for user',
  })
  @Post('register')
  async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return this.authService.register(dto);
  }

  @ApiPublic({
    type: LoginResDto,
    summary: 'Sign in for user',
  })
  @Post('login')
  async login(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
    return this.authService.signIn(userLogin);
  }

  @ApiPublic({
    type: LoginResDto,
    summary: 'Login with google',
  })
  @Post('google')
  async loginWithGoogle(@Body() request: LoginWithGoogleReqDto) {
    return await this.authService.loginWithGoogle(request);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token for user',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return this.authService.refreshToken(dto);
  }

  @ApiAuth({
    summary: 'Logout for user',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('logout')
  async logout(@CurrentUser('sessionId') sessionId: string): Promise<void> {
    await this.authService.logout(sessionId);
  }

  @ApiPublic({
    summary: 'Email verification to activate account',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Get('verify-email')
  async verifyEmail(@Query() query: AuthConfirmEmailDto) {
    return this.authService.verifyEmailToken(
      query.token,
      TOKEN_TYPE.ACTIVATION,
    );
  }

  @ApiPublic({
    summary: 'Resend verification email',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('resend-verify-email')
  async resendVerifyEmail(@Body() dto: EmailDto) {
    return this.authService.resendEmailActivation(dto);
  }

  @ApiPublic({
    summary: 'Forgot password verification link',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: EmailDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiPublic({
    summary: 'Verify email reset password link',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Get('verify-reset-password-link')
  async verifyResetPassword(@Query() query: AuthConfirmEmailDto) {
    return this.authService.verifyEmailToken(
      query.token,
      TOKEN_TYPE.FORGOT_PASSWORD,
    );
  }

  @ApiPublic({
    summary: 'Reset password',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('reset-password')
  resetPassword(@Body() dto: AuthResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiAuth({
    summary: 'Revoke tokens in other login sessions',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Delete('revoke-token')
  revokeToken(@CurrentUser() user: ICurrentUser) {
    return this.authService.revokeTokens(user);
  }
}
