alter table "public"."image" add foreign key ("id") references "public"."resource"("name") on update cascade on delete cascade;
