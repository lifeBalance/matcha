# Node
In order to seed the database, I chose to install a package named [knex](https://knexjs.org/) inside the container. Seeding the database is a one-time operation, which I had to run once the Docker services were up. That's easily achievable running, we just have to use the Docker api to execute commands in running containers, in this case, the container I'm interested is named `api` so:
```
docker compose exec api knex seed:run --knexfile src/db/knexfile.js
```

> Note that to run the command above, I had to install `knex` **globally** in the container (check the `docker/nodejs/Dockerfile` to see how I did that)

I also had to specify the path to my `knexfile.js` using the `--knexfile` option.

## MySQL
Something I noticed during development was that the database content was erased everytime I ran `docker compose down`. There are two alternative solutions to that:

1. Mount the data as a volume in our `compose.yaml` file.
2. Run `docker compose stop` (and not `down`) whenever you want to **stop** the container.

Probably the better solution was number **2**, but after forgetting a couple of times about it (and nuking my DB with plenty of fake data), I decided to mount it as a volume.

## Nodemon
Another issue I was experiencing was that [nodemon](https://nodemon.io/) had to be installed in my **host** in order to use `command: npm run dev` in my Docker compose. The way around that was to install it inside the container (using the `Dockerfile`) and mount the `node_modules` folder as an [anonymous volume](https://docs.docker.com/storage/volumes/), provide only the **destination** folder path as compared to the bind volume where we specify `source:destination` folder path.

The reason for that is that when our NodeJS application starts, we end up overriding `node_modules` folder if we mount it as a normal bind volume.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: ./restful.md