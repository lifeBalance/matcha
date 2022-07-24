# Refresh Token Rotation
**Refresh tokens** have a long lifetime. If they are valid, clients can use them to obtain new **access tokens** while they're not expired. If for some reason an attacker gets ahold of a user's **refresh token**, he could use it to generate **access tokens** for as long as it doesn't expire.

[Refresh token rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation) is a technique to minimize the effects of a leak of tokens. Using this technique, when a new **access token** is issued to replace an expired one, a **new refresh token** is also returned and the old one is invalidated. This way the attacker cannot use the stolen token anymore, minimizing the impact of the attack.

### Store the Refresh Token in the Database
To support **refresh token rotation**, we can store the **refresh tokens** in the database so that when the `/refresh-token` endpoint receives a request, before issuing a new **access token**, it consults the database to check that the **refresh token** is valid.

> Think of such a table, as a **white-list** of refresh tokens.

If the authorization server doesn't find that **refresh token** in the white list (database table) it immediately invalidates all the refresh and access tokens linked to that user, making her **authenticate** using login credentials again.

> Do not store **refresh tokens** as plain text, but hashed.

This table will have two columns:

* `hashed_tokens`.
* `expires_at`.

> The `expires_at` column can be used as a criteria to delete expired token from the database using some utility script (run as a [cron](https://en.wikipedia.org/wiki/Cron) task for example). This is useful for users that don't log in in a while.

With this table in place, now every time a new refresh token is issued, we'll save it into the database. In the case of requests against the `/refresh-token` endpoint, we'll also have to **delete** the old refresh token from the database.

### Silent Refresh
According to the diagram above, when we try to access a resource in the server with an **expired access token**, the client should be getting an `Invalid token error` (F). Then the client have to make another request to receive a new **access token**, and optionally an updated **refresh token** (G and H). All good, but how do we wire that up in our SPA in practice?

A way to do it is having our front-end code using the aforementioned error to trigger a **request** to a `/refresh-token` **endpoint**. Then, in the backend, and assuming that the received **refresh token** is valid, we should send a **response** with the new **access token**. That request would take place **silently**, without any user intervention.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../../README.md
[back]: ./refresh_tokens.md
[next]: ./storing_tokens_client.md