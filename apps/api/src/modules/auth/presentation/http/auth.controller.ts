import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { GetCurrentUserUseCase } from 'src/modules/auth/application/use-cases/get-current-user/get-current-user.use-case';
import { GoogleLoginUseCase } from 'src/modules/auth/application/use-cases/google-login/google-login.use-case';
import { LoginUseCase } from 'src/modules/auth/application/use-cases/login/login.use-case';
import { LogoutAllUseCase } from 'src/modules/auth/application/use-cases/logout-all/logout-all.use-case';
import { LogoutUseCase } from 'src/modules/auth/application/use-cases/logout/logout.use-case';
import { RefreshUseCase } from 'src/modules/auth/application/use-cases/refresh/refresh.use-case';
import { RegisterUseCase } from 'src/modules/auth/application/use-cases/register/register.use-case';

import { AuthenticatedUser } from './guards/access-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

import { ListSessionsUseCase } from 'src/modules/auth/application/use-cases/list-sessions/list-sessions.use-case';
import { RevokeOtherSessionsUseCase } from 'src/modules/auth/application/use-cases/revoke-other-sessions/revoke-other-sessions.use-case';
import { RevokeSessionUseCase } from 'src/modules/auth/application/use-cases/revoke-session/revoke-session.use-case';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LinkGoogleAccountUseCase } from '../../application/use-cases/link-google-account.use-case/link-google-account.use-case';
import { UnlinkGoogleAccountUseCase } from '../../application/use-cases/unlink-google-account.use-case/unlink-google-account.use-case';
import { AuthResult } from '../../application/use-cases/auth-result';

const CREDENTIALS_THROTTLE = { default: { limit: 10, ttl: 60_000 } };

@Controller('auth')
export class AuthController {
  private readonly refreshCookieName: string;
  private readonly refreshCookiePath: string;
  private readonly refreshCookieMaxAgeMs: number;

  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly listSessionsUseCase: ListSessionsUseCase,
    private readonly revokeSessionUseCase: RevokeSessionUseCase,
    private readonly revokeOtherSessionsUseCase: RevokeOtherSessionsUseCase,
    private readonly linkGoogleAccountUseCase: LinkGoogleAccountUseCase,
    private readonly unlinkGoogleAccountUseCase: UnlinkGoogleAccountUseCase,
    private readonly configService: ConfigService,
  ) {
    this.refreshCookieName = this.configService.getOrThrow<string>(
      'auth.cookies.refreshTokenName',
    );

    const apiPrefix = this.configService
      .getOrThrow<string>('app.prefix')
      .replace(/^\/+|\/+$/g, '');
    this.refreshCookiePath = `/${apiPrefix}/auth`;

    this.refreshCookieMaxAgeMs =
      this.configService.getOrThrow<number>('auth.refreshTokenTtlDays') *
      24 *
      60 *
      60 *
      1000;
  }

  private getRefreshCookieOptions() {
    const isProduction =
      this.configService.getOrThrow<boolean>('app.isProduction');

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: this.refreshCookiePath,
      maxAge: this.refreshCookieMaxAgeMs,
    };
  }

  private setRefreshCookie(response: Response, refreshToken: string): void {
    response.cookie(
      this.refreshCookieName,
      refreshToken,
      this.getRefreshCookieOptions(),
    );
  }

  private clearRefreshCookie(response: Response): void {
    const { maxAge: _maxAge, ...options } = this.getRefreshCookieOptions();

    response.clearCookie(this.refreshCookieName, options);
  }

  private getRequestMetadata(request: Request) {
    return {
      userAgent: request.headers['user-agent'] ?? null,
      ipAddress: request.ip ?? null,
    };
  }

  private getRefreshToken(request: Request): string {
    const token = request.cookies?.[this.refreshCookieName];

    if (typeof token !== 'string' || !token) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    return token;
  }

  private toAuthResponse(result: AuthResult, response: Response) {
    this.setRefreshCookie(response, result.refreshToken);

    return {
      user: result.user,
      accessToken: result.accessToken,
      tokenType: 'Bearer',
    };
  }

  @Public()
  @Throttle(CREDENTIALS_THROTTLE)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.registerUseCase.execute({
      ...dto,
      ...this.getRequestMetadata(request),
    });

    return this.toAuthResponse(result, response);
  }

  @Public()
  @Throttle(CREDENTIALS_THROTTLE)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.loginUseCase.execute({
      ...dto,
      ...this.getRequestMetadata(request),
    });

    return this.toAuthResponse(result, response);
  }

  @Public()
  @Throttle(CREDENTIALS_THROTTLE)
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.googleLoginUseCase.execute({
      idToken: dto.idToken,
      ...this.getRequestMetadata(request),
    });

    return this.toAuthResponse(result, response);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = this.getRefreshToken(request);

    const result = await this.refreshUseCase.execute({
      refreshToken,
      ...this.getRequestMetadata(request),
    });

    return this.toAuthResponse(result, response);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const token = request.cookies?.[this.refreshCookieName];

    if (typeof token === 'string' && token) {
      await this.logoutUseCase.execute({
        refreshToken: token,
      });
    }

    this.clearRefreshCookie(response);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.logoutAllUseCase.execute({
      userId: user.id,
    });

    this.clearRefreshCookie(response);
  }

  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const currentUser = await this.getCurrentUserUseCase.execute(user.id);

    return {
      data: currentUser,
    };
  }

  @Get('sessions')
  async listSessions(@CurrentUser() user: AuthenticatedUser) {
    const sessions = await this.listSessionsUseCase.execute({
      userId: user.id,
      currentSessionId: user.sessionId,
    });

    return {
      data: sessions,
    };
  }

  @Delete('sessions/others')
  @HttpCode(HttpStatus.OK)
  async revokeOtherSessions(@CurrentUser() user: AuthenticatedUser) {
    const revokedCount = await this.revokeOtherSessionsUseCase.execute({
      userId: user.id,
      currentSessionId: user.sessionId,
    });

    return {
      data: {
        revokedCount,
      },
    };
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<void> {
    await this.revokeSessionUseCase.execute({
      userId: user.id,
      sessionId,
    });
  }

  @Post('oauth/google/link')
  @HttpCode(HttpStatus.OK)
  async linkGoogle(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: GoogleLoginDto,
  ) {
    await this.linkGoogleAccountUseCase.execute({
      userId: currentUser.id,
      idToken: dto.idToken,
    });

    return { success: true };
  }

  @Delete('oauth/google/link')
  @HttpCode(HttpStatus.OK)
  async unlinkGoogle(@CurrentUser() currentUser: AuthenticatedUser) {
    await this.unlinkGoogleAccountUseCase.execute(currentUser.id);

    return { success: true };
  }
}
