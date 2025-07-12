# Configure Enviormnet

---

> ## Enviorment variables

You can create the **.env.local** here:

- Storeflow folder
  - .env.local

```javascript
#// Genreal
NEXT_PUBLIC_NODE_ENV='development' #// or production
NEXT_PUBLIC_APP_BASE_URL="http://localhost:3000" #// no '/' at the end


#// Auth
JWT_SECRET="your-very-strong-jwt-secret-key-here-at-least-32-characters"
#// Session duration. Use 's', 'm', 'h', or 'd'. Examples: "60s", "1m", "2h", "7d"
SESSION_DURATION=7d
SHORT_LIVED_TOKEN_HOURS=1

#// Database, check the previous page
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

#// Email, you can get the mail and pass from any service
SERVICE=gmail
EMAIL_MAIL=example@gmail.com
EMAIL_PASS=fdoa kgsa bmrw asnt

#// Checkout (the user can checkout 3 times in 1 hour)
CHECKOUT_LIMIT=3
CHECKOUT_LIMIT_RESET_TIME=3600000 #// 1 hour

#// Rating
RATING_LIMIT=5
RATING_LIMIT_RESET_TIME=3600000

```

:::danger
Nobody should see this file.
:::

Make sure you replace `JWT_SECRET`, `DATABASE_URL`, `APP_BASE_URL`, `NEXT_PUBLIC_NODE_ENV`, `EMAIL_MAIL` and `EMAIL_PASS`, especially when deploying it to production.

---

> ## Deploy schemas

Connect the app to the database and initialize the schemas:-

Open your terminal and run these.

```
npm run prisma:init
npm run prisma:migrate:dev
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

_Last updated on July 8, 2025 by Ayman._
