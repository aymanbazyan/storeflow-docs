# Setup database

### 1. Setup PostgreSQL (Ubuntu)

1.  Download and install PostgreSQL.

    ```bash
    sudo apt update
    ```

    ```bash
    sudo apt install postgresql postgresql-contrib
    sudo service postgresql start
    ```

2.  Open the `psql` shell.

    ```bash
    sudo -u postgres psql
    ```

3.  Create your database.

    ```sql
    CREATE DATABASE 'your_database_name';
    ```

4.  Create an admin account.

    ```sql
    CREATE USER 'your_username' WITH ENCRYPTED PASSWORD 'your_password';
    ```

5.  Grant admin privileges to the new account.

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE 'your_database_name' TO 'your_username';
    ALTER USER 'your_username' CREATEDB;
    ```

    After these commands, type `\q` or `exit` to leave the `psql` prompt.

6.  Verify the database was created by connecting to it as the `postgres` superuser.

    ```bash
    sudo -u postgres psql -d 'your_database_name'
    ```

:::tip
Keep `<username>`, `<password>` and `<your_database_name>` for the next step.
:::

---

_Last updated on June 12, 2025 by Ayman._
