import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommmentsImagesTables1726899130373 implements MigrationInterface {
    name = 'AddCommmentsImagesTables1726899130373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image-upload"."comments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "content" character varying NOT NULL, "imageId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image-upload"."images" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "url" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "image-upload"."comments" ADD CONSTRAINT "FK_6508f19beedb8e87c3a7d2df579" FOREIGN KEY ("imageId") REFERENCES "image-upload"."images"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image-upload"."comments" DROP CONSTRAINT "FK_6508f19beedb8e87c3a7d2df579"`);
        await queryRunner.query(`DROP TABLE "image-upload"."images"`);
        await queryRunner.query(`DROP TABLE "image-upload"."comments"`);
    }

}
