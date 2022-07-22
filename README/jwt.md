# JSON Web Tokens
A common authentication/authorization mechanism used in the realm of [SPAs](https://en.wikipedia.org/wiki/Single-page_application) are [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) (or JWT for short). The basic flow of the thing goes likes this:

* A user sends a **request**, containing her credentials, to a **log in** endpoint (authentication).
* If the credentials are valid, the servers sends back a **response** containing a **JWT**.
* The JWT must be saved **locally**, in the user's browser (more about this later).
* From there on, the user's **requests** will include the JWT received when she logged in. Decoding this token (in the backend) on each request, it's what will **authorize** the user access to resources (no need to maintain [sessions](https://en.wikipedia.org/wiki/Session_(computer_science))).

> JWT authentication is an **alternative** to the traditional approach of creating a **session** in the server and setting a **cookie** with the session id.

JWT can be described as a [stateless](https://en.wikipedia.org/wiki/Stateless_protocol) authentication mechanism, as the user state is never saved in server memory. The server's protected routes will check for a valid JWT in the Authorization header, and if it's present, the user will be allowed to access protected resources.

> Another common authentication method used by APIs is known as **API key authentication**. Here, the user's send her **API key** on every request; once the request is received, the database is queried to check if the key is valid.

Compared to **API key authentication**, JWT authentication eliminates the need for querying the database on every single request (faster app). Only at login the database is queried to validate the credentials.

## Authentication vs Authorization
Authentication and authorization are popular terms in modern computer systems that often confuse people. Both of these terms are related to security; often, people think about them (and even use them) interchangeably. However, they have different meanings and applications.

* [Authorization](https://en.wikipedia.org/wiki/Authorization) consists in specifying access rights/privileges to resources available to certain users or devices. A real life example would be having a ticket to attend an event, such as a movie. Having the ticket authorize us to enter the movie theater to watch the movie.

* [Authentication](https://en.wikipedia.org/wiki/Authentication) is the process of confirming the identity of a user or a device. A real life example of authentication would be showing our passport or other id to the woman in the bank.

> Another example would be taking a flight somewhere. Once at the airport, we have to show our **passport** (authentication) in order to get a **boarding pass** (authorization) that gives us access to the plane.

## What's in a token?
Once an authentication **request** has been validated, we can generate a **token** and return it as a **response**. A JWT (from now on, we'll refer to it simply as token) is simply a long string of text that contains some data to identify the user. For example:
```
xxxxxx.yyyyyy.zzzzzz
```

Above we've simplified quite a bit what a token would look like, but if you pay attention, there are three segments separated by two dots:

1. **Header**: typically consists of two parts:

    * `typ`: The **type of the token**, which is JWT.
    * `alg`: The **signing algorithm** being used, such as [HMAC](https://en.wikipedia.org/wiki/HMAC), [SHA256](https://en.wikipedia.org/wiki/SHA-2) or [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)).

2. **Payload**: which contains statements (known as [claims](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1)) about an entity (typically, the user) and additional data.

3. **Signature**: which is made as follows:

    1. Encode the **header** as a [base64url](https://en.wikipedia.org/wiki/Base64#URL_applications) string.
    2. Encode the **payload** as a **base64url** string.
    3. Concatenate the two strings above, separated by a simple period (`.`).
    4. The resulting string is [hashed](https://en.wikipedia.org/wiki/Cryptographic_hash_function) using the algorithm specified in the header (`alg`). A good idea here is to use a **private key** (aka **secret key**) for the encrypting (hashing) process. This key can be **optionally** encoded in **base64** (not base64url).
    5. Finally, the hashed string is also encoded as a **base64url** string, and appended to the previous two strings using a period.

The image below contains a representation of a token:

<img src="./images/jwt.png" width="60%" />

## Cooking a token in PHP
If all we explained above sounds too complicated, in this section we'll get our hands dirty building our own JWT using handy PHP functions. All three JWT components must be encoded in [base64url](https://en.wikipedia.org/wiki/Base64#URL_applications) string, which is basically a **base64** string, but we have to manually convert the following three characters:

| Base64 |    Base64url     |
| ------ | ---------------- |
| `+`    | `-` (dash)       |
| `/`    | `_` (underscore) |
| `=`    | (removed)        |


So let's write a handy function for encoding in **base64url**:
```php
function base64urlEncode($str) {
    return str_replace (
        ['+', '/', '-'],
        ['-', '_', ''],
        base64_encode($str));
}
```

With this function we can easily encode the header and the payload:
```php
$header = base64urlEncode(json_encode([
    'alg' => 'HS256',
    'typ' => 'JWT'
]));

$payload = base64urlEncode(json_encode([
    'sub'   => '69',
    'email' => 'bob@gmail.com'
]));

$header = base64urlEncode($header);
$payload = base64urlEncode($payload);
```

In the code above we are encoding the header and payload as JSON strings before encoding them in [base64url](https://en.wikipedia.org/wiki/Base64#URL_applications). For the payload [claims](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims) we kept it simple, but it's worth mentioning here that using sensitive data here is not a good practice since the **payload** is just base64url **encoded** but **not encrypted** (if someone gets ahold of the token, it's easy to decode the token and gain access to that sensitive intel).

> Both `sub` (used for the **user id**) and `email` are **reserved claims** described in the [JWT standard](https://www.iana.org/assignments/jwt/jwt.xhtml#claims).

### The Signature
For the signature we're gonna be using the algorithm that we set in the header, **HS256** which is [HMAC](https://en.wikipedia.org/wiki/HMAC) with [SHA-256](https://en.wikipedia.org/wiki/SHA-2). This is a a symmetric **keyed** hashing algorithm, so we're gonna need to create a key. That could easily get done using any of the onlines **encryption key generator** such as https://www.allkeysgenerator.com/. We'll be needing a **256-bit** key, since that's the same size of the output string generated with **HS256**. The key should look something like this:
```
5468576D5A7134743777217A25432646294A404E635266556A586E3272357538
```

> When generating the key we ticked the option to generate it using **hexadecimal** characters.

Now we can use this key to generate the signature:
```php
$secret = '5468576D5A7134743777217A25432646294A404E635266556A586E3272357538';

$signature = hash_hmac(
    'sha256',
    "$header.$payload",
    base64_encode($secret),
    true);

$signature = base64urlEncode($signature);
```

The [hash_hmac](https://www.php.net/manual/en/function.hash-hmac) function is self-explanatory. Note how we separated the header and the payload by a dot (`.`). Worth mentioning the last `true` argument, which is used to make the output binary.

> Encoding the **secret** as base64 is **optional**. It's also a good idea **not** to commit your **secret key** to **source control** (meaning github dawg ;-)

Once we have the three JWT components, we just have to join them together, separated by a dot:
```php
$jwt = "$header.$payload.$signature";
```

Once we have our **token**, it's a good idea to check out that our result matches the real deal in https://jwt.io/. So we could copy it and paste it in the proper box there.

> An error I was getting at the bottom of the page was **Invalid Signature**. It was due to leaving a **trailing comma** in the PHP **associative array** that I was using for the **payload** and **header** (maybe it was generating different JSON).

The whole point of the signature is to ensure that the token has been issued by us. If someone steals some token, and modify the payload (easy to do) with the info of another user (in order to gain access to her resources) our decoding function will detect that the signature doesn't match.

## Sending a token in the Response
Once we have successfully validated the user's credentials and generated a token, we need a way of sending it to the client. Later we'll go deeper about what's the best way to do that; for now you can just send it as a JSON string :-)

<img width="50%" src="./images/just-do-it.jpeg" />

## User receives the token
Once we've generated and sent the JWT to the user in our response, where should she put it once she receives it? There are several options for this:

1. [Session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

    * The token will accessible only **one tab**.
    * Once the tab is closed, the session data got destroyed. So it's not a valid option if we intend to add a feature like [remember me](https://www.phptutorial.net/php-tutorial/php-remember-me/).
    * We have to **manually send the token** on each request.
    * Susceptible to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting).

2. [Local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

    * The token will accessible in **multiple tabs**.
    * It provides persistence across **page refreshes**. 
    * We have to **manually send the token** on each request.
    * Susceptible to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting).
    * [Auth0](https://auth0.com/docs/secure/security-guidance/data-security/token-storage#browser-local-storage-scenarios) says it's aight when used along with token expiration.

3. [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) (used with the `HttpOnly`  and `secure`).

    * If we set the `SameSite=strict` we are protected against [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery).
    * If we set the `HttpOnly` we are protected against [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting).
    * The browser **automatically sends** the cookie on each request.

4. [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) is the to go option recommended by [Auth0](https://auth0.com/docs/secure/security-guidance/data-security/token-storage#browser-in-memory-scenarios).

All these options have pros and cons. We'll go into details about our choice in the front-end section. Regardless of the choice, the token must be added to the **request** by setting the HTTP [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) request be it **automatically** (with HttpOnly cookies) or **manually** (in the case of local storage) header.

> If the token has to be added manually, a good place to do so is when setting the header of the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests (or any other AJAX tingy).

This header looks like this:
```
Authorization: <auth-scheme> <authorization-parameters>
```

Where:

1. `<auth-scheme>` stands for the [authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes); we'll use the value [Bearer](https://datatracker.ietf.org/doc/html/rfc6750).
2. `<authorization-parameters>` stands for the token itself.

## Validating the token in the Requests
Once a user sends a **request** to access the API, our **backend** must check that the token is included in the request headers (otherwise access to API resources won't be granted).

<img width="50%" src="./images/show-me-token.jpeg" />

In PHP, we can access the `Authorization` header under `$_SERVER['HTTP_AUTHORIZATION']`. Then we have to **decode** it using a that we'll explain a bit later.

> If you find a problem when trying to access the value of the `Authorization` header in the [$_SERVER](https://www.php.net/reserved.variables.server) PHP super global, read the next section.

### Woops! Where's the Authorization Header
It may well be, that the `Authorization` header we just mentioned is not present in the [$_SERVER](https://www.php.net/reserved.variables.server) super global (under the `HTTP_AUTHORIZATION` key). This is an **issue** with the [Apache Web Server](https://httpd.apache.org/) (💩), which removes the header before PHP can read it. To solve that, we can take two different approaches:

* Using the [apache_request_headers](https://www.php.net/manual/en/function.apache-request-headers.php) PHP function, that returns an array with **all** of the HTTP request headers.
* Configure **Apache** so that the `Authorization` header is available in PHP. We could set this configuration in the virtual hosts file for our site, or in our `.htaccess` file.

Since we're already using an `.htacess` file for [URL rewriting](https://en.wikipedia.org/wiki/Rewrite_engine), we'll add there the following line at the bottom of the file:
```
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
```

Once we've added the line above, we'll be able of accessing the token under the `$_SERVER['HTTP_AUTHORIZATION']` header of each request.

> Note that, with this setting in place, the header value will be set **anyways**, so if a user's request doesn't set the header, `$_SERVER['HTTP_AUTHORIZATION']` will contain an **empty string**.

## Decoding tokens
Ok, so let's say that somehow, we're reading the tokens in the user's requests. We need a way to **decode** them in order to:

* Verify that they are **valid tokens**, meaning a proper formatted base64url string, encoded using our **secret key**.
* Determine the user that concrete token identifies, so that we can give her access to the pertinent resources.

For this task we'll write a method that basically will run in reverse the steps we took to create the token (check the code for details). The decoding function will:

1. Split the token into its three components: header, payload and signature.
2. Recalculate a new signature with the first two components.
3. Compare the new signature with the third component (the signature included in the token). If they're the same, we'll return the **decoded payload**, otherwise `false`.

> To test the decoding function, send a `POST` request to the `/api/login` with your credentials. Copy the token you receive in the **response** and send it back in the header of a `GET` request to the same endpoint ([Postman](https://www.postman.com/) really comes in handy here). That endpoint will return the decoded payload contained in the token.

## Expiring tokens
Imagine one of the following situations:

* One of our API users downgrade her **gold subscription** to a standard one; if she keeps using the old token, she still would have access to the resources available to golden members.
* A user cancels her subscription entirely but keeps using her old token.
* If a user updates her information in the database, and our token includes claims with some of that updated intel, we would end up with tokens that contain outdated data.

A solution to this issue would be to update the **secret key** that we use for generating our tokens. The problem with that is that **all users** would have to log in again to get valid tokens (generated with the new key). A better solution is to set an **expiry date** for our tokens; for this to work, now everytime a user logs in, we'll be generating two tokens:

* An **access token** with a short expiry date.
* A **refresh token** with a much longer life span.

> Issuing just a short-lived **access token** wouldn't be user-friendly either, since we'd be making everybody to log in again every time their tokens expire.

Once an **access token** expires, the user can use the **refresh token** to get a new **access token**. So our front end application will have to keep track of when the access token expires, then make a request to a **refresh token endpoint** in order to get a new **access token**. In the backend of this endpoint, once we've checked that the refresh token is valid, we have to check the **database** to check if the user is still authorized, her subscription, etc, and will issue a new **access token** with fresh information in the payload.

## Adding an Expiry Claim to the Access Token
To add an expiry date to our token we just have to add the [exp claim](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4) to the token's **payload** before encoding it. The value of this claim is a [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time), so we could use the handy [time](https://www.php.net/manual/en/function.time.php) PHP function:
```php
$payload = [
    'sub'   => '69',
    'email' => 'bob@gmail.com',
    'exp' => time() + 60 * 5,
];
```

With that new piece of information in place, once we **decode** the token we'd check that the value of `$payload['exp']` is less than `time()` (meaning that the token has not expired yet).

## Issue a Refresh Token when Logging in
As we mentioned before, whenever a user logs in with valid credentials, she should receive two tokens:

* An **access token** with a short expiry date (typically **several minutes**). 
* A **refresh token** with a longer expiry date (typically **several days**).

When a user sends a request to access an API resource, both of her tokens must be submitted. If the backend detects that the **access token** is expired, then the **refresh token** (submitted also in the request) must be checked: If it's still active, it should be used to generate a new **access token**.

> Usually **access tokens** may contain way more information than **refresh tokens**. Just remember not to add sensitive information in the first ones.

Typically, the payload of a **refresh token** is:
```php
$payload = [
    'sub'   => '69',
    'exp' => time() + 60 * 60 * 5
];
```
## The Refresh Token flow
The following diagram is included as part of the [OAuth 2.0 spec](https://datatracker.ietf.org/doc/html/rfc6749) to describe the [refresh token flow](https://datatracker.ietf.org/doc/html/rfc6749#section-1.5):

```
+--------+                                           +---------------+
|        |--(A)------- Authorization Grant --------->|               |
|        |                                           |               |
|        |<-(B)----------- Access Token -------------|               |
|        |               & Refresh Token             |               |
|        |                                           |               |
|        |                            +----------+   |               |
|        |--(C)---- Access Token ---->|          |   |               |
|        |                            |          |   |               |
|        |<-(D)- Protected Resource --| Resource |   | Authorization |
| Client |                            |  Server  |   |     Server    |
|        |--(E)---- Access Token ---->|          |   |               |
|        |                            |          |   |               |
|        |<-(F)- Invalid Token Error -|          |   |               |
|        |                            +----------+   |               |
|        |                                           |               |
|        |--(G)----------- Refresh Token ----------->|               |
|        |                                           |               |
|        |<-(H)----------- Access Token -------------|               |
+--------+           & Optional Refresh Token        +---------------+
  
  
  (A)  The client requests an access token by authenticating with the
       authorization server and presenting an authorization grant.
  
  (B)  The authorization server authenticates the client and validates
       the authorization grant, and if valid, issues an access token
       and a refresh token.
  
  (C)  The client makes a protected resource request to the resource
       server by presenting the access token.
  
  (D)  The resource server validates the access token, and if valid,
       serves the request.
  
  (E)  Steps (C) and (D) repeat until the access token expires.  If the
       client knows the access token expired, it skips to step (G);
       otherwise, it makes another protected resource request.
  
  (F)  Since the access token is invalid, the resource server returns
       an invalid token error.
  
  (G)  The client requests a new access token by authenticating with
       the authorization server and presenting the refresh token.  The
       client authentication requirements are based on the client type
       and on the authorization server policies.
  
  (H)  The authorization server authenticates the client and validates
       the refresh token, and if valid, issues a new access token (and,
       optionally, a new refresh token).

```

Let's assume that a user has made a request to the api and since her **access token** is expired, the authorization server responds with an `invalid token error`. In that case, the **client** should make a **request** to the `/refresh-token` endpoint in order to renew her **access token** and optionally an updated **refresh token** (G and H).

> In our case, the **authorization server** and the **resource server** will be in the same machine.

When the `/refresh-token` receives the **request**, the **refresh token** has to be decoded, to extract the **user id**. Then we have to query the database to check that the user with that `id` still have access to the API resources (subscription hasn't ended, or account has not been deleted).

### Refresh Token Rotation
**Refresh tokens** have a long lifetime. If they are valid, clients can use them to obtain new **access tokens** while they're not expired. If for some reason an attacker gets ahold of a user's **refresh token**, he could use it to generate **access tokens** for as long as it doesn't expire.

Refresh token rotation is a technique to minimize the effects of a leak of tokens. Using this technique, when a new **access token** is requested with the refresh token, a new refresh token is also returned and the old one is invalidated. This way the attacker cannot use the stolen token anymore, minimizing the impact of the attack.

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

## A Logout endpoint
In a SPA, if a user **logs out**, we'll have our front-end code simply delete both the **access** and **refresh** tokens that are stored in the user's browser. But the thing is, that our current setup is storing the refresh tokens in the database everytime they're issued.

> What's described above is not really a big deal, if we have a script in place that periodically checks the database to **delete** expired tokens.

If we wanted, we could create a `/logout` endpoint that would also place a **request** to the server, so that the current **refresh token** is removed from the database. This would improve the security of our application since we wouldn't have active **refresh tokens** lingering in the database (imagine an attacker steals a refresh token that belongs to a **logged out** user).

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./router.md
[next]: #