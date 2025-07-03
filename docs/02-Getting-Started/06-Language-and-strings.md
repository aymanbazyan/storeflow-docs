# Language and strings

---

Go to `./src/helpers/language.js` and edit any string you want to show in the website (e.g change `"Sets"` to `"Builds"`)

Or re-write everything in another language !

And you can also change the direction of the website if you want to use Arabic or Hebrew language.

`language.js:`

```javascript
export const language = "en";

export const rtl = language === "ar" || language === "he";
/*
website's direction is right-to-left if the language is 'ar' (arabic)
or 'he' (hebrew) (dont change this)
*/

export const messages = {
  loading: "Loading...",
  contactButton: "Contact Us",
  copied: "Link copied",
  customConfirm: {
    confirmation: "Confirmation",
    submit: "Okay",
    cancel: "Cancel",
  },
  notFound: {
    title: "Page not found",
    subTitle: "The page you a...
```

---

_Last updated on June 12, 2025 by Ayman._
