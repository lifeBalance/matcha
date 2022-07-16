# A RESTful API
<div>
<p style="float: left; padding-right: 2em; height: 10em"><img src="./images/soap.jpeg" /></p>

There are a couple of different approaches when building a web API:

* [REST](https://en.wikipedia.org/wiki/Representational_state_transfer), which is the main choice for SPAs, and the one that we'll follow, as the good [RESTafarians](https://en.wiktionary.org/wiki/RESTafarian) we are.
* [SOAP](https://en.wikipedia.org/wiki/SOAP), which uses [XML](https://en.wikipedia.org/wiki/XML) for the payloads and [XML validation](https://en.wikipedia.org/wiki/XML_validation) to ensure structural message integrity.
</div>

A **RESTful API** is a web API compliant with the REST architectural style (REST is an acronym of **REpresentational State Transfer**). Requests against REST APIs are made via [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol), using some of the the [HTTP request methods](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). There are a bunch of such methods, but RESTful APIs only need to use 4 of them:

<p style="float: left; padding-right: 2em ; height: 10em"><img src="./images/restafarian.jpeg" /></p>

* `PUT` to **create** a resource.
* `GET` to **read** a resource.
* `PUT` to **update** a resource.
* `DELETE` to **delete** a resource.

## CRUD
These small set of basic operations (known as [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) are enough to interact with the data stored in the server. Even though this data can be stored in simple text files, [document databases](https://en.wikipedia.org/wiki/Object_database), etc, when using a [relational database](https://en.wikipedia.org/wiki/Relational_database), each of the letters in the CRUD acronym maps to an [SQL](https://en.wikipedia.org/wiki/SQL) operation:

* **Create** maps to the [INSERT](https://en.wikipedia.org/wiki/Insert_(SQL)) statement.
* **Read** maps to [SELECT](https://en.wikipedia.org/wiki/Select_(SQL)).
* **Update** to [UPDATE](https://en.wikipedia.org/wiki/Update_(SQL)).
* **Delete** to [DELETE](https://en.wikipedia.org/wiki/Delete_(SQL)).

<p style="float: left; padding-right: 2em"><img src="./images/crud.jpeg" height="250" /></p>

We'll be using a [MySQL](https://www.mysql.com/) database, so keeping the mapping above in mind will be essential. A RESTful request is made by combining one of the HTTP methods with a given URL. For example, let's say we want to **read** all of the recipes in a cooking website, we'll made a `GET` request against the `/recipes` URL, and in the backend a `SELECT` statement would pull up all the recipes from the database and send them to the client. But what if we want to **create** a new recipe of our own? Then we'll made a `POST` request against the same URL (`/recipes`), which in the backend will trigger an `INSERT` operation in the database to create a new recipe.

> Note that the URLs mentioned above are the same; it's the combination of the URL with the HTTP method what determines what action is carried out in the backend.

In RESTful APIs, a **resource** is a noun that is usually stored in the backend in a table with the same name, for example `recipes`. Each resource (recipe in this case) is identified by a unique name or number, so if we wanted to let's say **update** one of our recipes, we'd make a request against `/recipes/69` using the `PUT` method (`PATCH` can also be used for this). And if we wanted to **delete** such recipe, we'd use the `DELETE` HTTP method against the same URL.

|   Endpoint    | HTTP method | CRUD action |
| ------------- | ----------- | ----------- |
| `/recipes/69` | `GET`       | **Read**    |
| `/recipes/69` | `PUT`       | **Update**  |
| `/recipes/69` | `DELETE`    | **Delete**  |

> As you may have infered from the table above, the **endpoint** is the same; it's the HTTP method used what determines what CRUD action is taken in the database. 

That's what a RESTful API is in a nutshel. Using the aforementioned combination of HTTP methods and URLs, we can accomplish a lot. To interact with a given backend **resource** we need just two URLs:

* One for all the database rows, `/recipes` for example.
* Another ne for single database rows, `/recipes/69`.

The **HTTP method** being used would determine the **action** to take against the given **resource/s**, determined by the **URL**.

> Using REST we only need to maintain a few **endpoints** (URLs) for manipulating data on a server.

Below there's a complete table to summarize actions against the `recipes` resource in the backend:

|        Action         | HTTP Method |      Url      |
| --------------------- | ----------- | ------------- |
| **Create**            | `POST`      | `/recipes`    |
| **Read** (one)        | `GET`       | `/recipes/id` |
| **Read** (collection) | `GET`       | `/recipes`    |
| **Update**            | `POST`      | `/recipes/id` |
| **Delete**            | `DELETE`    | `/recipes/id` |

Note that for both the **create** and **update** actions we can use also `POST`, since `PUT` or `PATCH` are not as well supported in some languages (PHP for example).

<p align="center"><img src="./images/RESTful.png" height="250" /></p>

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./docker.md
[next]: ./router.md