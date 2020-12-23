alter table "public"."listing_resource" drop constraint "listing_resource_listing_id_fkey",
             add constraint "listing_resource_listing_id_fkey"
             foreign key ("listing_id")
             references "public"."listing"
             ("id") on update cascade on delete cascade;
