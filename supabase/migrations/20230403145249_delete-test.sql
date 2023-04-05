alter table "public"."test" drop constraint "test_pkey";

drop index if exists "public"."test_pkey";

drop table "public"."test";



