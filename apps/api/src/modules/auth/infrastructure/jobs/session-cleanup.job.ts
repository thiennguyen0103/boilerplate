import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RefreshSessionRepositoryPort } from 'src/modules/auth/application/ports/refresh-session.repository.port';
import { AUTH_TOKENS } from 'src/modules/auth/auth.tokens';

@Injectable()
export class SessionCleanupJob {
  private readonly logger = new Logger(SessionCleanupJob.name);

  constructor(
    @Inject(AUTH_TOKENS.REFRESH_SESSION_REPOSITORY)
    private readonly sessions: RefreshSessionRepositoryPort,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanup(): Promise<void> {
    const deleted = await this.sessions.deleteExpired(new Date());

    this.logger.log(`Deleted ${deleted} expired refresh sessions`);
  }
}
