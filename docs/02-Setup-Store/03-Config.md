# Configure Enviormnet

---

> ## Enviorment variables

You can create the **.env.local** here:

- Storeflow folder

  - .env.local

:::danger
Nobody should see this file.
:::

```javascript
#// Genreal
NEXT_PUBLIC_NODE_ENV='development' #// or production
NEXT_PUBLIC_APP_BASE_URL="http://localhost:3000" #// no '/' at the end


#// Auth
JWT_SECRET="your-very-strong-jwt-secret-key-here-at-least-32-characters"
#// Session duration. Use 's', 'm', 'h', or 'd'. Examples: "60s", "1m", "2h", "7d"
SESSION_DURATION=7d
SHORT_LIVED_TOKEN_HOURS=1
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
SESSION_COOKIE="session"

#// Database, check the previous page
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

#// Email, you can get the mail and pass from any service
SERVICE=gmail
EMAIL_MAIL=example@gmail.com
EMAIL_PASS=fdoa kgsa bmrw asnt

#// Limits

#// Checkout (e.g the user can checkout 3 times in 1 hour)
CHECKOUT_LIMIT=3
CHECKOUT_LIMIT_RESET_TIME=3600000 #// 1 hour

#// Rating
#// Main review submission limits
REVIEWS_RATING_LIMIT=5
REVIEWS_RATING_LIMIT_RESET_TIME=3600000

#// Reply submission limits
REVIEWS_REPLY_LIMIT=20
REVIEWS_REPLY_LIMIT_RESET_TIME=3600000

#// Delete operation limits
REVIEWS_DELETE_LIMIT=10
REVIEWS_DELETE_LIMIT_RESET_TIME=3600000

#// Auth
AUTH_LIMIT=13
AUTH_LIMIT_RESET_TIME=3600000

```

Make sure you replace `JWT_SECRET`, `DATABASE_URL`, `APP_BASE_URL`, `NEXT_PUBLIC_NODE_ENV`, `EMAIL_MAIL`, `EMAIL_PASS` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

---

:::warning
Add any potential domain for the `NEXT_PUBLIC_APP_BASE_URL` in the file **next.config.mjs** allowedOrigins like this: -
:::

```
  experimental: {
    useCache: true,
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "https://219z15jv-3000.euw.devtunnels.ms",
        // etc...
      ],
    },
  },
```

---

To get the `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, you must go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials), create `OAuth 2.0 Client ID`, and copy the `Client ID`, then click on it and add the `NEXT_PUBLIC_APP_BASE_URL` to the **Authorised JavaScript origins**.

---

> ## Deploy schemas

Connect the app to the database and initialize the schemas:-

Open your terminal and run these.

```
npm run prisma:init
npm run prisma:migrate:dev-reset
npm run prisma:push
```

```
npm run dev
OR
npm run prisma:generate
```

you might also want to grant files mutating premission to your app (to mutate the items' images).

```
sudo chown -R aymen:aymen public/uploads
```

Replace `aymen` with the actual user (your operating system user).

---

_Last updated on Septemper 8, 2025 by Ayman._
