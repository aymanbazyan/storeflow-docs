# Tech Stack & Concepts

## **Tech Stack**

- Frontend + Backend: Next.js v15.5.0 (App Router)

- Database: PostgreSQL v16.9 + Prisma v6.16.2

- Styling: Tailwind CSS v4

- API: Next.js API routes

- Mobile: React Native 0.81.4 + Expo 54.0.7

- [Deployment: Vercel / Asura Hosting (soon)](/docs/Setup-Store/Deployment)

---

## **Database Schemas (Prisma)**

The single source of truth for the database structure is the `prisma/schema.prisma` file. It defines all models, relations, and indexes.

### Diagram 1: E-commerce & Order Processing

```mermaid
erDiagram
    Users {
        String slug PK
        String email UK
        String displayName
        String passwordHash
    }

    Orders {
        String slug PK
        String email FK
        String status
        Decimal sub_total
        Decimal shipping_fee
        String payment_method
        String discount_code FK
        Decimal discount_amount
        Int items_qty
        DateTime created_at
    }

    OrderItems {
        String slug PK
        String order_slug FK
        String product_variant_slug FK
        String set_slug FK
        String item_type
        Int quantity
        Decimal unit_price
    }

    DiscountCodes {
        String slug PK
        String discount_type
        Decimal discount_value
        Boolean is_active
        Int used_count
        DateTime expires_at
    }

    ProductVariant {
        String slug PK
        String name
        Float price
    }

    Sets {
        String slug PK
        String name
        Float price
    }

    Users ||--o{ Orders : "places"
    Orders ||--o{ OrderItems : "contains"
    DiscountCodes }o--o{ Orders : "applies to"
    ProductVariant }o--|| OrderItems : "can be"
    Sets }o--|| OrderItems : "can be"
```

### Diagram 2: Product Catalog & Inventory

```mermaid
erDiagram
    Categories {
        String slug PK
        String name
        String img
        Boolean is_featured
    }

    Products {
        String slug PK
        String name
        String category FK
        Int items_sold
        Float averageRating
        String[] images
        Boolean featured_promotion
        Boolean top_selling
        Boolean is_new
    }

    ProductVariant {
        String slug PK
        String productSlug FK
        String name
        Float price
        Int discount
        Int quantity
    }

    Sets {
        String slug PK
        String name
        Float price
        Int items_sold
        Float averageRating
        String[] images
        Boolean featured_promotion
        Boolean top_selling
        Boolean is_new
    }

    SetComponents {
        String setSlug PK, FK
        String productVariantSlug PK, FK
        Int quantity
    }

    Categories ||--o{ Products : "contains"
    Products ||--o{ ProductVariant : "has"
    Products }o--o{ Products : "relates to"
    Sets }o--o{ Sets : "relates to"
    Sets ||--o{ SetComponents : "is composed of"
    ProductVariant ||--o{ SetComponents : "is a component of"
```

### Diagram 3: User Interaction & Reviews

```mermaid
erDiagram
    Users {
        String slug PK
        String email UK
        String displayName
        Boolean isAdmin
        Boolean emailVerified
        String passwordResetToken
        String emailVerificationToken
    }

    Reviews {
        String slug PK
        String user_slug FK
        String product_slug "FK, optional"
        String set_slug "FK, optional"
        String parent_review_slug "FK, optional"
        DateTime created_at
        DateTime updated_at
        Decimal rate
        String comment "optional"
        Boolean is_reply
    }

    Products {
        String slug PK
        String name
        Float averageRating
        Int reviewCount
    }

    Sets {
        String slug PK
        String name
        Float averageRating
        Int reviewCount
    }

    %% --- Relationships ---

    Users ||--o{ Reviews : "writes"
    Products ||--o{ Reviews : "receives"
    Sets ||--o{ Reviews : "receives"

    %% Self-referencing relationship for replies
    Reviews ||--o{ Reviews : "replies to"

    %% Wishlist relationships
    Users }o--o{ Products : "wishlists"
    Users }o--o{ Sets : "wishlists"
```

### Diagram 4: Site Content & System

```mermaid
erDiagram
    Config {
        String slug PK
        String tos
        String about_us
        String mission
        Boolean checkoutEnableCod
        Boolean checkoutEnableCreditCard
    }

    Themes {
        String slug PK
        Json themeStringObj
        String headerTextColor
        String img
    }

    Team {
        String slug PK
        String name
        String role
        String img
    }
```

```mermaid
erDiagram
    Partners {
        String slug PK
        String img
        DateTime created_at
    }

    Gallery {
        String slug PK
        String name
        String img
        DateTime updated_at
    }
```

```mermaid
erDiagram
    RequestLogs {
        Int slug PK
        String identifier
        DateTime timestamp
        String type
        String description
    }

    TimedoutIps {
        String slug PK
        DateTime created_at
        DateTime timedout_until
    }

     CustomTransactions {
      String      slug  PK
      Decimal     amount
    }
```

### More details

<details>
<summary><strong>Click to expand/collapse the detailed database structure</strong></summary>

```
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma"
  previewFeatures = ["fullTextSearchPostgres"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Users {
  slug                     String    @default(cuid()) @id @db.VarChar(100)
  created_at               DateTime   @default(now())
  email                    String     @unique @db.VarChar(255)
  password_hash             String?    @db.VarChar(255)
  display_name              String     @db.VarChar(100)
  is_google_auth             Boolean    @default(false)
  is_admin                  Boolean    @default(false)
  password_reset_token       String?    @unique @db.VarChar(100)
  password_reset_expires     DateTime?
  email_verified            Boolean?   @default(false)
  email_verification_token   String?    @unique
  email_verification_expires DateTime?
  orders                   Orders[]
  wishlist                 Products[]
  wishlistSets             Sets[]     @relation("UserWishlistSets")
  reviews                  Reviews[]

  @@index([email])
  @@index([is_admin])
  @@index([email_verified])
  @@index([email_verified, created_at])
  @@index([created_at])
}

model RequestLogs {
  slug          Int      @id @default(autoincrement())
  identifier    String
  type          String   // "review", "checkout", "auth"
  created_at    DateTime @default(now())
  description   String   @default("")

  @@index([identifier, type])
  @@index([identifier, type, created_at])
  @@index([created_at])
}

model TimedoutIps {
  slug           String   @id // The IP address
  created_at     DateTime @default(now())
  timedout_until DateTime // The timestamp when the timeout expires

  @@index([timedout_until])
  @@index([created_at])
}

model Config {
  slug                     String   @id @default("general") @db.VarChar(50)
  tos                      String?  @default("") @db.Text
  about_us                 String?  @default("") @db.Text
  mission                  String?  @default("") @db.Text
  partners_description     String?  @default("") @db.Text
  connect_description      String?  @default("") @db.Text
  delivery_policies        String[] @default([])
  checkout_enable_cod      Boolean  @default(true)
  // checkout_enable_credit_card Boolean  @default(false)
  // checkout_enable_paypal      Boolean  @default(false)
}

model Categories {
  slug        String     @id @db.VarChar(100)
  name        String     @db.VarChar(100)
  img         String?    @default("") @db.VarChar(255)
  is_featured Boolean    @default(false)
  created_at  DateTime   @default(now())

  product    Products[]

  @@index([is_featured])
  @@index([created_at])
}

// The parent product, holds shared data
model Products {
  created_at          DateTime   @default(now())
  slug                String     @id @db.VarChar(100)
  name                String     @db.VarChar(100)
  category            String     @db.VarChar(100)
  items_sold          Int        @default(0) @db.SmallInt // Total sold across all variants
  featured_promotion  Boolean    @default(false)
  top_selling         Boolean    @default(false)
  is_new              Boolean    @default(false)
  images              String[]   @default([])
  average_rating      Float      @default(0) @db.DoublePrecision
  review_count        Int        @default(0)
  description         String     @default("") @db.Text
  secret_description  String?    @default("") @db.Text

  // DENORMALIZED
  min_price           Float      @default(0) @db.DoublePrecision
  max_price           Float      @default(0) @db.DoublePrecision
  max_discount        Int        @default(0) @db.SmallInt

  search_vector      Unsupported("tsvector")?

  categoryRef        Categories       @relation(fields: [category], references: [slug], onDelete: Cascade)
  wishlistedBy       Users[]
  relatedProducts    Products[]       @relation("ProductRelations")
  relatedTo          Products[]       @relation("ProductRelations")
  reviews            Reviews[]
  variants           ProductVariant[] // A product has many variants

  @@index([category])
  @@index([featured_promotion])
  @@index([top_selling])
  @@index([is_new])
  @@index([name])
  @@index([created_at])
  @@index([items_sold])
  @@index([average_rating])
  @@index([min_price])
  @@index([max_price])
  @@index([max_discount])

  @@index([category, name])
  @@index([category, top_selling])
  @@index([category, created_at])
  @@index([category, items_sold])
  @@index([category, average_rating])
  @@index([category, min_price])
  @@index([category, max_price])
  @@index([category, max_discount])
}

model ProductVariant {
  slug        String  @id @db.VarChar(150) // e.g., "headphones-white-large"
  product_slug String  @db.VarChar(100)
  name        String  @db.VarChar(100) // e.g., "White, Large"
  price       Float   @db.DoublePrecision
  discount    Int     @default(0) @db.SmallInt
  quantity    Int     @default(0) @db.SmallInt
  created_at  DateTime @default(now())
  description String?  @db.Text
  preferred_img_index Int?  @default(0) @db.SmallInt

  product     Products     @relation(fields: [product_slug], references: [slug], onDelete: Cascade)
  orderItems  OrderItems[]
  setComponents SetComponents[]

  @@index([product_slug])
  @@index([price])
  @@index([quantity])
  @@index([name])
  @@index([discount])
  @@index([product_slug, price])
  @@index([product_slug, discount])
}

model Reviews {
  slug         String    @id @default(cuid())
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt
  rate         Decimal   @default(0) @db.Decimal(2, 1)
  comment      String?   @db.VarChar(255)
  product_slug String?   @db.VarChar(100)
  set_slug     String?   @db.VarChar(100)
  user_slug    String    @db.VarChar(100)

  // Reply functionality
  parent_review_slug String? @db.VarChar(150)
  is_reply           Boolean @default(false)

  // Relations
  product      Products?  @relation(fields: [product_slug], references: [slug], onDelete: Cascade)
  set          Sets?      @relation(fields: [set_slug], references: [slug], onDelete: Cascade)
  user         Users      @relation(fields: [user_slug], references: [slug], onDelete: Cascade)

  // Self-referential relation for replies
  parent_review Reviews?   @relation("ReviewReplies", fields: [parent_review_slug], references: [slug], onDelete: Cascade)
  replies       Reviews[]  @relation("ReviewReplies")

  @@index([user_slug])
  @@index([created_at])
  @@index([product_slug, updated_at, created_at])
  @@index([set_slug, updated_at, created_at])
  @@index([parent_review_slug])
  @@index([product_slug, is_reply])
  @@index([set_slug, is_reply])
}

model Sets {
  slug               String          @id @db.VarChar(100)
  name               String          @db.VarChar(100)
  images             String[]        @default([])
  made_by            String          @db.VarChar(100)
  description        String          @default("")
  tags               String[]        @default([])
  created_at         DateTime        @default(now())
  price              Float           @default(0) @db.DoublePrecision
  discount           Float           @default(0) @db.DoublePrecision
  items_sold         Int             @default(0) @db.SmallInt
  featured_promotion Boolean         @default(false)
  top_selling        Boolean         @default(false)
  is_new             Boolean         @default(false)
  average_rating      Float           @default(0) @db.DoublePrecision
  review_count        Int             @default(0)

  components         SetComponents[]
  orderItems         OrderItems[]
  relatedProducts   Sets[]          @relation("SetRelations")
  relatedTo         Sets[]          @relation("SetRelations")
  wishlistedBy       Users[]         @relation("UserWishlistSets")
  reviews            Reviews[]

  @@index([made_by])
  @@index([name])
  @@index([created_at])
  @@index([price])
  @@index([discount])
  @@index([items_sold])
  @@index([featured_promotion])
  @@index([top_selling])
  @@index([is_new])
}

model SetComponents {
  set_slug           String @db.VarChar(100)
  product_variant_slug String @db.VarChar(150)
  quantity          Int    @db.SmallInt

  set     Sets           @relation(fields: [set_slug], references: [slug], onDelete: Cascade)
  variant ProductVariant @relation(fields: [product_variant_slug], references: [slug], onDelete: Cascade)

  @@id([set_slug, product_variant_slug])
  @@index([set_slug, quantity])
}

model Team {
  slug       String   @id @db.VarChar(100)
  name       String   @db.VarChar(100)
  role       String?  @db.VarChar(100)
  img        String?  @db.VarChar(255)
  created_at DateTime @default(now())

  @@index([created_at])
}

model Partners {
  slug       String   @id @db.VarChar(100)
  img        String   @db.VarChar(255)
  created_at DateTime @default(now())

  @@index([created_at])
}

model Gallery {
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  slug       String   @id @db.VarChar(100)
  name       String   @db.VarChar(100)
  img        String   @db.VarChar(255)

  @@index([created_at])
  @@index([updated_at])
}

model Themes {
  slug            String   @id @default("general") @db.VarChar(50)
  theme_string_obj  Json     @default("{\"primary\":\"blue\",\"secondary\":\"violet\"}")
  header_text_color String?  @default("text-black") @db.VarChar(100)
  img             String?  @default("") @db.VarChar(255)
}

model Orders {
  slug           String   @id @db.VarChar(100)
  created_at     DateTime @default(now())
  name           String   @db.VarChar(100)
  email          String   @db.VarChar(255)
  address        String   @db.VarChar(255)
  city           String   @db.VarChar(100)
  region         String?  @db.VarChar(100)
  postal_code    String?  @db.VarChar(20)
  notes          String?  @db.VarChar(500)
  payment_method String   @db.VarChar(50)
  shipping_fee   Decimal  @db.Decimal(10, 2)
  sub_total      Decimal  @db.Decimal(10, 2)
  phone          String   @db.VarChar(20)
  status         String   @db.VarChar(20)
  admin_note     String?  @db.Text
  items_qty      Int      @db.SmallInt

  discount_code   String?        @db.VarChar(50)
  discount_amount Decimal        @default(0) @db.Decimal(10, 2)
  idempotency_key  String?        @unique @db.VarChar(100)

  user            Users          @relation(fields: [email], references: [email], onDelete: Cascade)
  orderItems      OrderItems[]
  discountCodeRef DiscountCodes? @relation("OrderDiscountCode", fields: [discount_code], references: [slug])

  @@index([created_at])
  @@index([email])
  @@index([created_at, email])
  @@index([status])
  @@index([discount_code])
  @@index([email, status])
}

model OrderItems {
  slug               String  @id @default(cuid())
  order_slug         String  @db.VarChar(100)
  product_variant_slug String? @db.VarChar(150)
  set_slug           String? @db.VarChar(100)
  item_type          String  @db.VarChar(20)
  quantity           Int     @db.SmallInt
  unit_price         Decimal @db.Decimal(10, 2)

  order   Orders          @relation(fields: [order_slug], references: [slug], onDelete: Cascade)
  variant ProductVariant? @relation(fields: [product_variant_slug], references: [slug], onDelete: Cascade)
  set     Sets?           @relation(fields: [set_slug], references: [slug], onDelete: Cascade)

  @@unique([order_slug, product_variant_slug, set_slug])
  @@index([order_slug])
  @@index([product_variant_slug])
  @@index([set_slug])
  @@index([item_type])
}

model DiscountCodes {
  slug                 String    @id @db.VarChar(50)
  created_at           DateTime  @default(now())
  expires_at           DateTime?
  discount_type        String    @db.VarChar(20)
  discount_value       Decimal   @db.Decimal(10, 2)
  max_uses             Int?      @db.SmallInt
  used_count           Int       @default(0) @db.SmallInt
  minimum_order_amount Decimal?  @db.Decimal(10, 2)
  is_active            Boolean   @default(true)
  orders               Orders[]  @relation("OrderDiscountCode")

  @@index([slug])
  @@index([created_at])
}

model CustomTransactions {
  slug        String   @id @default("general")
  amount      Decimal  @db.Decimal(10, 2)
}

```

</details>

---

## **Folder Structure**

This project uses the **Next.js App Router**, which organizes the application files within the `src/app` directory, this section shows some of the project's files.

<details>
<summary><strong>Click to expand/collapse details of the folder structure</strong></summary>

- **Root Directory (`/`)**

```bash
.
├── mobile
│   ├── app
│   │   ├── (drawer)
│   │   │   ├── _layout.tsx
│   │   │   └── (tabs)
│   │   │       ├── account.tsx
│   │   │       ├── index.tsx
│   │   │       ├── _layout.tsx
│   │   │       ├── sets.tsx
│   │   │       ├── store.tsx
│   │   │       └── tos.tsx
│   │   ├── _layout.tsx
│   │   └── +not-found.tsx
│   ├── app-env.d.ts
│   ├── app.json
│   ├── assets
│   │   ├── fonts
│   │   │   └── SpaceMono-Regular.ttf
│   │   └── images
│   │       ├── adaptive-icon.png
│   │       ├── anonymous.png
│   │       ├── favicon.png
│   │       ├── icon.png
│   │       ├── image-placeholder.png
│   │       └── splash-icon.png
│   ├── babel.config.js
│   ├── cesconfig.jsonc
│   ├── components
│   │   ├── ContactBox.tsx
│   │   ├── Footer.tsx
│   │   ├── ItemsSlider.tsx
│   │   ├── Logo.tsx
│   │   ├── MediaDisplay.tsx
│   │   ├── NewTag.tsx
│   │   ├── StarRating.tsx
│   │   ├── Typography.tsx
│   │   └── Underline.tsx
│   ├── constants
│   │   ├── config.ts
│   │   ├── language.ts
│   │   └── types
│   │       ├── data.d.ts
│   │       └── general.ts
│   ├── eslint.config.js
│   ├── global.css
│   ├── hooks
│   │   └── useApi.ts
│   ├── metro.config.js
│   ├── nativewind-env.d.ts
│   ├── package.json
│   ├── prettier.config.js
│   ├── styles
│   │   └── colors.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── utils
│       ├── api.ts
│       └── functions.ts
│
├── README.md
│
└── web
    ├── jsconfig.json
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.mjs
    ├── prisma
    │   └── schema.prisma
    ├── public
    │   └── icon.png
    ├── setup-files
    │   └── manage-users.js
    └── src
        ├── actions
        │   ├── authActions.js
        │   └── reviewActions.js
        ├── app
        │   ├── about
        │   │   └── page.js
        │   ├── account
        │   │   ├── layout.js
        │   │   ├── orders
        │   │   │   ├── page.js
        │   │   │   └── [slug]
        │   │   │       └── page.js
        │   │   ├── page.js
        │   │   └── wishlist
        │   │       └── page.js
        │   ├── admin
        │   │   ├── components
        │   │   │   ├── AdminHeader.js
        │   │   │   ├── AutoSlugifyButton.js
        │   │   │   ├── Backup.js
        │   │   │   ├── CustomTransactions.js
        │   │   │   ├── Dashboard.js
        │   │   │   ├── DiscountCalculator.js
        │   │   │   ├── forms
        │   │   │   │   ├── CashierForm.js
        │   │   │   │   ├── CategoryForm.js
        │   │   │   │   ├── CodesForm.js
        │   │   │   │   ├── GalleryForm.js
        │   │   │   │   ├── GeneralForm.js
        │   │   │   │   ├── PartnersForm.js
        │   │   │   │   ├── ProductForm.js
        │   │   │   │   ├── SetForm.js
        │   │   │   │   ├── TeamForm.js
        │   │   │   │   └── ThemesForm.js
        │   │   │   ├── HtmlEditor.js
        │   │   │   ├── ImageList.js
        │   │   │   ├── NavigationTabs.js
        │   │   │   ├── OrdersQuickStats.js
        │   │   │   ├── OrderView.js
        │   │   │   ├── ProductOptions.js
        │   │   │   ├── RelatedItemsSection.js
        │   │   │   ├── ReviewView.js
        │   │   │   ├── SearchProduct.js
        │   │   │   ├── SpamManagement.js
        │   │   │   └── TableDisplay.js
        │   │   ├── hooks
        │   │   │   ├── useEntityData.js
        │   │   │   └── useFormSubmit.js
        │   │   ├── layout.js
        │   │   ├── page.js
        │   │   └── utils
        │   │       ├── api-helpers.js
        │   │       ├── form-helpers.js
        │   │       └── image-helpers.js
        │   ├── api
        │   │   ├── auth
        │   │   │   ├── me
        │   │   │   │   └── route.js
        │   │   │   └── route.js
        │   │   ├── backup
        │   │   │   └── route.js
        │   │   ├── cleanup
        │   │   │   └── route.js
        │   │   ├── custom-transactions
        │   │   │   └── route.js
        │   │   ├── healthcheck
        │   │   │   └── route.js
        │   │   ├── pages-data
        │   │   │   └── [page]
        │   │   │       └── route.js
        │   │   ├── tables
        │   │   │   ├── route.js
        │   │   │   └── [table]
        │   │   │       └── [slug]
        │   │   │           └── route.js
        │   │   └── user
        │   │       ├── orders
        │   │       │   ├── [order]
        │   │       │   │   └── route.js
        │   │       │   └── route.js
        │   │       └── wishlist
        │   │           ├── route.js
        │   │           └── [slug]
        │   │               └── route.js
        │   ├── checkout
        │   │   ├── layout.js
        │   │   └── page.js
        │   ├── contact
        │   │   └── page.js
        │   ├── error.js
        │   ├── layout.js
        │   ├── loading.js
        │   ├── login
        │   │   ├── layout.js
        │   │   └── page.js
        │   ├── not-found.js
        │   ├── page.js
        │   ├── sets
        │   │   ├── page.js
        │   │   └── [slug]
        │   │       └── page.js
        │   ├── store
        │   │   ├── page.js
        │   │   └── [slug]
        │   │       └── page.js
        │   └── tos
        │       └── page.js
        ├── assets
        │   └── header-bg.png
        ├── components
        │   ├── account-components
        │   │   ├── MenuLink.js
        │   │   ├── OrderActions.js
        │   │   ├── Orders.js
        │   │   ├── SignOutButton.js
        │   │   ├── WishlistActions.js
        │   │   └── Wishlist.js
        │   ├── home-components
        │   │   ├── HomeListItems.js
        │   │   ├── HomePageSlider.js
        │   │   ├── Partners.js
        │   │   ├── PromotedComponent.js
        │   │   ├── Promotions.js
        │   │   ├── ScrollControls.js
        │   │   └── ScrollDots.js
        │   ├── others-components
        │   │   ├── CartSidebar.js
        │   │   ├── ContactBox.js
        │   │   ├── CopyBtn.js
        │   │   ├── ExpandableGallery.js
        │   │   ├── FloatingCartButton.js
        │   │   ├── Footer.js
        │   │   ├── HeaderAccount.js
        │   │   ├── HeaderForm.js
        │   │   ├── Header.js
        │   │   ├── Invoice.js
        │   │   ├── Logo.js
        │   │   ├── MediaDisplay.js
        │   │   ├── MobileNav.js
        │   │   ├── MultiRangeSlider.js
        │   │   ├── NavLink.js
        │   │   ├── NavWrapper.js
        │   │   ├── OpenCartBtn.js
        │   │   ├── SetsPagnination.js
        │   │   ├── Spinner.js
        │   │   ├── Stars.js
        │   │   ├── SystemTimeChecker.js
        │   │   └── ThemeScript.js
        │   └── store-components
        │       ├── ExpandableWrapper.js
        │       ├── ImageSelect.js
        │       ├── NewTag.js
        │       ├── ProductCard.js
        │       ├── ProductCardVariantsStatus.js
        │       ├── ProductDescription.js
        │       ├── ProductForm.js
        │       ├── RelatedProducts.js
        │       ├── RelatedSets.js
        │       ├── ReviewsForm.js
        │       ├── ReviewsItem.js
        │       ├── ReviewsList.js
        │       ├── ReviewsReplyForm.js
        │       └── StoreFilterOptions.js
        ├── context
        │   ├── AuthContext.js
        │   ├── ConfirmModal.js
        │   └── WishlistContext.js
        ├── helpers
        │   ├── config.js
        │   ├── functions.js
        │   ├── language-en.js
        │   ├── language.js
        │   └── server-functions.js
        ├── hooks
        │   ├── useIsMobile.js
        │   └── useOutsideClick.js
        ├── lib
        │   ├── auth.js
        │   ├── backup.js
        │   ├── data.js
        │   ├── db.js
        │   ├── email.js
        │   ├── get-ip.js
        │   ├── pages-data.js
        │   ├── rate-limiter-db.js
        │   ├── review.js
        │   ├── session.js
        │   └── wishlist.js
        └── styles
            ├── globals.css
            ├── react-paginate.css
            └── tos.css

```

</details>

---

_Last updated on September 17, 2025 by Ayman._
