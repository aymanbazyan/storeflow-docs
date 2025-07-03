# Tech Stack & Concepts

## Tech Stack

- Frontend + Backend: Next.js

- Database: PostgreSQL, Prisma.

- Styling: Tailwind CSS

- API: Next.js API routes

- [Deployment: Vercel / Asura Hosting (soon)](/docs/Getting-Started/Deployment)

---

## **Database Schemas (Prisma)**

The single source of truth for the database structure is the `prisma/schema.prisma` file. It defines all models, relations, and indexes.

```mermaid
erDiagram
    Users {
        String slug PK
        DateTime created_at
        String email "unique"
        String passwordHash
        String displayName
        Boolean isAdmin
        String passwordResetToken "Optional, unique"
        DateTime passwordResetExpires "Optional"
        Boolean emailVerified "Optional"
        String emailVerificationToken "Optional, unique"
        DateTime emailVerificationExpires "Optional"
    }

    RequestLogs {
        Int slug PK
        String identifier
        DateTime timestamp
    }

    Categories {
        String slug PK
        String name
        String img "Optional"
        Boolean is_featured
        DateTime created_at
    }

    Config {
        String slug PK
        String tos "Optional"
        String about_us "Optional"
        String mission "Optional"
        String partners_description "Optional"
        String connect_description "Optional"
        String[] delivery_policies "Array"
        Boolean checkoutEnableCod
        Boolean checkoutEnableCreditCard
    }

    Products {
        String slug PK
        DateTime created_at
        String name
        Float price
        String category FK "Links to Categories.slug"
        String description
        Int discount
        Int quantity
        Int items_sold
        Boolean featured_promotion
        Boolean top_selling
        String[] images "Array"
        Float averageRating
        Int reviewCount
    }

    Reviews {
        String slug PK
        DateTime created_at
        DateTime updated_at
        Decimal rate
        String productSlug FK "Links to Products.slug"
        String userSlug FK "Links to Users.slug"
        String comment "Optional"
    }

    Sets {
        String slug PK
        String name
        String[] images "Array"
        String made_by
        String description
        String[] tags "Array"
        DateTime created_at
        Float price
        Float discount
        Int items_sold
        Boolean featured_promotion
        Boolean top_selling
    }

    SetComponents {
        String setSlug PK,FK "Links to Sets.slug"
        String productSlug PK,FK "Links to Products.slug"
        Int quantity "Quantity of product per set"
    }

    Team {
        String slug PK
        String name
        String role "Optional"
        String img "Optional"
        DateTime created_at
    }

    Partners {
        String slug PK
        String img
        DateTime created_at
    }

    Gallery {
        String slug PK
        String name
        String img
        DateTime created_at
    }

    Themes {
        String slug PK
        Json themeStringObj
        String headerTextColor "Optional"
        String img "Optional"
        DateTime created_at
    }

    Orders {
        String slug PK
        DateTime created_at
        String name
        String email FK "Links to Users.email"
        String address
        String city
        String region "Optional"
        String postal_code "Optional"
        String notes "Optional"
        String payment_method
        Decimal shipping_fee
        Decimal sub_total
        String phone
        String status
        String admin_note "Optional"
        Int items_qty
        String discount_code "Optional, FK to DiscountCodes.slug"
        Decimal discount_amount
        String idempotencyKey "Optional, unique"
    }

    OrderItems {
        String slug PK
        String order_slug FK "Links to Orders.slug"
        String product_slug "Optional, FK to Products.slug"
        String set_slug "Optional, FK to Sets.slug"
        String item_type "'product' or 'set'"
        Int quantity
        Decimal unit_price "Price at time of order"
    }

    DiscountCodes {
        String slug PK "The discount code text"
        DateTime created_at
        DateTime expires_at "Optional"
        String discount_type "'percentage' or 'fixed_amount'"
        Decimal discount_value
        Int max_uses "Optional"
        Int used_count
        Decimal minimum_order_amount "Optional"
        Boolean is_active
    }

    %% --- Relationships ---
    Users ||--o{ Orders : "places"
    Users }o--o{ Products : "wishlists"
    Users }o--o{ Sets : "wishlists"
    Users ||--o{ Reviews : "writes"

    Categories ||--o{ Products : "has"

    Products }o--o{ Products : "related to"
    Products ||--o{ SetComponents : "is part of"
    Products ||--o{ Reviews : "has"
    Products }o--|| OrderItems : "can be an"

    Sets }o--o{ Sets : "related to"
    Sets ||--|{ SetComponents : "is composed of"
    Sets }o--|| OrderItems : "can be an"

    Orders ||--|{ OrderItems : "contains"

    DiscountCodes }o--|{ Orders : "applies to"
```

---

## **Folder Structure**

This project utilizes the Next.js App Router, which organizes the application primarily within the `src/app` directory. The structure is designed to separate concerns, making it scalable and maintainable.

<details>
<summary><strong>Click to expand/collapse the detailed folder structure</strong></summary>

Here is a comprehensive breakdown of the project's architecture:

- **Root Directory (`/`)**

  - `.env.local`: **(Untracked)** Local environment variables. Contains secrets like database URLs and API keys.
  - `.env.local.example`: An example file for environment variables. New developers should copy this to `.env.local`.
  - `.eslintrc.json`: Configuration for ESLint, our code linter.
  - `.gitignore`: Specifies files and folders to be ignored by Git (e.g., `node_modules`, `.env.local`).
  - `jsconfig.json`: Configures path aliases (e.g., `@/components`) for easier imports.
  - `next.config.mjs`: The main configuration file for Next.js.
  - `package.json`: Lists project dependencies, metadata, and scripts (e.g., `npm run dev`).
  - `postcss.config.mjs`: Configuration for PostCSS, used by Tailwind CSS.
  - `README.md`: This documentation file.

- **`backups/`**: Directory for storing database or application backups. _(Note: This should typically be in `.gitignore` to avoid committing large backup files to the repository)._

- **`prisma/`**: Contains all database-related configurations for the Prisma ORM.

  - `schema.prisma`: The primary schema file defining all database models and relations.
  - `dev.db`: **(Untracked)** A local SQLite database file, likely used for development.

- **`public/`**: Stores static assets that are publicly accessible from the root URL.
- **`uploads/`**: Stores assets of the store's items.

  - `icon.png`: Application icon, likely used as a favicon.

- **`setup-files/`**: Contains utility scripts for project setup or maintenance.

  - `manage-users.js`: A script to create fake accounts for testing and grant/revoke admin privileges from any account.
  - `seed-fake-info.js`: A script to populate the database with dummy data for testing.

- **`src/`**: The main source code for the entire application.
  - `middleware-out.js`: A build artifact from Next.js middleware compilation.
  - **`app/`**: The core of the Next.js application, using the App Router.
    - `layout.js`, `page.js`, `error.js`, `loading.js`, `not-found.js`: Root-level special files that define the main layout, homepage, and global states.
    - **`about/`**: The "About Us" page.
    - **`account/`**: The user's private account section.
      - `orders/`: Displays a user's order history and details for a specific order (`[slug]`).
      - `wishlist/`: The user's product wishlist.
    - **`admin/`**: The protected admin dashboard for managing the store.
      - `components/`: React components used exclusively within the admin dashboard.
        - `forms/`: A well-organized set of forms for creating/editing every data model (Products, Categories, etc.).
      - `hooks/`: Custom React hooks specific to the admin panel.
      - `utils/`: Helper functions for admin-related tasks.
    - **`api/`**: Backend API endpoints (Route Handlers).
      - `auth/`: Handles user authentication (login, signout, session check).
      - `backup/`: API endpoint to trigger a server backup.
      - `uploads/[...path]`: API endpoint to get uploaded files.
      - `cron/`: Endpoints designed to be called by scheduled jobs (e.g., cleanup tasks).
      - `tables/`: A generic, dynamic API for performing CRUD operations on database tables, likely used by the admin panel.
      - `user/`: API routes for user-specific actions like managing wishlists and orders.
    - **`checkout/`**: The order checkout page and flow.
    - **`contact/`**: The "Contact Us" page.
    - **`login/`**: The user login page.
    - **`sets/`**: Pages for displaying product sets/bundles.
    - **`store/`**: The main product browsing pages, including the main store page and individual product detail pages (`[slug]`).
    - **`tos/`**: The "Terms of Service" page.
  - **`actions/`**: Contains Next.js Server Actions, used for server-side form submissions and mutations.
    - `authActions.js`: Server actions related to authentication.
  - **`assets/`**: Static assets like images and fonts that are part of the build process.
  - **`components/`**: Global, reusable React components shared across the application.
    - `account-components/`: Components specific to the user account section.
    - `home-components/`: Components used only on the homepage.
    - `others-components/`: Common, shared components like `Header`, `Footer`, `Spinner`, etc.
    - `store-components/`: Components used in the product browsing and detail pages.
  - **`context/`**: React Context providers for managing global state.
    - `ConfirmModal.js`: A context for a global confirmation dialog.
  - **`helpers/`**: General-purpose utility functions that are not tied to a specific framework feature.
  - **`hooks/`**: Global, reusable React hooks.
  - **`lib/`**: Core library code, services, and backend utilities.
    - `auth.js`, `session.js`: Core authentication logic.
    - `db.js`: Initializes and exports the Prisma client instance.
    - `email.js`: Service for sending emails.
    - `rate-limiter-db.js`: Logic for API rate limiting.
  - **`styles/`**: Global stylesheets.
    - `globals.css`: Main stylesheet for Tailwind CSS and other global styles.

</details>

---

_Last updated on July 2, 2025 by Ayman._
