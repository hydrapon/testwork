import { MigrationInterface, QueryRunner } from "typeorm";

export class createUserTag1662629947187 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE user_tag (
            user_uid uuid NOT NULL,
            tag_id int4 NOT NULL,
            CONSTRAINT user_tag_pkey PRIMARY KEY (user_uid, tag_id),
            CONSTRAINT fk_tg_tag FOREIGN KEY (tag_id) REFERENCES public."tag"(id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT fk_tg_user FOREIGN KEY (user_uid) REFERENCES public."user"(uid) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user_tag`);
    }

}
