alter table "public"."listing" drop constraint "listing_store_id_fkey",
          add constraint "listing_store_id_fkey"
          foreign key ("store_id")
          references "public"."store"
          ("id")
          on update no action
          on delete no action;
