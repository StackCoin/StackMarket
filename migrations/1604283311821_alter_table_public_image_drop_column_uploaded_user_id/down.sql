ALTER TABLE "public"."image" ADD COLUMN "uploaded_user_id" int4;
ALTER TABLE "public"."image" ALTER COLUMN "uploaded_user_id" DROP NOT NULL;
ALTER TABLE "public"."image" ADD CONSTRAINT image_uploaded_user_id_fkey FOREIGN KEY (uploaded_user_id) REFERENCES "public"."user" (id) ON DELETE restrict ON UPDATE restrict;
