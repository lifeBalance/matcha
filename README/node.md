# Node
In order to seed the database, I chose to install a package named [knex](https://knexjs.org/) inside the container. Seeding the database is a one-time operation, which I had to run once the Docker services were up. That's easily achievable running, we just have to use the Docker api to execute commands in running containers, in this case, the container I'm interested is named `api` so:
```
docker compose exec api knex seed:run --knexfile src/db/knexfile.js
```

> Note that to run the command above, I had to install `knex` **globally** in the container (check the `docker/nodejs/Dockerfile` to see how I did that)

I also had to specify the path to my `knexfile.js` using the `--knexfile` option.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: ./restful.md