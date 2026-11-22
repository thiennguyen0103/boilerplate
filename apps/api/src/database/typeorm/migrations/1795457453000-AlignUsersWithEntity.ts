import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignUsersWithEntity1795457453000 implements MigrationInterface {
  name = 'AlignUsersWithEntity1795457453000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'BANNED')`,
    );

    await queryRunner.query(`
      ALTER TABLE "users"
        ADD "password_hash" character varying(255),
        ADD "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE',
        ADD "email_verified" boolean NOT NULL DEFAULT false,
        ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
        ALTER COLUMN "email" TYPE character varying(254),
        ALTER COLUMN "name" TYPE character varying(100)
    `);

    await queryRunner.query(
      `ALTER TABLE "users" RENAME CONSTRAINT "users_email_key" TO "UQ_97672ac88f789774dd47f7c8be3"`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" TO "users_email_key"`,
    );

    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "name" TYPE character varying(120),
        ALTER COLUMN "email" TYPE character varying(320),
        ALTER COLUMN "id" DROP DEFAULT,
        DROP COLUMN "updated_at",
        DROP COLUMN "email_verified",
        DROP COLUMN "status",
        DROP COLUMN "password_hash"
    `);

    await queryRunner.query('DROP TYPE "public"."users_status_enum"');
  }
}
