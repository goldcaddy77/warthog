import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserModel1562027331912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "first_name" character varying(30) NOT NULL, "last_name" character varying(50) NOT NULL, "string_enum_field" character varying NOT NULL, "email" character varying NOT NULL, "nick_name" character varying(30), "private_field" character varying, "json_field" jsonb, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_8b0d982b1bfea7d0518840535b2" UNIQUE ("first_name", "string_enum_field"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
