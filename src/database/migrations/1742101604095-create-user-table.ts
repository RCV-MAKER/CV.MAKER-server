import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1742101604095 implements MigrationInterface {
  name = 'CreateUserTable1742101604095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "username" character varying NOT NULL,
        "name" character varying,
        "avatar" character varying,
        "password" character varying NOT NULL,
        "role_id" uuid DEFAULT null,
        "is_active" boolean NOT NULL DEFAULT true,
        "is_confirmed" boolean default null,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT null,
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_user_email" ON "user" ("email")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_user_username" ON "user" ("username")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "user"
      ADD CONSTRAINT "FK_user_role" FOREIGN KEY ("role_id")
      REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "UQ_user_email"
    `);

    await queryRunner.query(`
      DROP INDEX "UQ_user_username"
    `);

    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_user_role"`,
    );

    await queryRunner.query(`
      DROP TABLE "user"
    `);
  }
}
