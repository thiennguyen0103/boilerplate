import { UsersService } from 'src/modules/users/application/services/users.service';
import { InvalidRefreshTokenError } from 'src/modules/auth/domain/errors/invalid-refresh-token.error';
import { AccessTokenPort } from 'src/modules/auth/application/ports/access-token.port';
import { TokenGeneratorPort } from 'src/modules/auth/application/ports/token-generator.port';
import { RefreshSessionRepositoryPort } from 'src/modules/auth/application/ports/refresh-session.repository.port';
import { AuthResult } from 'src/modules/auth/application/use-cases/auth-result';

export interface RefreshInput {
  refreshToken: string;
  userAgent: string | null;
  ipAddress: string | null;
}

export class RefreshUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessToken: AccessTokenPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly sessions: RefreshSessionRepositoryPort,
    private readonly refreshTokenExpiresInDays: number,
  ) {}

  async execute(input: RefreshInput): Promise<AuthResult> {
    const currentHash = this.tokenGenerator.hash(input.refreshToken);

    const session = await this.sessions.findByTokenHash(currentHash);

    if (!session) {
      const reusedSessionId =
        await this.sessions.findSessionIdByUsedTokenHash(currentHash);

      if (reusedSessionId) {
        const reusedSession = await this.sessions.findById(reusedSessionId);

        if (reusedSession) {
          await this.sessions.revoke(
            reusedSession.id,
            reusedSession.userId,
            new Date(),
          );
        }
      }

      throw new InvalidRefreshTokenError();
    }

    if (!session.isActive) {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.usersService.findById(session.userId);

    if (!user.isActive) {
      await this.sessions.revoke(session.id, user.id, new Date());

      throw new InvalidRefreshTokenError();
    }

    const nextRefreshToken = this.tokenGenerator.generate();
    const now = new Date();

    const rotated = await this.sessions.rotate({
      sessionId: session.id,
      currentTokenHash: currentHash,
      nextTokenHash: this.tokenGenerator.hash(nextRefreshToken),
      nextExpiresAt: new Date(
        now.getTime() + this.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000,
      ),
      rotatedAt: now,
    });

    if (!rotated) {
      // Another request may have rotated the token.
      // Check history to detect token reuse.
      const reusedSessionId =
        await this.sessions.findSessionIdByUsedTokenHash(currentHash);

      if (reusedSessionId) {
        await this.sessions.revoke(reusedSessionId, user.id, now);
      }

      throw new InvalidRefreshTokenError();
    }

    const newAccessToken = await this.accessToken.sign({
      sub: user.id,
      email: user.email.getValue(),
      sessionId: session.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email.getValue(),
        name: user.name.getValue(),
        status: user.status,
        emailVerified: user.emailVerified,
      },
      accessToken: newAccessToken,
      refreshToken: nextRefreshToken,
    };
  }
}
