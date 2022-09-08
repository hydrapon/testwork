import { MigrationInterface, QueryRunner } from "typeorm";

export class createTag1662629936971 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "tag" (
            "id" SERIAL NOT NULL,
            "creator" uuid,
            "name" VARCHAR(40) NOT NULL,
            "sortOrder" INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY ("id"),
            CONSTRAINT "uni_m_id" UNIQUE ("id")
        )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE tag`);
    }

}
