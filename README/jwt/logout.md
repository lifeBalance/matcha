# A Logout endpoint
In a SPA, if a user **logs out**, we'll have our front-end code simply delete both the **access** and **refresh** tokens that are stored in the user's browser. But the thing is, that our current setup is storing the refresh tokens in the database everytime they're issued.

> What's described above is not really a big deal, if we have a script in place that periodically checks the database to **delete** expired tokens.

If we wanted, we could create a `/logout` endpoint that would also place a **request** to the server, so that the current **refresh token** is removed from the database. This would improve the security of our application since we wouldn't have active **refresh tokens** lingering in the database (imagine an attacker steals a refresh token that belongs to a **logged out** user).


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./authorize_access.md
[next]: ./db_cleaning.md