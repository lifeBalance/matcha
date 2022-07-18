# Authentication: JSON Web Tokens
A common authentication mechanism used in the realm of [SPAs]() are [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) (or JWT for short). This type of authentication goes as follows:

* A user sends a **request**, containing her credentials, to a **log in** endpoint.
* If the credentials are valid, the servers sends back a **response** containing a **JWT**.
* The JWT must be saved **locally**, in the user's browser (more about this later).
* From there on, user's request will include the JWT received when she logged in.

> JWT authentication is an **alternative** to the traditional approach of creating a **session** in the server and returning a **cookie**.

JWT can be described as a [stateless](https://en.wikipedia.org/wiki/Stateless_protocol) authentication mechanism, as the user state is never saved in server memory. The server's protected routes will check for a valid JWT in the Authorization header, and if it's present, the user will be allowed to access protected resources.

> Another common authentication method used by APIs is known as **API key authentication**. Here, the user's send her **API key** on every request; once the request is received, the database is queried to check if the key is valid.

Compared to **API key authentication**, JWT authentication eliminates the need for querying the database on every single request (faster app). Only at login the database is queried to validate the credentials.

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
    4. The resulting string is [hashed](https://en.wikipedia.org/wiki/Cryptographic_hash_function) using the algorithm specified in the header (`alg`). A good idea here is to use a **private key** (aka **secret key**) for the encrypting (hashing) process.
    5. Finally, the hashed string is also encoded as a **base64url** string, and appended to the previous two strings using a period.

The image below contains a representation of a token:

<img src="./images/jwt.png" width="60%" />

## Cooking a token in PHP
If all we explained above sounds too complicated, in this section we'll get our hands dirty building our own JWT using handy PHP functions. Let's start with the header:
```php
$header_data = json_encode([
    'alg' => 'HS256',
    'typ' => 'JWT'
]);

$header_base64 = base64_encode($header_data);

$header_base64url = str_replace(
    ['+', '/', '-'],
    ['-', '_', ''],
    $header_base64);
```

In the code above we are encoding the data for the header, which is an associative array with the two discussed elements. We have to encode it as a JSON string before encode it in [base64](https://en.wikipedia.org/wiki/Base64#URL_applications). The only pitfall here is that what we need is a [base64url](https://en.wikipedia.org/wiki/Base64#URL_applications) string, which is basically a **base64** string, but we have to manually convert the following three characters:

| Base64 |    Base64url     |
| ------ | ---------------- |
| `+`    | `-` (dash)       |
| `/`    | `_` (underscore) |
| `=`    | (removed)        |

Then we'll do the same for the payload.

### The Signature
For the signature we're gonna be using the algorithm that we set in the header, **HS256** which is [HMAC](https://en.wikipedia.org/wiki/HMAC) with [SHA-256](https://en.wikipedia.org/wiki/SHA-2). This is a a symmetric keyed hashing algorithm that uses one secret key. We could easily get such a key using any of the onlines **encryption key generator** such as https://www.allkeysgenerator.com/. We'll be needing a **256-bit** key, since that's the size of the hashing algorithm. The key should look something like this:
```
5468576D5A7134743777217A25432646294A404E635266556A586E3272357538
```

We generated it using **hexadecimal** characters. This is the PHP code to generate the signature:
```php
$secret = '5468576D5A7134743777217A25432646294A404E635266556A586E3272357538';

$signature = hash_hmac(
    'sha256',
    "$header.$payload",
    base64_encode($secret),
    true);
```

The [hash_hmac](https://www.php.net/manual/en/function.hash-hmac) function is self-explanatory. Note how we separated the header and the payload by a dot (`.`). Worth mentioning the last `true` argument, which is used to make the output binary.

> Encoding the **secret** as base64 is **optional**. It's also a good idea **not** to commit your **secret key** to **source control** (meaning github dawg ;-)

Once we have the three JWT components, we just have to join them together, separated by a dot:
```php
$jwt = "$header.$payload.$signature";
```

Once we have our **token**, it's a good idea to check out that our result matches the real deal in https://jwt.io/. So we could copy it and paste it in the proper box there.

> An error I was getting at the bottom of the page was **Invalid Signature**. It was due to leaving a **trailing comma** in the PHP **associative array** that I was using for the **payload** (maybe it was generating different JSON).

## The Authorization Header
Once we've generated and sent the JWT to the user, she'll have to send it back on each **request** in order to gain access to the resources in the API. The way she'll do that is by setting the HTTP [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) request header. This header looks like this:
```
Authorization: <auth-scheme> <authorization-parameters>
```
Where:

1. `<auth-scheme>` stands for the [authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes); we'll use the value [Bearer](https://datatracker.ietf.org/doc/html/rfc6750).
2. `<authorization-parameters>` stands for the token itself.

> If you find a problem when trying to access the value of the `Authorization` header in the [$_SERVER](https://www.php.net/reserved.variables.server) super global, read the next section.

### Processing the Authorization Header in PHP
If we try to access the token in the `Authorization` header mentioned above, you may find that is not present in the [$_SERVER](https://www.php.net/reserved.variables.server) super global (under the `HTTP_AUTHORIZATION` key). This is an **issue** with the [Apache Web Server](https://httpd.apache.org/), which removes the header before PHP can read it. We can solve it in two different ways:

* Using the [apache_request_headers](https://www.php.net/manual/en/function.apache-request-headers.php) to gain access to **all** of the HTTP request headers.
* Configure **Apache** so that the `Authorization` header is available in PHP. We could set this configuration in the virtual hosts file for our site, or in our `.htaccess` file.

Since we're already using an `.htacess` file for [URL rewriting](https://en.wikipedia.org/wiki/Rewrite_engine), we'll add there the following line at the bottom of the file:
```
SenEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
```

Once we've added the line above, we'll be able of accessing the token sent by the user in each request; it'll be available under `$_SERVER['HTTP_AUTHORIZATION']`.

> Note that this value will be set anyways, so if a user's request doesn't set the header, `$_SERVER['HTTP_AUTHORIZATION']` will contain an **empty string**.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./router.md
[next]: #