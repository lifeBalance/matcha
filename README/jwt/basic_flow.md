# Basic Flow
The basic flow of [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) goes likes this:

1. A user sends a **request**, containing her credentials, to a **log in** endpoint (authentication).
2. If the credentials are valid, the servers sends back a **response** containing a **JWT**.
3. The JWT must be saved **locally**, in the user's browser (more about this later). From there on, all user's **requests** will include this token.
4. Once the backend receives the request, it will decode the token, and if everything's good, it will grant the user access the API resources (authorization).

The following diagram may help:

![basic flow](../images/basic_flow.png "Basic JWT flow")

## Authentication vs Authorization
Authentication and authorization are popular terms used today in [cybersecurity](https://en.wikipedia.org/wiki/Computer_security). Even though quite often they are used interchangeably, they have different meanings and applications.

* [Authorization](https://en.wikipedia.org/wiki/Authorization) consists in specifying access rights/privileges to resources available to certain users or devices. A real life example would be having a ticket to attend an event, such as a movie. Having the ticket authorize us to enter the movie theater to watch the movie.

* [Authentication](https://en.wikipedia.org/wiki/Authentication) is the process of confirming the identity of a user or a device. A real life example of authentication would be showing our passport or other id to the woman in the bank.

Another real life example would be taking a flight somewhere. Once at the airport, we have to show our **passport** (authentication) in order to get a **boarding pass** (authorization) that gives us access to the plane. But what about the small counter they set up at the boarding gate? There they check that our **passport** (authentication credentials) and our **boarding pass** (authorization) match. In web applications there are also moments like that, where the distinction is a bit blurred, hence why some people confuse the terms.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../../README.md
[back]: ../jwt.md
[next]: ./cooking_tokens.md