alter table "public"."player_game_data" add column "date" timestamp with time zone;

alter table "public"."player_game_data" add column "win" boolean;

alter table "public"."players" drop column "l";

alter table "public"."players" drop column "w";

alter table "public"."players" add column "losses" numeric not null default '0'::numeric;

alter table "public"."players" add column "wins" numeric not null default '0'::numeric;


