# Script to remove expired Refresh Tokens from Database
At this point, our app creates a new row in the database for refresh tokens when a user **logs in** and when they hit the `/refresh` endpoint. When they **log out** the current token is explicitely removed. But what if the user doesn't explicitely logs out from the app, her expired **refresh token** will stay in the database.

> Keeping expired tokens in the database is not a security risk, but it's a good database optimization to delete them so the database doesn't fill up with expired tokens.

We can test out this script by attaching a shell to our Docker container and executing:
```
php delete_expired_refresh_tokens.php
```

Then I added a new Docker container named [ofelia](https://github.com/mcuadros/ofelia) to my setup. It's a **job scheduler** writen in Go that works great with Docker containers.


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./logout.md
[next]: ../README.md
