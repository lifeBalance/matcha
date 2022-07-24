# Refresh Tokens and Access Tokens
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


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../../README.md
[back]: ./cooking_tokens.md
[next]: ./token_rotation.md