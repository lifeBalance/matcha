# Authentication: JSON Web Tokens
A common authentication mechanism used in the realm of [SPAs]() are [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) (or JWT for short). This type of authentication goes as follows:

* A user sends a **request**, containing her credentials, to a **log in** endpoint.
* If the credentials are valid, the servers sends back a **response** containing a **JWT**.
* The JWT must be saved **locally**, in the user's browser (more about this later).
* From there on, user's request will include the JWT received when she logged in.

> JWT authentication is an **alternative** to the traditional approach of creating a **session** in the server and returning a **cookie**.

JWT can be described as a [stateless](https://en.wikipedia.org/wiki/Stateless_protocol) authentication mechanism, as the user state is never saved in server memory. The server's protected routes will check for a valid JWT in the Authorization header, and if it's present, the user will be allowed to access protected resources.

> Another common authentication method used by APIs is known as **API key authentication**. Here, the user's send her **API key** on every request; once the request is received, the database is queried to check if the key is valid. Compared to this, JWT authentication eliminates the need to querying the database to validate the user's credentials on every single request (faster app). Only at login the database is queried to validate the credentials.

## What's in a token?
A JWT is simply an encoded string that contains some data to identify the user.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./router.md
[next]: #