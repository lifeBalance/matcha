# Docker
For this project we'll mount our **webroot** as a [volume](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes) named `www`. Inside this folder we'll have two subfolders:
```
www/
    app/
    public/
        index.php
```

* `app` is where we'll put our source code.
* `public` is what we'll be serving to the user.

## Setting the `DocumentRoot`
The **document root** is the top-level directory that will be visible from the web. By default is in `/var/www/html` (which we've mounted as a volume in `www`), but we want to move it to the `public` folder. In order to do that we have to set the value of the [DocumentRoot](https://httpd.apache.org/docs/2.4/mod/core.html#documentroot) directive.

> The situation right now is that when we point our browser to `localhost`, we see a `Forbidden` error due to the lack of an `index` file at the `DocumentRoot`. Our `index.php` is inside a folder named `public`. > If we point our browser to `public/index.php`, we'll see the `Hello world` message, but that's not what we want.

To see the current value of the `DocumentRoot` directive we can attach a shell to the running container and `grep` the contents of the default virtual host configuration:
```
# grep -i documentroot /etc/apache2/sites-available/000-default.conf 
        DocumentRoot /var/www/html
```

We could edit this [virtual host](https://httpd.apache.org/docs/2.4/vhosts/index.html) file changing the value of the `DocumentRoot` to whatever we wanted to. But using [Docker](https://docs.docker.com/compose/) we just have to set up an [environment variable](https://docs.docker.com/compose/environment-variables/) in our [compose.yaml](https://docs.docker.com/compose/compose-file/) file with the value of the `DocumentRoot` we want, in this case:
```
environment:
    APACHE_DOCUMENT_ROOT: /var/www/html/public
```

These are the steps:

1. Copy the `000-default.conf` file to our **host system**:
```
docker cp dc87:/etc/apache2/sites-available/000-default.conf ./docker/php_apache/000-default.conf
```

2. Edit the value of the `DocumentRoot` directive in our copy of the file:
```
DocumentRoot ${APACHE_DOCUMENT_ROOT}
```

3. Mount the copy as a Docker volume in our `compose.yml`:
```
volumes:
    - ./docker/php_apache/000-default.conf:/etc/apache2/sites-available/000-default.conf
```

4. Restart Docker compose:
```
docker compose restart
```

## Installing Composer
For this project using [Composer](https://getcomposer.org/) was allowed, so one of the things I did wast to add it in a separate container in my `compose.yml` file.

> Yes, a bit confusing: [Composer](https://getcomposer.org/) is a dependency manager for PHP, and `compose.yl` is the name of the file that [Docker compose](https://docs.docker.com/compose/) (🤦🏻‍♂️) uses to do its thing.

I installed mostly for its handy [autoloader](https://getcomposer.org/doc/articles/autoloader-optimization.md).

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./docker.md
[next]: ./router.md