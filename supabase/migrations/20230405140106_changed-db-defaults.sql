alter table "public"."games" alter column "created_at" set not null;

alter table "public"."player_game_data" drop column "created_at";

alter table "public"."player_game_data" alter column "assists" drop default;

alter table "public"."player_game_data" alter column "deaths" drop default;

alter table "public"."player_game_data" alter column "kills" drop default;

alter table "public"."player_game_data" alter column "win" set not null;


