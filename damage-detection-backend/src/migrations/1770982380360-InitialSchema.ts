import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770982380360 implements MigrationInterface {
    name = 'InitialSchema1770982380360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "damage_images" ("id" SERIAL NOT NULL, "report_id" integer NOT NULL, "image_url" character varying NOT NULL, "filename" text NOT NULL, "original_name" text NOT NULL, "size" integer NOT NULL, "mimetype" text NOT NULL, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_26a9181ad29fa1c00007fa312e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "analysis_results" ("id" SERIAL NOT NULL, "report_id" integer NOT NULL, "result" character varying NOT NULL, "confidence" numeric(5,2) NOT NULL, "raw_response" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_56560e3511c57e1db64a3ad93eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."damage_reports_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'MANUAL')`);
        await queryRunner.query(`CREATE TABLE "damage_reports" ("id" SERIAL NOT NULL, "item_sku" character varying NOT NULL, "item_Id" character varying NOT NULL, "created_by_id" character varying NOT NULL, "created_by_email" character varying NOT NULL, "created_by_name" character varying, "status" "public"."damage_reports_status_enum" NOT NULL DEFAULT 'PENDING', "final_confidence" numeric(5,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1d02d4d7469c3730588fe0339f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "damage_images" ADD CONSTRAINT "FK_a420633ac777aae2e4f4a337bcf" FOREIGN KEY ("report_id") REFERENCES "damage_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "analysis_results" ADD CONSTRAINT "FK_4e688a99714d0eb764a396c329d" FOREIGN KEY ("report_id") REFERENCES "damage_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "analysis_results" DROP CONSTRAINT "FK_4e688a99714d0eb764a396c329d"`);
        await queryRunner.query(`ALTER TABLE "damage_images" DROP CONSTRAINT "FK_a420633ac777aae2e4f4a337bcf"`);
        await queryRunner.query(`DROP TABLE "damage_reports"`);
        await queryRunner.query(`DROP TYPE "public"."damage_reports_status_enum"`);
        await queryRunner.query(`DROP TABLE "analysis_results"`);
        await queryRunner.query(`DROP TABLE "damage_images"`);
    }

}
