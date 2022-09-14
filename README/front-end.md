# Front-end

## Wiring up Font Files in Tailwind
When browsing fonts for matcha's logo, I came across **All Round Gothic**, a font family designed by Ryoichi Tsunekawa. Sadly, the font wasn't available in [Google Fonts](https://fonts.google.com/), so I had to found it online, download it, and find a way of using it in my set up. Fortunately, it wasn't hard:

1. Download the font.
2. Placed the file under `src/assets/fonts/All-Round-Gothic-Bold.ttf`
3. Added the following configuration in `tailwind.config.cjs`:

```
  theme: {
    extend: {},
    fontFamily: {
      logo: ['All Round Gothic', 'sans-serif']
    }
  },
```

4. Added the following under `index.css`:
```
@layer base {
  @font-face {
    font-family: 'All Round Gothic';
    src: url('./assets/fonts/All-Round-Gothic-Bold.ttf') format('truetype');
  }
}
```

5. Finally, to use the font, we just had to use the class `font-logo`.

## Icons
For the icons I chose [Heroicons](https://heroicons.com/). To use them, I just had to visit the site, chose the icons I was interested in, and paste the provided `jsx` code into a React component, in the `icons.jsx` file.

> They provide both the `svg` code and the `jsx` version, which has the attributes normalized for React (`className` instead of `class`, etc)

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ./router.md
[next]: ./jwt.md