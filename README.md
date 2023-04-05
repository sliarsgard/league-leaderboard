## Setup

1. Run ```npm install```
2. Add ```.env``` to the root of the project and fill with the nessecary environment variables
3. Run ```npx supabase start``` to start the local db
4. Run ```npm run dev```

## Branches

- ```main``` is automaticly deployed to the netlify production site ```avetint.com``` when a change is pushed to github.

- ```dev``` is automaticly deployed to the netlify test site when a change is pushed to github

When changes are made, make a pull request to ```dev```. When the PR is merged, test it on ```dev.avetint.com```.

## Database
To make changes to the database you can either:
1. run ```npx supabase db new [insert-name-of-change]```
which will create an sql file that you can write your changes in. This will automaticly change the ```dev``` and ```test``` db when pushed to netlify.
2. change the database using the local supabase instance and then run ```npx supabase db diff -f [insert-name-of-change]``` which will create the sql file with the changes you've made.