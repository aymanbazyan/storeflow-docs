# Deployment

### Prerequisites

- A Linux machine (VPS or Home PC with Ubuntu).
- The project running locally (e.g., on `localhost:3000` via Docker).
- Access to your Router (if hosting from home) to forward ports.

#### Server requirements

| Traffic Tier | Monthly Visits (Est.) | CPU (vCores) | RAM (Memory)  | Storage (SSD/NVMe) |
| :----------- | :-------------------- | :----------- | :------------ | :----------------- |
| **Low**      | < 10,000              | **2 vCPUs**  | **4 GB**      | 40 GB              |
| **Medium**   | 10k - 100k            | **4 vCPUs**  | **8 - 16 GB** | 80 GB              |
| **High**     | 100k - 500k+          | **8+ vCPUs** | **32 GB+**    | 160 GB+            |

#### Storage Requirements (Disk)

Storage needs are calculated based on the number of products in your catalog.

**Assumptions for Calculation:**

- **Average Images per Product:** 3.5
- **Avg Image Size:** 2MB (High Res Source) + Next.js Optimized Cache Variants.
- **Database Growth:** Includes product metadata, user accounts, and order history logs.

| Scale          | Product Count | Est. Image Count | Database Vol (Postgres) | Media Vol (Local Uploads) | **Total Disk Rec.** |
| :------------- | :------------ | :--------------- | :---------------------- | :------------------------ | :------------------ |
| **Startup**    | **2,000**     | ~7,000           | 1 GB                    | ~15 GB                    | **25 GB SSD**       |
| **Growth**     | **10,000**    | ~35,000          | 5 GB                    | ~75 GB                    | **100 GB NVMe**     |
| **Scale**      | **50,000**    | ~175,000         | 20 GB                   | ~375 GB                   | **500 GB NVMe**     |
| **Enterprise** | **100,000+**  | ~350,000+        | 50 GB+                  | ~750 GB+                  | **1 TB+ NVMe**      |

---

## VPS Deployment: Optimize with Pre-Built Cache (Optional)

**Performance Boost:** If you're deploying to a VPS (DigitalOcean, AWS, Linode, etc.), you can transfer a pre-built cache to skip the 5-10 minute build process and start your app in ~30-60 seconds!

**Skip this section if you're self-hosting at home** - you can build directly on your machine.

### On Your Local Machine:

1. **Build the Docker cache locally:**

   ```bash
   docker-compose up --build
   ```

   This creates `.docker-cache/node_modules` and `.docker-cache/.next` in your project directory.

2. **Create a compressed archive:**
   ```bash
   tar -czf docker-cache.tar.gz .docker-cache
   ```
3. **Check the archive size:**

   ```bash
   ls -lh docker-cache.tar.gz
   # Typically 200-500MB
   ```

4. **Transfer to your VPS:**

   ```bash
   # Replace with your VPS details
   scp docker-cache.tar.gz user@your-vps-ip:/path/to/project/
   ```

   **Alternative - use rsync for faster incremental transfers:**

   ```bash
   rsync -avz --progress docker-cache.tar.gz user@your-vps-ip:/path/to/project/
   ```

### On Your VPS:

1. **Extract the cache:**

   ```bash
   cd /path/to/project
   tar -xzf docker-cache.tar.gz
   ```

2. **Verify extraction:**

   ```bash
   ls -la .docker-cache/
   # Should show: node_modules/ and .next/
   ```

3. **Clean up the archive (optional):**
   ```bash
   rm docker-cache.tar.gz
   ```

**Result:** When you run `docker-compose up` later, it will use the pre-built cache instead of rebuilding everything from scratch!

:::info
If you skip this step, Docker will build everything on the VPS (takes 5-10 minutes on first run).
:::

---

## Option 1: Self-Hosting with Nginx

This guide covers how to host this project on your own Linux machine (Ubuntu/Debian) using Nginx as a Reverse Proxy. This allows you to expose the app to the internet securely using your own domain or a dynamic DNS.

Instead of using our plain IP address, we'll use [**DuckDNS**](https://www.duckdns.org/) for testing for now.

---

### Step 1: Network Setup (Port Forwarding)

_If you are using a Cloud VPS (DigitalOcean, AWS), skip to Step 2._

1.  **Set a Static IP:** Ensure your host computer has a fixed local IP (e.g., `192.168.1.100`).
2.  **Login to Router:** Access your router admin page (usually `192.168.1.1` or `192.168.1.254`).
3.  **Forward Ports:** Create two rules pointing to your computer's local IP:
    - **Port 80** (HTTP) ➔ **Port 80**
    - **Port 443** (HTTPS) ➔ **Port 443**

---

### Step 2: Install Nginx

On your host machine, run:

```bash
sudo apt update
sudo apt install nginx
sudo ufw allow 'Nginx Full'  # Open Firewall
```

Verify it is running by visiting your IP address in a browser. You should see the "Welcome to nginx!" page.

---

### Step 3: Configure the Reverse Proxy

We need to tell Nginx to take traffic from the internet and forward it to your app running on port 3000.

1.  **Create a config file:**

    ```bash
    sudo nano /etc/nginx/conf.d/storeflow.conf
    ```

2.  **Paste the following configuration:**
    _Replace `your-domain.duckdns.org` with your actual domain or Public IP._

```nginx
user  nginx;
# Auto usually maps to CPU cores.
worker_processes  auto;

# CRITICAL: Increases the limit of open files the OS allows Nginx to use.
# Must be higher than worker_connections * worker_processes
worker_rlimit_nofile 65535;

error_log  /var/log/nginx/error.log notice;
pid        /run/nginx.pid;

events {
    # CRITICAL: Allows handling 10k+ simultaneous connections
    worker_connections  10240;

    # Optimizes connection processing on Linux
    use epoll;

    # Allows a worker to accept all new connections at once
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # OPTIMIZATION: Buffer logs to save Disk I/O during high traffic
    # Writes to disk only when 32k buffer is full or every 3 seconds
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main buffer=32k flush=3s;

    sendfile        on;
    tcp_nopush      on; # Optimizes sending headers + files
    tcp_nodelay     on; # Don't buffer data-sends (faster feeling for users)

    client_max_body_size 100G;

    # Lower timeout to close dead connections faster to free up slots for new 10k users
    keepalive_timeout  30;
    client_body_timeout 10;
    client_header_timeout 10;

    # Rate Limiting
    # Increased to 100r/s to handle your "40+ requests" requirement comfortably
    # 10m zone can store states for ~160,000 IP addresses
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=100r/s;

    # UPSTREAM CONFIGURATION
    # Keeps connections to your backend open so we don't reconnect 10,000 times/sec
    upstream backend_app {
        server localhost:3000;
        keepalive 64;
    }

    # =========================================================
    # BLOCK 1: HTTPS
    # =========================================================
    server {
        server_name spring-hardware.duckdns.org;
        listen 443 ssl;
        # HTTP/2 is highly recommended for loading 40+ images in parallel
        http2 on;

        ssl_certificate /etc/letsencrypt/live/spring-hardware.duckdns.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/spring-hardware.duckdns.org/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            # Burst=200 allows a user to "spike" 200 requests instantly (rendering the page)
            # nodelay ensures they are processed immediately, not slowed down
            limit_req zone=mylimit burst=200 nodelay;

            proxy_pass http://backend_app;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade"; # Important for websockets
            proxy_set_header Host $http_host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # =========================================================
    # BLOCK 2: HTTP
    # =========================================================
    server {
        listen 80;
        server_name spring-hardware.duckdns.org;

        location / {
            # Consistent limits with HTTPS
            limit_req zone=mylimit burst=200 nodelay;

            proxy_pass http://backend_app;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /api/live {
            proxy_buffering off;
            proxy_cache off;

            proxy_pass http://backend_app;

            proxy_http_version 1.1;
            # Connection set to Upgrade or keep-alive depending on need,
            # usually "" allows keepalive to upstream
            proxy_set_header Connection "";
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    include /etc/nginx/conf.d/*.conf;
}
```

3.  **Save and Exit:** `Ctrl + X`, then `Y`, then `Enter`.

4.  **Test and Reload:**
    ```bash
    sudo nginx -t                # Check for typos
    sudo systemctl reload nginx  # Apply changes
    ```

Your app should now be accessible via `http://your-domain.duckdns.org`.

---

### Step 4: Enable HTTPS (SSL) 🔒

Secure your connection with a free Let's Encrypt certificate.

1.  **Install Certbot:**

    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

2.  **Generate Certificate:**

    ```bash
    sudo certbot --nginx -d your-domain.duckdns.org
    ```

3.  **Follow the prompts:**
    - Enter email for renewal notices.
    - Select **"Redirect"** (Option 2) to force HTTPS automatically.

Your site is now live and secure at `https://your-domain.duckdns.org`.

---

## VPS Cache Management (For Cloud VPS Deployments Only)

If you deployed to a cloud VPS and used the pre-built cache from earlier, here's how to manage it:

### Updating Your App with Cache

When you need to deploy updates:

**Method 1: Full Cache Transfer (Recommended for major updates)**

```bash
# On local machine:
docker-compose up --build
tar -czf docker-cache.tar.gz .docker-cache
scp docker-cache.tar.gz user@vps:/path/to/project/

# On VPS:
cd /path/to/project
docker-compose down
tar -xzf docker-cache.tar.gz
docker-compose up -d
```

**Method 2: Incremental Sync (Faster for minor updates)**

```bash
# On local machine:
rsync -avz --progress .docker-cache/ user@vps:/path/to/project/.docker-cache/

# On VPS:
docker-compose restart app
```

### Clearing Cache on VPS

If you encounter issues or need to force a rebuild:

```bash
# Stop containers
docker-compose down

# Remove cache
rm -rf .docker-cache

# Rebuild (will take 5-10 minutes)
docker-compose up --build -d
```

### Checking Cache Status

```bash
# View cache size
du -sh .docker-cache/node_modules
du -sh .docker-cache/.next

# View total cache size
du -sh .docker-cache
```

<!-- ---

### Advanced: Password Protection 🔐

If this is a private internal tool, you can password-protect the entire site using Nginx.

1.  **Install utils:** `sudo apt install apache2-utils`
2.  **Create User:** `sudo htpasswd -c /etc/nginx/.htpasswd myuser`
3.  **Update Config:** Add these lines inside the `location /` block of your config file:
    ```nginx
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    ```
4.  **Reload:** `sudo systemctl reload nginx` -->

---

# And you can use any other method, like Asura hosting, Ngrok, and others.

---

> ## Search Engine Indexing

[Google search index](https://www.google.com/search/create/new) (soon)

---

_Last updated on January 30, 2026 by Ayman._
