CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "auth0_id" varchar UNIQUE,
  "full_name" varchar,
  "created_at" timestamp
);

ALTER TABLE "user" ADD CONSTRAINT user_auth0_id_unique UNIQUE (auth0_id);

CREATE TABLE "store" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "created_at" timestamp
);

CREATE TABLE "vendor" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "store_id" int,
  "created_at" timestamp
);

ALTER TABLE "vendor" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "vendor" ADD FOREIGN KEY ("store_id") REFERENCES "store" ("id");

CREATE TABLE "listing" (
  "id" SERIAL PRIMARY KEY,
  "store_id" int,
  "name" varchar,
  "sold" boolean,
  "price" integer,
  "created_at" timestamp,
  "sold_at" timestamp
);

ALTER TABLE "listing" ADD FOREIGN KEY ("store_id") REFERENCES "store" ("id");

CREATE TABLE "label" (
  "id" SERIAL PRIMARY KEY,
  "listing_id" int,
  "tag_id" int
);

ALTER TABLE "label" ADD FOREIGN KEY ("listing_id") REFERENCES "listing" ("id");

CREATE TABLE "tag" (
  "id" SERIAL PRIMARY KEY,
  "store_id" int,
  "name" varchar
);

ALTER TABLE "tag" ADD FOREIGN KEY ("store_id") REFERENCES "store" ("id");

ALTER TABLE "label" ADD FOREIGN KEY ("tag_id") REFERENCES "tag" ("id");

