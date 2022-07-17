# App Setup
Once we have our router working, every time we want to set up an API endpoint, we'll need to define a route for it. We could totally do that in the [front controller](https://en.wikipedia.org/wiki/Front_controller) (`public/index.php`), but a better option would be to create a dedicated file to place all our routes. Question is: where do we place this file? Check it out:
```
www/
    app/
        config/
            routes.php
```

## The `config` folder
I took the chance to create a dedicated folder (`config`) to group files that are used to contain settings, scripts to set up the database, globals, etc. This is how it looks so far:
```
config/
    bootstrap.php
    db_setup.php
    db_setup.sql
    routes.php
    settings.php
```

### The Bootstrap script
The `bootstrap.php` script can be used as a sort of entry point for our application. It will be required in our **front controller** and it can be used for:

* Define settings that will be used globally by our app (require the `settings.php` file).
* Other stuff like for example setting [strict typing](https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict) across all our application.

> Check the files in the `config` folder; almost everything is self-explanatory.

### Database setup
Then we have two scripts for setting up the database:

* `db_setup.sql`, which contains [SQL](https://en.wikipedia.org/wiki/SQL) statements to create the `matcha` database, tables, some mockup data, etc...
* `db_setup.php`, which contains a really short script with a function to set up the database with the statements of the file above.

## The Settings file
The `settings.php` file contains a bunch of **constants** defined with the [define](https://www.php.net/manual/en/function.define) statement.

## A Database static class
This time I decided to create a class named `Database` to handle the database connection. This class contains:

* A [static](https://www.php.net/manual/en/language.oop5.static.php) **property** named `conn`.
* A `static` **method** named `connect`.

The main goal is to create a database connection only if one doesn't exist already. The way to use this method in any model is:
```php
$conn = Database::connect();
```

I considered that the place for the `Database.php` file is under `app/core`, next to our `Router.php`.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./router.md
[next]: ./jwt.md