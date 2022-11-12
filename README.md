# matcha
This project introduces you to a more advanced tool for creating your web applications: the [micro-framework](https://en.wikipedia.org/wiki/Microframework). You will have to create, in the language of your choice, a [dating site](https://en.wikipedia.org/wiki/Online_dating_service) (🍆 💦 🍑).

## My Approach: Single-page application
Since in my previous project I used the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) software architectural pattern, this time I wanted to test another different but nowadays popular approach: [SPA](https://en.wikipedia.org/wiki/Single-page_application) (short for **Single-page application**). The intention behind this choice was to become familiar with the most common paradigms used today in Web development.

<p align="center"><img src="./README/images/spa_all.jpeg" height="250" /></p>

In an SPA, a page refresh almost never occurs; instead, all necessary HTML, JavaScript, and CSS code is downloaded **once**, the very first time the user loads the site. From there on, all user interaction is handled by a modern [JavaScript framework](https://en.wikipedia.org/wiki/Single-page_application#JavaScript_frameworks), which dynamically rewrites the web page, with new data retrieved from the web server.

> In a SPA, all data interchanges with the server are done using [Ajax](https://en.wikipedia.org/wiki/Ajax_(programming)). The data itself is encoded into [JSON](https://en.wikipedia.org/wiki/JSON) strings before being sent, and decoded on each end once received.

So the **big picture** for this project can be described in two parts:

* ~~A **backend** [web API](https://en.wikipedia.org/wiki/Web_API), made from scratch using PHP~~.
* A **backend** [web API](https://en.wikipedia.org/wiki/Web_API), made using [Express.js](http://expressjs.com/) (tried to keep it RESTful, but I may have let [Mr. Fielding](https://en.wikipedia.org/wiki/Roy_Fielding) down 😓).
* A JS framework in the **frontend** to take care of the rest. This time I went with [React](https://reactjs.org/).

## Contents
Below I grouped in sections the **personal notes** I took while working on this project:

* [Docker set up](./README/docker.md)
* [About RESTful APIs](./README/restful.md)
* [Routing requests](./README/router.md)
* [App setup](./README/setup.md)
* [Authentication: JSON web tokens](./README/jwt.md)
* [Front-end](./README/front-end.md)

## TODO
- [ ] Implement **advance search/filters**.
- [ ] Infinite scroll would be nice.
- [x] Fix the scroll up, in profile list, when new users are added to state.
- [ ] Give it a go to https, so we can use `Secure` and `SameSite=None`; also for setting properly the **refresh token** in the hard cookie.
- [ ] Eliminate duplication in the **models** (Account, Settings, Profiles basically deal with the same thing).
- [ ] Update these notes!

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: #
[back]: #
[next]: ./README/docker.md