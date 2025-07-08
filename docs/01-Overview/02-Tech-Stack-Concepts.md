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

### Diagram 1: E-commerce & Order Processing

```mermaid
erDiagram
    Users {
        string slug PK
        string email UK
        string displayName
    }

    Orders {
        string slug PK
        string name
        string email FK
        string address
        string phone
        string status
        decimal sub_total
        decimal shipping_fee
        string payment_method
        string discount_code FK
        decimal discount_amount
        datetime created_at
    }

    OrderItems {
        string slug PK
        string order_slug FK
        string product_slug FK "nullable"
        string set_slug FK "nullable"
        string item_type
        int quantity
        decimal unit_price
    }

    DiscountCodes {
        string slug PK
        string discount_type
        decimal discount_value
        boolean is_active
        datetime expires_at
    }

    %% Tables from other domains shown for context
    Products {
      string slug PK
      string name
    }

    Sets {
      string slug PK
      string name
    }

    %% Relationships
    Users ||--o{ Orders : "places"
    Orders ||--o{ OrderItems : "contains"
    DiscountCodes ||--o{ Orders : "applied to"
    OrderItems }o--|| Products : "references"
    OrderItems }o--|| Sets : "references"
```

---

### Diagram 2: Product Catalog & Inventory

```mermaid
erDiagram
    Categories {
        string slug PK
        string name
        string img
        boolean is_featured
    }

    Products {
        string slug PK
        string name
        float price
        string category FK
        int quantity
        int items_sold
        boolean is_new
        string[] images
    }

    Sets {
        string slug PK
        string name
        float price
        int items_sold
        string made_by
        string[] images
    }

    SetComponents {
        string setSlug PK,FK
        string productSlug PK,FK
        int quantity
    }

    %% Relationships
    Categories ||--o{ Products : "categorizes"
    Products }o--o{ Products : "related to"
    Sets }o--o{ Sets : "related to"

    Products ||--o{ SetComponents : "part of"
    Sets ||--o{ SetComponents : "composed of"
```

---

### Diagram 3: User Interaction & Reviews

```mermaid
erDiagram
    Users {
        string slug PK
        string email UK
        string displayName
    }

    Reviews {
        string slug PK
        decimal rate
        string comment
        string userSlug FK
        string productSlug FK "nullable"
        string setSlug FK "nullable"
        datetime created_at
    }

    %% Tables from other domains shown for context
    Products {
        string slug PK
        string name
        float averageRating
        int reviewCount
    }

    Sets {
        string slug PK
        string name
        float averageRating
        int reviewCount
    }

    %% Relationships
    Users ||--o{ Reviews : "writes"
    Products ||--o{ Reviews : "has"
    Sets ||--o{ Reviews : "has"

    Users }o--o{ Products : "wishlists"
    Users }o--o{ Sets : "wishlists"
```

---

### Diagram 4: Site Content & System

```mermaid
erDiagram
    Config {
        string slug PK
        string tos
        string about_us
        string mission
        string[] delivery_policies
        boolean checkoutEnableCod
    }

    Themes {
        string slug PK
        json themeStringObj
        string headerTextColor
        string img
    }

    Gallery {
        string slug PK
        string name
        string img
        datetime updated_at
    }
```

```mermaid
erDiagram
    Team {
        string slug PK
        string name
        string role
        string img
    }

    Partners {
        string slug PK
        string img
        datetime created_at
    }

    RequestLogs {
        int slug PK
        string identifier
        datetime timestamp
    }
```

---

## **Folder Structure**

This project uses the **Next.js App Router**, which organizes the application files within the `src/app` directory, this section shows some of the project's files.

<details>
<summary><strong>Click to expand/collapse the detailed folder structure</strong></summary>

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
  <!-- - `middleware-out.js`: A build artifact from Next.js middleware compilation. -->

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
    - `reviews.js`: Server actions related to reviews.
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
    - `...and more`
  - **`styles/`**: Global stylesheets.
    - `globals.css`: Main stylesheet for Tailwind CSS and other global styles.

</details>

---

_Last updated on July 7, 2025 by Ayman._
