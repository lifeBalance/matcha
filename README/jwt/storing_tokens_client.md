# Storing Tokens in the Client
Once a token has been sent the to the user in a **response**, the following question arises: where should the client store it? There's quite a bit of controversy around this topic. Let's start by enumerating our options.

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

5. Browser memory, meaning a [JavaScript closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#emulating_private_methods_with_closures) that we can use to emulate a private method.

As you can see, all these options have pros and cons. There are different opinions about it:

* [Auth0](https://auth0.com/docs/secure/security-guidance/data-security/token-storage) recommends storing tokens (don't clarify exactly which ones) using **web workers** as the best option, followed by **JS closures**. But they also admit that [local storage](https://auth0.com/docs/secure/security-guidance/data-security/token-storage#browser-local-storage-scenarios) can be a viable alternative.
* [OWASP]() recommends using [session storage](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-storage-on-client-side) combined with [browser fingerprinting](https://en.wikipedia.org/wiki/Device_fingerprint#Browser_fingerprint).

## My choice
For the reasons I'll explain in a minute, I decided to store:

* The **refresh token** in an [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).
* The **access token** in [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

1. Storing the **refresh token** in a cookie should be ok if we take the [following measures](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking):

* Set it up as an [HttpOnly](https://owasp.org/www-community/HttpOnly), so they can't be accessed by JavaScript.
* We'll use also the [Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#secure) attribute.
* And the [SameSite]https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite).

 The downside to using `HttpOnly` cookies is that we won't be able to access its payload client-side, which in this case is fine, since only the backend is gonna be using the information contained in them.

2. Storing the **access token** in **local storage** is marginally worse than storing it in **session storage**, which provides an expiration mechanism that is not present in **local storage** (where tokens may live forever). That being said, since we'll be using **refresh token rotation** what we just said is not that important. Also, we won't be keeping sensitive information in the token. To compensate with a good thing, **local storage** has the advantage of being persistent accross browser tabs and page refreshes.

> **Access tokens** are **bearer tokens**, meaning that the authority of the token is granted to the holder (bearer) of the token. So an attacker could use it to make API calls that are indistinguishable from legitimate API calls.

 Some [seemingly knowledgeable people](https://pragmaticwebsecurity.com/articles/oauthoidc/localstorage-xss.html) recommend not to worry so much about **storage**, since once we're XSS vulnerable is game over.

> There are some popular frameworks such as [Yii](https://www.yiiframework.com/wiki/2568/jwt-authentication-tutorial?revision=2#token-expired) that use the same approach I intend to implement (cookies for refresh tokens, and local storage for access tokens).

## Sending the Tokens in a Request
Regardless of the storage choice, the token must be added to the **request** by either:

* Manually setting the HTTP [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header.
* **Automatically** by the browser, if the tokens were set in cookies (`HttpOnly` and all that).

> If the token has to be added manually, a good place to do so is when setting the header of the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests (or any other AJAX tingy).

This header looks like this:
```
Authorization: <auth-scheme> <authorization-parameters>
```

Where:

1. `<auth-scheme>` stands for the [authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes); we'll use the value [Bearer](https://datatracker.ietf.org/doc/html/rfc6750).
2. `<authorization-parameters>` stands for the token itself.


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./token_rotation.md
[next]: ./authorize_access.md