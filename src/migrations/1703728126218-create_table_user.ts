import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1703728126218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.users (
                id serial4 NOT NULL,
                created timestamp NOT NULL,
                modified timestamp NOT NULL,
                "name" varchar NOT NULL,
                email varchar NOT NULL,
                phone varchar NOT NULL,
                "password" varchar NOT NULL,
                "profileId" int4 NOT NULL,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE public.users;
    `);
  }
}
