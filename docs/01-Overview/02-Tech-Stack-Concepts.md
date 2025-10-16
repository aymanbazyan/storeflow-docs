# Tech Stack & Concepts

## **Tech Stack**

- **Frontend + Backend**: Next.js v15.5.0 (App Router)
- **Database**: PostgreSQL v16.9 + Prisma v6.17.1
- **Styling**: Tailwind CSS v4
- **API**: Next.js API routes
- **Mobile**: React Native 0.81.4 + Expo 54.0.7
- **Deployment**: [Docker / Asura Hosting (soon)](/docs/Setup-Store/Deployment)

**Fully Dockerized**: The application is containerized with Docker, making deployment simple and consistent across different environments. No need to manually install PostgreSQL, Node.js, or manage dependencies - just run `docker-compose up` and you're ready to go.

---

## **Core Architecture**

- **Authentication:** JWT-based sessions using HTTPS-only cookies and HS256 encryption
- **File Storage:** Local filesystem with Docker volume mounting
- **Email Service:** Nodemailer with Gmail SMTP (changeable via .env)
- **Rate Limiting:** Database-backed rate limiter for security
- **Real-time Updates:** Server-Sent Events for live order updates on the Admin panel

---

## **Database Schemas (Prisma)**

The single source of truth for the database structure is the `prisma/schema.prisma` file. It defines all models, relations, and indexes.

**Note: These visual diagrams are simplified, not complete, and have wrong naming; more details below.**

### Diagram 1: E-commerce & Order Processing

```mermaid
erDiagram
    User {
        String slug PK
        String email UK
        String displayName
        String passwordHash
        Boolean isAdmin
        Boolean emailVerified
        DateTime createdAt
    }

    Order {
        String slug PK
        String userEmail FK
        String status
        Decimal subTotal
        Decimal shippingFee
        String paymentMethod
        String discountCodeSlug FK "optional"
        Decimal discountAmount
        Int itemsQty
        DateTime createdAt
        String idempotencyKey "optional, UK"
    }

    OrderItem {
        String slug PK
        String orderSlug FK
        String productVariantSlug FK "optional"
        String setSlug FK "optional"
        String itemType
        Int quantity
        Decimal unitPrice
    }

    DiscountCode {
        String slug PK
        String discountType
        Decimal discountValue
        Boolean isActive
        Int usedCount
        DateTime expiresAt "optional"
        DateTime createdAt
    }

    ProductVariant {
        String slug PK
        String name
        Float price
    }

    Set {
        String slug PK
        String name
        Float price
    }

    User ||--o{ Order : "places"
    Order ||--o{ OrderItem : "contains"
    DiscountCode }o--|| Order : "applies to"
    ProductVariant }o--o{ OrderItem : "can be part of"
    Set }o--o{ OrderItem : "can be part of"
```

### Diagram 2: Product Catalog & Inventory

```mermaid
erDiagram
    Category {
        String slug PK
        String name
        String img "optional"
        Boolean isFeatured
        DateTime createdAt
    }

    Brand {
        String slug PK
        String name UK
        String description "optional"
        DateTime createdAt
    }

    Product {
        String slug PK
        String name
        String categorySlug FK
        String brandSlug FK "optional"
        Int itemsSold
        Float averageRating
        Int reviewCount
        String[] images
        Boolean featuredPromotion
        Boolean topSelling
        Boolean isNew
        DateTime createdAt
    }

    ProductVariant {
        String slug PK
        String productSlug FK
        String name
        Float price
        Int discount
        Int quantity
        DateTime createdAt
    }

    Set {
        String slug PK
        String name
        Float price
        Int itemsSold
        Float averageRating
        Int reviewCount
        String[] images
        Boolean featuredPromotion
        Boolean topSelling
        Boolean isNew
        DateTime createdAt
    }

    SetComponent {
        String setSlug PK, FK
        String productVariantSlug PK, FK
        Int quantity
    }

    Category ||--o{ Product : "contains"
    Brand ||--o{ Product : "has"
    Product ||--o{ ProductVariant : "has"
    Product }o--o{ Product : "relates to"
    Set }o--o{ Set : "relates to"
    Set ||--o{ SetComponent : "is composed of"
    ProductVariant ||--o{ SetComponent : "is a component of"
```

### Diagram 3: User Interaction & Reviews

```mermaid
erDiagram
    User {
        String slug PK
        String email UK
        String displayName
        Boolean isAdmin
        Boolean emailVerified
        String passwordResetToken "optional, UK"
        String emailVerificationToken "optional, UK"
    }

    Review {
        String slug PK
        String userSlug FK
        String productSlug "FK, optional"
        String setSlug "FK, optional"
        String parentReviewSlug "FK, optional"
        DateTime createdAt
        DateTime updatedAt
        Decimal rate
        String comment "optional"
        Boolean isReply
    }

    Product {
        String slug PK
        String name
        Float averageRating
        Int reviewCount
    }

    Set {
        String slug PK
        String name
        Float averageRating
        Int reviewCount
    }

    %% --- Relationships ---

    User ||--o{ Review : "writes"
    Product ||--o{ Review : "receives"
    Set ||--o{ Review : "receives"

    %% Self-referencing relationship for replies
    Review ||--o{ Review : "replies to"

    %% Wishlist relationships
    User }o--o{ Product : "wishlists"
    User }o--o{ Set : "wishlists"
```

### Diagram 4: Site Content & System

```mermaid
erDiagram
    Config {
        String slug PK
        String tos "optional"
        String aboutUs "optional"
        String mission "optional"
        Boolean checkoutEnableCod
        Boolean checkoutEnableBankTransfer
    }

    Theme {
        String slug PK
        Json themeStringObj
        String headerTextColor "optional"
        String img "optional"
    }

    Team {
        String slug PK
        String name
        String role "optional"
        String img "optional"
        DateTime createdAt
    }
```

```mermaid
erDiagram

    Partner {
        String slug PK
        String img
        DateTime createdAt
    }

    Gallery {
        String slug PK
        String name
        String img
        DateTime createdAt
        DateTime updatedAt
    }

    RequestLog {
        Int slug PK
        String identifier
        String type
        String description
        DateTime createdAt
    }
```

    ```mermaid

erDiagram

    TimedoutIp {
        String slug PK "IP Address"
        DateTime createdAt
        DateTime timedoutUntil
    }

     CustomTransaction {
        String slug PK
        Decimal amount
    }

Feedback {
String slug PK
DateTime createdAt
FeedbackType type
String message
Boolean isClosed
}

````

    ```mermaid

erDiagram

    Ad {
String slug PK
        DateTime createdAt
        String name
        String img
        String link
        String description
    }


````

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

model User {
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
  orders                   Order[]
  wishlist                 Product[]
  wishlistSets             Set[]     @relation("UserWishlistSets")
  reviews                  Review[]

  @@index([email])
  @@index([is_admin])
  @@index([email_verified])
  @@index([email_verified, created_at])
  @@index([created_at])
}

model RequestLog {
  slug          Int      @id @default(autoincrement())
  identifier    String
  type          String   // "review", "checkout", "auth"
  created_at    DateTime @default(now())
  description   String   @default("")

  @@index([identifier, type])
  @@index([identifier, type, created_at])
  @@index([created_at])
}

model TimedoutIp {
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
  checkout_enable_bank_transfer  Boolean  @default(false)
  bank_accounts        String[] @default(["Here are our bank accounts:-","Bank of Palestine: 1234567890"])
  // checkout_enable_credit_card Boolean  @default(false)
  // checkout_enable_paypal      Boolean  @default(false)
}

model Category {
  slug        String     @id @db.VarChar(100)
  name        String     @db.VarChar(100)
  img         String?    @default("") @db.VarChar(255)
  is_featured Boolean    @default(false)
  created_at  DateTime   @default(now())

  product    Product[]

  @@index([is_featured])
  @@index([created_at])
}

model Brand {
  slug         String     @id @db.VarChar(100)
  name         String     @unique @db.VarChar(100)
  description  String?    @db.Text
  created_at   DateTime   @default(now())

  products     Product[]

  @@index([name])
  @@index([created_at])
}

// The parent product, holds shared data
model Product {
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
  brand_slug          String?     @db.VarChar(100)

  // DENORMALIZED
  min_price           Float      @default(0) @db.DoublePrecision
  max_price           Float      @default(0) @db.DoublePrecision
  max_discount        Int        @default(0) @db.SmallInt

  search_vector      Unsupported("tsvector")? // search by name/slug for now

  categoryRef        Category       @relation(fields: [category], references: [slug], onDelete: Cascade)
  wishlistedBy       User[]
  relatedProducts    Product[]       @relation("ProductRelations")
  relatedTo          Product[]       @relation("ProductRelations")
  reviews            Review[]
  variants           ProductVariant[] // A product has many variants
  brand              Brand?      @relation(fields: [brand_slug], references: [slug], onDelete: Restrict)

  @@index([category])
  @@index([brand_slug])
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
  @@index([category, brand_slug])
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

  product     Product     @relation(fields: [product_slug], references: [slug], onDelete: Cascade)
  orderItems  OrderItem[]
  setComponents SetComponent[]

  @@index([product_slug])
  @@index([price])
  @@index([quantity])
  @@index([name])
  @@index([discount])
  @@index([product_slug, price])
  @@index([product_slug, discount])
}

model Review {
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
  product      Product?  @relation(fields: [product_slug], references: [slug], onDelete: Cascade)
  set          Set?      @relation(fields: [set_slug], references: [slug], onDelete: Cascade)
  user         User      @relation(fields: [user_slug], references: [slug], onDelete: Cascade)

  // Self-referential relation for replies
  parent_review Review?   @relation("ReviewReplies", fields: [parent_review_slug], references: [slug], onDelete: Cascade)
  replies       Review[]  @relation("ReviewReplies")

  @@index([user_slug])
  @@index([created_at])
  @@index([product_slug, updated_at, created_at])
  @@index([set_slug, updated_at, created_at])
  @@index([parent_review_slug])
  @@index([product_slug, is_reply])
  @@index([set_slug, is_reply])
}

model Set {
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

  components         SetComponent[]
  orderItems         OrderItem[]
  relatedProducts   Set[]          @relation("SetRelations")
  relatedTo         Set[]          @relation("SetRelations")
  wishlistedBy       User[]         @relation("UserWishlistSets")
  reviews            Review[]

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

model SetComponent {
  set_slug           String @db.VarChar(100)
  product_variant_slug String @db.VarChar(150)
  quantity          Int    @db.SmallInt

  set     Set           @relation(fields: [set_slug], references: [slug], onDelete: Cascade)
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

model Partner {
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

model Theme {
  slug            String   @id @default("general") @db.VarChar(50)
  theme_string_obj  Json     @default("{\"primary\":\"blue\",\"secondary\":\"violet\"}")
  header_text_color String?  @default("text-black") @db.VarChar(100)
  img             String?  @default("") @db.VarChar(255)
}

model Order {
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

  discount_code   String?        @db.VarChar(70)
  discount_amount Decimal        @default(0) @db.Decimal(10, 2)
  idempotency_key  String?        @unique @db.VarChar(100)

  user            User          @relation(fields: [email], references: [email], onDelete: Cascade)
  orderItems      OrderItem[]
  discountCodeRef DiscountCode? @relation("OrderDiscountCode", fields: [discount_code], references: [slug])

  @@index([created_at])
  @@index([email])
  @@index([created_at, email])
  @@index([status])
  @@index([discount_code])
  @@index([email, status])
}

model OrderItem {
  slug               String  @id @default(cuid())
  order_slug         String  @db.VarChar(100)
  product_variant_slug String? @db.VarChar(150)
  set_slug           String? @db.VarChar(100)
  item_type          ItemType
  quantity           Int     @db.SmallInt
  unit_price         Decimal @db.Decimal(10, 2)

  order   Order          @relation(fields: [order_slug], references: [slug], onDelete: Cascade)
  variant ProductVariant? @relation(fields: [product_variant_slug], references: [slug], onDelete: Cascade)
  set     Set?           @relation(fields: [set_slug], references: [slug], onDelete: Cascade)

  @@unique([order_slug, product_variant_slug, set_slug])
  @@index([order_slug])
  @@index([product_variant_slug])
  @@index([set_slug])
  @@index([item_type])
}

model DiscountCode {
  slug                 String    @id @db.VarChar(70)
  created_at           DateTime  @default(now())
  expires_at           DateTime?
  discount_type        String    @db.VarChar(20)
  discount_value       Decimal   @db.Decimal(10, 2)
  max_uses             Int?      @db.SmallInt
  used_count           Int       @default(0) @db.SmallInt
  minimum_order_amount Decimal?  @db.Decimal(10, 2)
  is_active            Boolean   @default(true)
  orders               Order[]  @relation("OrderDiscountCode")

  @@index([slug])
  @@index([created_at])
}

model CustomTransaction {
  slug        String   @id @default("general")
  amount      Decimal  @db.Decimal(10, 2)
}

model Feedback {
  created_at   DateTime     @default(now())
  slug         String       @id @default(cuid())
  type         FeedbackType
  message      String       @db.Text
  is_closed    Boolean      @default(false)

  @@index([created_at])
  @@index([is_closed])
}

model Ad {
  created_at   DateTime     @default(now())
  slug         String       @id
  name         String?     @default("")
  link         String?     @default("")
  img          String?     @default("") @db.VarChar(255)
  description  String?     @default("") @db.Text

  @@index([created_at])
}

enum ItemType {
  PRODUCT
  SET
}

enum FeedbackType {
  BUG
  FEATURE
  IMPROVEMENT
  GENERAL
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
│   │   │       ├── login.tsx
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
│   │   ├── BrandFilterDropdown.tsx
│   │   ├── ContactBox.tsx
│   │   ├── Footer.tsx
│   │   ├── ItemsSlider.tsx
│   │   ├── Logo.tsx
│   │   ├── MediaDisplay.tsx
│   │   ├── MultiRangeSlider.tsx
│   │   ├── NewTag.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchForm.tsx
│   │   ├── StarRating.tsx
│   │   ├── Typography.tsx
│   │   └── Underline.tsx
│   ├── constants
│   │   ├── config.ts
│   │   ├── language.ts
│   │   └── types
│   │       ├── data.d.ts
│   │       └── general.ts
│   ├── context
│   │   └── AppDataContext.tsx
│   ├── eslint.config.js
│   ├── global.css
│   ├── hooks
│   │   ├── useApi.ts
│   │   └── useDebounce.ts
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
└── web
    ├── docker-compose.dev.yml
    ├── docker-compose.yml
    ├── docker-entrypoint.sh
    ├── Dockerfile
    ├── jsconfig.json
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.mjs
    ├── prisma
    │   └── schema.prisma
    ├── public
    │   ├── help-page
    │   │   ├── help-auto-slug.png
    │   │   ├── help-copy-html-1.png
    │   │   ├── help-copy-html-2.png
    │   │   ├── help-copy-html-3.png
    │   │   ├── help-html-example.png
    │   │   ├── help-open-html-editor-1.png
    │   │   ├── help-open-html-editor-2.png
    │   │   ├── help-order-life-cycle-1.png
    │   │   ├── help-order-life-cycle-2.png
    │   │   └── help-slug-in-url.png
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
        │   │   │   ├── CustomTransaction.js
        │   │   │   ├── Dashboard.js
        │   │   │   ├── DiscountCalculator.js
        │   │   │   ├── Feedback.js
        │   │   │   ├── forms
        │   │   │   │   ├── AdForm.js
        │   │   │   │   ├── BrandForm.js
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
        │   │   │   ├── Help.js
        │   │   │   ├── HtmlEditor.js
        │   │   │   ├── ImageList.js
        │   │   │   ├── NavigationTabs.js
        │   │   │   ├── OrdersQuickStats.js
        │   │   │   ├── OrderView.js
        │   │   │   ├── ProductOptions.js
        │   │   │   ├── RelatedItemsSection.js
        │   │   │   ├── ResetForm.js
        │   │   │   ├── ReviewView.js
        │   │   │   ├── SearchProduct.js
        │   │   │   ├── SpamManagement.js
        │   │   │   └── TableDisplay.js
        │   │   ├── hooks
        │   │   │   ├── useDebouncedSearch.js
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
        │   │   ├── feedback
        │   │   │   └── route.js
        │   │   ├── healthcheck
        │   │   │   └── route.js
        │   │   ├── live
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
        │   ├── feedback
        │   │   └── page.js
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
        │       ├── BrandDescription.js
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
        │   ├── client-functions.js
        │   ├── config.js
        │   ├── functions.js
        │   ├── language-ar.js (unused)
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
        │   ├── event-emitter.js
        │   ├── get-ip.js
        │   ├── pages-data.js
        │   ├── rate-limiter-db.js
        │   ├── review.js
        │   ├── session.js
        │   └── wishlist.js
        ├── middleware-out.js
        └── styles
            ├── globals.css
            └── react-paginate.css
```

</details>

---

_Last updated on October 16, 2025 by Ayman._
