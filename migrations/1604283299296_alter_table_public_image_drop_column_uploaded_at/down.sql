ALTER TABLE "public"."image" ADD COLUMN "uploaded_at" date;
ALTER TABLE "public"."image" ALTER COLUMN "uploaded_at" DROP NOT NULL;
ALTER TABLE "public"."image" ALTER COLUMN "uploaded_at" SET DEFAULT now();
