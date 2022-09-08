import { MigrationInterface, QueryRunner } from "typeorm";

export class createUser1662629920489 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "user" (
            "uid" UUID NOT NULL,
            "email" VARCHAR(100) NOT NULL,
            "password" VARCHAR(100) NOT NULL,
            "nickname" VARCHAR(30) NOT NULL,
            PRIMARY KEY ("uid"),
            CONSTRAINT "uni_m_uid" UNIQUE ("uid"),
            CONSTRAINT "uni_m_email" UNIQUE ("email"),
            CONSTRAINT "uni_m_nickname" UNIQUE ("nickname")
        )
    `);
        await queryRunner.query(`CREATE UNIQUE INDEX "uni_user_email" ON users(email)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user`);
    }

}
