import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTables1795457454000 implements MigrationInterface {
  name = 'CreateAuthTables1795457454000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "refresh_sessions" (
        "id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "token_hash" character varying(64) NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revoked_at" TIMESTAMP WITH TIME ZONE,
        "last_used_at" TIMESTAMP WITH TIME ZONE,
        "user_agent" text,
        "ip_address" character varying(45),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_9190032f6967b7971dca07d69f3" PRIMARY KEY ("id"),
        CONSTRAINT "FK_a7ab4fd82c654c85b9de53d971a" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_sessions_user_id" ON "refresh_sessions" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_refresh_sessions_token_hash" ON "refresh_sessions" ("token_hash")`,
    );

    await queryRunner.query(`
      CREATE TABLE "refresh_token_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "session_id" uuid NOT NULL,
        "token_hash" character varying(64) NOT NULL,
        "used_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_11388536cc776cad0cf74e55fbf" PRIMARY KEY ("id"),
        CONSTRAINT "FK_29ecee1b26f62bfd91bf7228ca6" FOREIGN KEY ("session_id")
          REFERENCES "refresh_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_token_history_session_id" ON "refresh_token_history" ("session_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_refresh_token_history_hash" ON "refresh_token_history" ("token_hash")`,
    );

    await queryRunner.query(`
      CREATE TABLE "oauth_accounts" (
        "id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "provider" character varying(30) NOT NULL,
        "provider_subject" character varying(255) NOT NULL,
        "email" character varying(255),
        "email_verified" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_710a81523f515b78f894e33bb10" PRIMARY KEY ("id"),
        CONSTRAINT "FK_22a05e92f51a983475f9281d3b0" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_oauth_accounts_user_id" ON "oauth_accounts" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_oauth_user_provider" ON "oauth_accounts" ("user_id", "provider")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_oauth_provider_subject" ON "oauth_accounts" ("provider", "provider_subject")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "oauth_accounts"');
    await queryRunner.query('DROP TABLE "refresh_token_history"');
    await queryRunner.query('DROP TABLE "refresh_sessions"');
  }
}
