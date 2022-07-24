# Authorizing Access (backend)
Once a user sends a **request** to access the API, our **backend** must decode the token included in the request. Depending on the approach we took to store tokens on the client, there are several places where we have to look for the token in the request:

* They may be in a [cookie]().
* They may also be in the request headers.

> If a token is not somehow included in the **request**, access to API resources won't be granted.

<img width="50%" src="./images/show-me-token.jpeg" />

Remember our design choice regarding client side **token storage**:

* The **refresh token**  was set in the backend in a **cookie**. So it will be sent back to the server in the same way.
* The **access token** in **local storage**, so the client must send it in the [authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization).

## The Authorization Header
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

## The `$_COOKIE` Super Global
In PHP, the [$_COOKIE](https://www.php.net/manual/en/reserved.variables.cookies.php) contains an \ associative array of variables passed to the current script via HTTP Cookies.

## Decoding tokens
Regardless of the way the client sent the tokens, we need a way to **decode** them in order to **validate** them:

* They must be proper formatted base64url string.
* They must have been encoded using our **secret key**.

> Needless to say, they must be **not expired**, but this is something we check for **after** decoding.

For this task we'll write a method that basically will run in reverse the steps we took when creating the token (check the code for details). The decoding function will:

1. Split the token into its three components: header, payload and signature.
2. Recalculate a new signature with the first two components.
3. Compare the new signature with the third component (the signature included in the token). If they're the same, we'll return the **decoded payload**, otherwise `false`.

> To test the decoding function, send a `POST` request to the `/api/login` with your credentials. Copy the token you receive in the **response** and send it back in the header of a `GET` request to the same endpoint ([Postman](https://www.postman.com/) really comes in handy here). That endpoint will return the decoded payload contained in the token.


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../../README.md
[back]: ./storing_tokens_client.md
[next]: ./logout.md