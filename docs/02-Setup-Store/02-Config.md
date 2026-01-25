# Configure Enviormnet

---

> ## Enviorment variables

You can create the **.env** here:

- Storeflow/web
  - .env

:::danger
Nobody should see this file.
:::

Copy this to the .env file:

```python
# PUBLIC - Branding & Contact
NEXT_PUBLIC_BRAND_NAME="Store Flow"
NEXT_PUBLIC_PHONE_NUMBER="+970 111 111 111"
NEXT_PUBLIC_EMAIL="xxxxxxxxxx@gmail.com"
NEXT_PUBLIC_ADDRESS="Store Flow, 123 Main St, Nablus, Palestine"
NEXT_PUBLIC_MAP_LINK="https://maps.app.goo.gl/fFvqNZf1TDsLUoQZ6"
NEXT_PUBLIC_MAP_SHOWCASE_URI="https://www.openstreetmap.org/export/embed.html?bbox=35.25061279535294%2C32.22571954584364%2C35.25491505861283%2C32.22780248703342&amp;layer=mapnik&amp;marker=32.22676102240543%2C35.25276392698288"
NEXT_PUBLIC_DIRECT_SUPPORT_LINK="https://wsend.co/1111111111"
NEXT_PUBLIC_SHOW_BRAND_NAME_IN_HEADERS=true
NEXT_PUBLIC_SHOW_BRAND_NAME_IN_FOOTER=true

NEXT_PUBLIC_DEV_SUPPORT_LINK="https://wa.me/+1111111111"
NEXT_PUBLIC_DEV_SUPPORT_MAIL="mailto:dev@dev.com"

# PUBLIC - Store & Checkout
NEXT_PUBLIC_CURRENCY="₪"
NEXT_PUBLIC_CURRENCY_POS="before" # Options: 'before' | 'after' | leave empty for auto-detect

# Comma-separated list. No spaces. Leave empty for all cities.
NEXT_PUBLIC_DELIVERY_ONLY_TO_CITIES="Nablus,Tolkarm"
# Set to 0 for always free, -1 for no free delivery.
NEXT_PUBLIC_FREE_DELIVERY_ABOVE=499.99
NEXT_PUBLIC_PRICE_FILTER_MIN=0
NEXT_PUBLIC_PRICE_FILTER_MAX=10000
NEXT_PUBLIC_PRICE_FILTER_STEP=10
NEXT_PUBLIC_SEARCH_LIMIT=5
NEXT_PUBLIC_STORE_PAGE_SIZE=12
NEXT_PUBLIC_WISHLIST_LIMIT=12
NEXT_PUBLIC_SETS_PAGE_SIZE=4
NEXT_PUBLIC_ADMIN_TABLE_PAGE_SIZE=5

# PUBLIC - Feature Flags
NEXT_PUBLIC_SHOW_PARTNERS_ON_HOME=true
NEXT_PUBLIC_SHOW_PARTNERS_ON_CONTACT=true
NEXT_PUBLIC_STORE_CATEGORIES_VARIANT="tags" # "cards" | "tags"

# PUBLIC - General & Third Party
NEXT_PUBLIC_NODE_ENV='production' # production | development
NEXT_PUBLIC_APP_BASE_URL="http://localhost:3000" # No '/' at the end
NEXT_PUBLIC_GOOGLE_CLIENT_ID="XXXXXXXXXXXXXXXXXXXXXXXXXXXX"


# PUBLIC - Delivery Fees (you can edit these options as you like, but remember to check DELIVERY_FEES in config.js and language)

NEXT_PUBLIC_SHIPPING_ZONES='[
  {"slug": "west-bank", "name": "West Bank", "fee": 20},
  {"slug": "quds", "name": "Jerusalem", "fee": 30},
  {"slug": "interior-lands", "name": "Interior Lands (48)", "fee": 70}
]'

NEXT_PUBLIC_SHIPPING_AND_RETURN_INFO='[
  {"icon": "mdi:truck", "title": "Free Shipping", "description": "Orders over 30 will qualify for free shipping"},
  {"icon": "mdi:shield-check", "title": "2 Year Warranty", "description": "Our products are backed by a comprehensive warranty"},
  {"icon": "heroicons:arrow-path-16-solid", "title": "30-Day Returns", "description": "Not satisfied? Return within 30 days for a full refund"}
]'


# SERVER-SIDE SECRETS - DO NOT EXPOSE

# Auth
JWT_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
# Database
DATABASE_URL="postgresql://example:123456@db:5432/example_db?connection_limit=1&connect_timeout=30"
# Rewrite for the 'db' service
POSTGRES_USER=example
POSTGRES_PASSWORD=123456
POSTGRES_DB=example_db
# Email
SERVICE=gmail
EMAIL_MAIL=xxxxxxxxxxxx@gmail.com
EMAIL_PASS=xxxxxxx xxxxxx xxxxxx xxxxx


# SERVER-SIDE CONFIGURATION

# Session
SESSION_DURATION=7d
SHORT_LIVED_TOKEN_HOURS=1
SESSION_COOKIE="session"

# Rate Limits (in milliseconds)
CHECKOUT_LIMIT=3
CHECKOUT_LIMIT_RESET_TIME=3600000
REVIEWS_RATING_LIMIT=5
REVIEWS_RATING_LIMIT_RESET_TIME=3600000
REVIEWS_REPLY_LIMIT=20
REVIEWS_REPLY_LIMIT_RESET_TIME=3600000
REVIEWS_DELETE_LIMIT=10
REVIEWS_DELETE_LIMIT_RESET_TIME=3600000
AUTH_LIMIT=13
AUTH_LIMIT_RESET_TIME=3600000
FEEDBACK_LIMIT=3
FEEDBACK_LIMIT_RESET_TIME=3600000
```

Make sure you replace `JWT_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_APP_BASE_URL`, `NEXT_PUBLIC_NODE_ENV`, `EMAIL_MAIL`, `EMAIL_PASS` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

---

:::warning
Add any potential domain for the `NEXT_PUBLIC_APP_BASE_URL` in the file **next.config.mjs** allowedOrigins like this: -
:::

```py
  experimental: {
    useCache: true,
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "https://xxxxxx-3000.euw.devtunnels.ms",
        // etc...
      ],
    },
  },
```

---

To get the `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, you must go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials), create `OAuth 2.0 Client ID`, and copy the `Client ID`, then click on it and add the `NEXT_PUBLIC_APP_BASE_URL` to the **Authorised JavaScript origins**.

You can get the VAPID KEYS from any place like [magicbell](https://www.magicbell.com/web-push/vapid-keys).

---

<!-- > ## Deploy schemas

Connect the app to the database and initialize the schemas:-

Open your terminal and run these.

```
bun run prisma:init
bun run prisma:migrate:dev-reset
bun run prisma:push
```

```
bun run dev
OR
bun run prisma:generate
``` -->

you might also want to grant files mutating premission to your app (to mutate the items' images).

```
sudo chown -R myuser:myuser public/uploads
```

Replace `myuser` with the actual user (your operating system user).

---

> ## PWA MANIFEST

Go to `web/public/`

Edit the `manifest.json` and the icons there (icon-192.png and icon-512.png):

```json
{
  "name": "Spring Hardware",
  "short_name": "Spring Hardware",
  "theme_color": "#4a8fdf",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "any",
  "scope": "/",
  "start_url": "/",
  "description": "Spring Hardware E-Store",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

You can use [web-manifest-generator](https://codeshack.io/web-manifest-generator/).

---

_Last updated on December 31, 2025 by Ayman._
