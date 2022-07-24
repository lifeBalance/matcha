# JSON Web Tokens
A common authentication/authorization mechanism used in the realm of [SPAs](https://en.wikipedia.org/wiki/Single-page_application) are [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) (or JWT for short).

> JWT authentication is an **alternative** to the traditional approach of creating a [session](https://en.wikipedia.org/wiki/Session_(computer_science)) in the server and setting a **cookie** in the client with the session id.

JWT can be described as a [stateless](https://en.wikipedia.org/wiki/Stateless_protocol) authentication mechanism, as the user state is never saved in server memory. The server's protected routes will check for a valid JWT in the **request** [Authorization request header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization), and if it's present, the user will be allowed to access protected resources.

> Another common authentication method used by APIs is known as **API key authentication**. Here, the user's send her **API key** on every request; once the request is received, the database is queried to authenticate the key.

Compared to **API key authentication**, JWT authentication eliminates the need for querying the database on every single request (faster app). Only at login the database is queried to authenticate the credentials.

* [Basic Flow](./jwt/basic_flow.md)
* [Cooking Tokens](./jwt/cooking_tokens.md)
* [Refresh Tokens and Access Tokens](./jwt/refresh_tokens.md)
* [Token Rotation](./jwt/token_rotation.md)
* [Storing Tokens (client side)](./jwt/storing_tokens_client.md)
* [Authorizing Access (server side)](./jwt/authorize_access.md)
* [Logout](./jwt/logout.md)
* [Cleaning the Database](./jwt/db_cleaning.md)

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./setup.md
[next]: ./jwt/basic_flow.md