alter table "public"."listing_image"
           add constraint "listing_image_listing_id_fkey"
           foreign key ("listing_id")
           references "public"."listing"
           ("id") on update restrict on delete restrict;
