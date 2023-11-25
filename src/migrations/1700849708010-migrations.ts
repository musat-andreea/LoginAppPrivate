import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUsersTable1700849708010 implements MigrationInterface {
    name = 'CreateUsersTable1700849708010';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "email" character varying(255) NOT NULL UNIQUE,
                "name" character varying(255) NOT NULL,
                "location" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "updateAt" TIMESTAMP NOT NULL DEFAULT now()
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user";
        `);
    }

}
