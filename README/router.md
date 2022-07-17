# The Router
First order of (:monkey:) business is to write a custom router for our app. For [camagru](https://github.com/lifeBalance/camagru) I wrote a very simple one, that loaded the proper classes automatically according to the request. This time I wanted to change some things.

* We won't be using [pretty urls](https://en.wikipedia.org/wiki/Clean_URL) because we may be using the [query string](https://en.wikipedia.org/wiki/Query_string) for things like pagination.
* I want it to be able to call class methods depending on HTTP methods used in the **request**.
* It should be able to handle **routes** added **manually**, in a routes file.

The interface available in a router instance is comprised of the following **public** methods:

* `getRoutes`, a public method that returns the array that contains all the routes we've added.
* `add`, which as its name implies, it's used for adding routes to be handled. A route is added like this:
```php
$app->add('/api/tests', ['GET', 'POST', 'DELETE'], 'Test');
```

 * The first argument is the **API endpoint**.
 * Then an array with the HTTP verbs that we'll handle for requests to the endpoint.
 * Finally, the name of the **controller** to handle the request.

* The `run` public method does the following:

    * Call the **private** `parseUrl` method to piece apart the request URI. It also stores the `id` of the resource and the query string in an array named `args`.
    * Call the `match` **private** method, which takes care of making sure that the **endpoint** exists, and that the HTTP method used is in the list we want to handle.
    * Finally, a **private** method named `restDispatcher` will call a controller method depending on the HTTP method used, and if the request included a **resource id**.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./restful.md
[next]: ./setup.md