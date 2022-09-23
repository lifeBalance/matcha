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

> The situation right now is that when we point our browser to `localhost`, we see a `Forbidden` error due to the lack of an `index` file at the `DocumentRoot`. Our `index.php` is nested inside a folder named `public` (If we point our browser to `public/index.php`, we'll see the `Hello world` message, but that's not what we want).

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

Now, instead of editing the file inside the container, this is what we'll do:

1. Copy the `000-default.conf` file to our **host system**, using the [docker cp](https://docs.docker.com/engine/reference/commandline/cp/) command:
```
docker cp dc87:/etc/apache2/sites-available/000-default.conf ./docker/php_apache/000-default.conf
```

2. Edit the value of the `DocumentRoot` directive in the copy of the file that now resides in our **host**:
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
For this project using [Composer](https://getcomposer.org/) was allowed, so one of the things I did was adding it in a separate container (check the `composer` service in the `compose.yml` file).

> Yes, a bit confusing: [Composer](https://getcomposer.org/) is a dependency manager for PHP, and `compose.yml` is the name of the file that [Docker compose](https://docs.docker.com/compose/) (🤦🏻‍♂️) uses to do its thing.

I installed mostly for its handy [autoloader](https://getcomposer.org/doc/articles/autoloader-optimization.md).

![Composer](./images/composer.png "Composer")

### Installing packages, autoloading classes
At the very beginning, I only needed **Composer** for generating [classmaps](https://getcomposer.org/doc/04-schema.md#classmap), so that I could have available classes globally, by requiring the resulting `vendor/composer/autoload_classmap.php` file. I decided to add **Composer** as a [Docker service](https://docs.docker.com/engine/reference/commandline/service/) in my [compose.yaml](https://docs.docker.com/compose/compose-file/) file; this was the configuration I was using:

```yml
composer:
    image: composer:2.3.9
    command: ['composer', 'dump-autoload']
    volumes:
      - ./www/app:/app
```

> That way, I just had to add classes to the `composer.json` file, and restart the container with `docker compose restart composer`.

Then I needed to install [PHPMailer](https://github.com/PHPMailer/PHPMailer) and rewrote my service as:
```yml
  composer:
    image: composer:2.4
    container_name: composer
    command:
      - /bin/sh
      - -c
      - |
      - composer dump-autoload
      - composer update
    volumes:
      - ./www/app:/app
```

Then I realized, that having **Composer** as a **service** was pointless. The intended way to use the container is to run it whenever the contents of `composer.json` changed, which could be easily done with:
```
docker run --rm --interactive --tty --volume $PWD/www/app:/app composer update
```

> Above I'm running the command `composer update` in the container, which gets the packages I added to the `composer.json` file, installed (for example, the files containing the PHPMailer classes in our project filesystem).

## Sending Mail
As we just mentioned, to send email we chose [PHPMailer](https://github.com/PHPMailer/PHPMailer), which is quite popular in the PHP community. In order not to commit the email address and password used to send email, 
I defined two environment variables in my `compose.yaml`:
```yaml
  MAIL_FROM: ${MAIL_FROM}
  MAIL_PWD: ${MAIL_PWD}
```

The values of these variables are used in the `app/config/settings.php` to define PHP [named constants](https://www.php.net/manual/en/function.define), whose values are used in the `Mailer.php` class.

> **Important**: I hardcoded the value `smtp.gmail.com` for the `Host` in `Mailer.php`. Remember to change it, or better set it as another **environment variable** if you change email provider.

Needless to say, before running `docker compose up` we gotta make sure we exported the aforementioned **environment variables** in our shell.

> **Important**: make sure you you run `docker compose up`, if you just use `docker compose restart` from another terminal tab, you're restarting the containers in the other tab, where the **environment variables** are not set.
---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: ./restful.md