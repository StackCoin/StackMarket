alter table "public"."image"
           add constraint "image_id_fkey"
           foreign key ("id")
           references "public"."resource"
           ("name") on update cascade on delete cascade;
