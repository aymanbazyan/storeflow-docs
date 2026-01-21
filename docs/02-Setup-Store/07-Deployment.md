# Deployment

## Option 1: Self-Hosting with Nginx

This guide covers how to host this project on your own Linux machine (Ubuntu/Debian) using Nginx as a Reverse Proxy. This allows you to expose the app to the internet securely using your own domain or a dynamic DNS.

Instead of using our plain IP address, we'll use **DuckDNS** for testing for now.

### Prerequisites

- A Linux machine (VPS or Home PC with Ubuntu).
- The project running locally (e.g., on `localhost:3000` via Docker).
- Access to your Router (if hosting from home) to forward ports.

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

    user nginx;
    worker_processes auto;

error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

events {
worker_connections 1024;
}

http {
include /etc/nginx/mime.types;
default_type application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    client_max_body_size 100G;
    keepalive_timeout  120;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=30r/s;

    # =========================================================
    # BLOCK 1: HTTPS (Fixed 443 - usually required for SSL)
    # =========================================================
    server {
        server_name your-domain.duckdns.org;
        listen 443 ssl;

        ssl_certificate /etc/letsencrypt/live/your-domain.duckdns.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your-domain.duckdns.org/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            limit_req zone=mylimit burst=110 nodelay;

            # VARIABLE HERE
            proxy_pass http://localhost:3000;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $http_host;
            proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # =========================================================
    # BLOCK 2: HTTP (DYNAMIC PORT)
    # =========================================================
    server {
        # VARIABLE HERE
        listen 80;
        server_name your-domain.duckdns.org;

        location / {
            limit_req zone=mylimit burst=20 nodelay;

            # VARIABLE HERE
            proxy_pass http://localhost:3000;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /api/live {
            proxy_buffering off;
            proxy_cache off;

            # VARIABLE HERE
            proxy_pass http://localhost:3000;

            proxy_http_version 1.1;
            proxy_set_header Connection '';
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

_Last updated on December 20, 2025 by Ayman._
