alter table "public"."games" drop column "blue_team";

alter table "public"."games" alter column "bans_red" set not null;

alter table "public"."player_game_data" drop column "blue_team";

alter table "public"."player_game_data" drop column "date";

alter table "public"."player_game_data" add column "team" text not null;


