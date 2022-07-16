# The Router
First order of business is to write a custom router for our app. For [camagru](https://github.com/lifeBalance/camagru) I wrote a very simple one, that loaded the proper classes automatically according to the request. This time I wanted to change some things.

* We won't be using [pretty urls]() because we may use the query string for things as pagination.
* I want it to be able to call class methods depending on HTTP methods.
* It should be able to handle routes added manually, in a routes file.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: #