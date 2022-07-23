# Basic Flow
The basic flow of [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) goes likes this:

1. A user sends a **request**, containing her credentials, to a **log in** endpoint (authentication).
2. If the credentials are valid, the servers sends back a **response** containing a **JWT**.
3. The JWT must be saved **locally**, in the user's browser (more about this later).
4. From there on, the user's **requests** will include the JWT received when she logged in. Decoding this token (in the backend) on each request, it's what will **authorize** the user access to resources (no need to maintain [sessions](https://en.wikipedia.org/wiki/Session_(computer_science))).