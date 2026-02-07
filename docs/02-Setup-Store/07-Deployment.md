# Production Deployment Guide

Complete guide for deploying this application to production using Docker, Nginx, and SSL.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Requirements](#server-requirements)
3. [Security Hardening](#security-hardening)
4. [Deployment Options](#deployment-options)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL Setup](#ssl-setup)
7. [SEO & Indexing](#seo--indexing)
8. [Maintenance](#maintenance)

---

## Prerequisites

**Required:**

- Linux server (Ubuntu 22.04/24.04 recommended)
- Docker and Docker Compose installed
- Domain name (e.g., `yourstore.com`)
- SSH access to server

**For Self-Hosting:**

- Router access for port forwarding
- Static local IP address

**For Cloud VPS:**

- VPS provider account (DigitalOcean, Hetzner, AWS, Linode, etc.)

---

## Server Requirements

### Compute Resources

| Traffic Tier | Monthly Visits | CPU (vCores) | RAM (Memory)  | Storage (SSD/NVMe) |
| :----------- | :------------- | :----------- | :------------ | :----------------- |
| **Low**      | < 10,000       | **2 vCPUs**  | **4 GB**      | 40 GB              |
| **Medium**   | 10k - 100k     | **4 vCPUs**  | **8 - 16 GB** | 80 GB              |
| **High**     | 100k - 500k+   | **8+ vCPUs** | **32 GB+**    | 160 GB+            |

### Storage Requirements

Storage needs based on product catalog size:

**Calculation Assumptions:**

- Average Images per Product: 3.5
- Average Image Size: 2MB (high-res) + Next.js optimized cache
- Database growth includes metadata, users, and order history

| Scale          | Products | Est. Images | Database (Postgres) | Media (Uploads) | **Total Recommended** |
| :------------- | :------- | :---------- | :------------------ | :-------------- | :-------------------- |
| **Startup**    | 2,000    | ~7,000      | 1 GB                | ~15 GB          | **25 GB SSD**         |
| **Growth**     | 10,000   | ~35,000     | 5 GB                | ~75 GB          | **100 GB NVMe**       |
| **Scale**      | 50,000   | ~175,000    | 20 GB               | ~375 GB         | **500 GB NVMe**       |
| **Enterprise** | 100,000+ | ~350,000+   | 50 GB+              | ~750 GB+        | **1 TB+ NVMe**        |

---

## Security Hardening

### Hardened Dockerfile

Use this multi-stage build that removes dangerous network tools in production:

```dockerfile
# ==========================================
# 1. Base Stage
# ==========================================
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --force

# ==========================================
# 2. Development Stage
# ==========================================
FROM base AS dev
COPY . .
# Security: Remove tools botnets use
RUN rm -rf /usr/bin/wget /usr/bin/curl /usr/bin/nc
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ==========================================
# 3. Production Stage
# ==========================================
FROM base AS prod
WORKDIR /app
ENV NEXT_PUBLIC_NODE_ENV=production

# Copy application files
COPY . .

# Setup Entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Build inside the image
RUN npx prisma generate
RUN npm run build

# --- SECURITY PATCH ---
# Remove dangerous tools to prevent malware downloads
RUN rm -rf /usr/bin/wget /usr/bin/curl /usr/bin/nc /usr/bin/netcat

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
```

### Secure docker-compose.yml

Ensure services are NOT exposed to the public internet. Bind to localhost only:

```yaml
services:
  web:
    # ...
    ports:
      - "127.0.0.1:3000:3000" # Only accessible by Nginx

  db:
    # ...
    ports:
      - "127.0.0.1:5432:5432" # Block external attacks
```

---

## Deployment Options

### Option 1: Cloud VPS Deployment (Recommended)

#### Pre-Build Cache Transfer (Optional Performance Boost)

Skip the 5-10 minute build process by transferring a pre-built cache.

**On Local Machine:**

```bash
# Build Docker cache locally
docker-compose up --build

# Create compressed archive
tar -czf docker-cache.tar.gz .docker-cache

# Check size (typically 200-500MB)
ls -lh docker-cache.tar.gz

# Transfer to VPS
scp docker-cache.tar.gz user@your-vps-ip:/path/to/project/

# Alternative: Use rsync for incremental transfers
rsync -avz --progress docker-cache.tar.gz user@your-vps-ip:/path/to/project/
```

**On VPS:**

```bash
# Navigate to project directory
cd /path/to/project

# Extract cache
tar -xzf docker-cache.tar.gz

# Verify extraction
ls -la .docker-cache/
# Should show: node_modules/ and .next/

# Clean up archive (optional)
rm docker-cache.tar.gz

# Start containers (uses pre-built cache)
docker-compose up -d
```

#### Cache Management Commands

**Update with Full Cache Transfer (major updates):**

```bash
# Local:
docker-compose up --build
tar -czf docker-cache.tar.gz .docker-cache
scp docker-cache.tar.gz user@vps:/path/to/project/

# VPS:
cd /path/to/project
docker-compose down
tar -xzf docker-cache.tar.gz
docker-compose up -d
```

**Incremental Sync (minor updates):**

```bash
# Local:
rsync -avz --progress .docker-cache/ user@vps:/path/to/project/.docker-cache/

# VPS:
docker-compose restart app
```

**Clear Cache (force rebuild):**

```bash
docker-compose down
rm -rf .docker-cache
docker-compose up --build -d  # Takes 5-10 minutes
```

**Check Cache Status:**

```bash
du -sh .docker-cache/node_modules
du -sh .docker-cache/.next
du -sh .docker-cache  # Total size
```

---

### Option 2: Self-Hosting (Home Server)

#### Network Setup

**Requirements:**

- Static local IP for your server (e.g., `192.168.1.100`)
- Router admin access (usually `192.168.1.1` or `192.168.1.254`)
- Dynamic DNS service (e.g., [DuckDNS](https://www.duckdns.org/))

**Port Forwarding Configuration:**

1. Login to your router admin panel
2. Navigate to Port Forwarding section
3. Create two forwarding rules to your server's local IP:
   - **Port 80** (HTTP) → **Port 80**
   - **Port 443** (HTTPS) → **Port 443**

**Dynamic DNS Setup (DuckDNS Example):**

1. Register at [duckdns.org](https://www.duckdns.org/)
2. Create subdomain (e.g., `yourstore.duckdns.org`)
3. Follow their guide to auto-update your public IP

---

## Nginx Configuration

### Installation

```bash
sudo apt update
sudo apt install nginx
sudo ufw allow 'Nginx Full'  # Open firewall
```

Verify installation by visiting your server IP - you should see "Welcome to nginx!"

### Main Configuration

Edit the main config file:

```bash
sudo nano /etc/nginx/nginx.conf
```

**Complete nginx.conf:**

```nginx
user nginx;
worker_processes auto;
worker_rlimit_nofile 65535;

error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

events {
    worker_connections 10240;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging Optimization
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main buffer=32k flush=3s;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    client_max_body_size 100G;

    # Timeouts
    keepalive_timeout  300;
    client_body_timeout 300;
    client_header_timeout 300;

    # Rate Limiting (100 req/sec, burst 200)
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=100r/s;

    # Upstream to Docker
    upstream backend_app {
        server 127.0.0.1:3000;
        keepalive 64;
    }

    # HTTP -> HTTPS Redirect
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        # Allow Certbot validation
        location /.well-known/acme-challenge/ {
            root /var/www/html;
        }

        # Redirect all other traffic to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS Server (uncomment AFTER running Certbot)
    # server {
    #     listen 443 ssl;
    #     http2 on;
    #     server_name your-domain.com www.your-domain.com;
    #
    #     ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    #     ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    #     include /etc/letsencrypt/options-ssl-nginx.conf;
    #     ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    #
    #     # Main application
    #     location / {
    #         limit_req zone=mylimit burst=200 nodelay;
    #         proxy_pass http://backend_app;
    #         proxy_http_version 1.1;
    #         proxy_set_header Upgrade $http_upgrade;
    #         proxy_set_header Connection "upgrade";
    #         proxy_set_header Host $http_host;
    #         proxy_set_header X-Real-IP $remote_addr;
    #         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #         proxy_set_header X-Forwarded-Proto $scheme;
    #         proxy_cache_bypass $http_upgrade;
    #     }
    #
    #     # SSE / Live Streams (No Buffering)
    #     location /api/live {
    #         proxy_buffering off;
    #         proxy_cache off;
    #         gzip off;
    #         proxy_pass http://backend_app;
    #         proxy_http_version 1.1;
    #         proxy_set_header Connection "";
    #         proxy_set_header Host $http_host;
    #         proxy_set_header X-Real-IP $remote_addr;
    #         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     }
    # }

    include /etc/nginx/conf.d/*.conf;
}
```

**Test and Apply:**

```bash
sudo nginx -t                # Check for syntax errors
sudo systemctl reload nginx  # Apply changes
```

---

## SSL Setup

### Domain Configuration

**For Custom Domains:**

1. Go to your domain registrar (e.g., Libyan Spider, Namecheap, GoDaddy)
2. Navigate to DNS Management / Zone Editor
3. Add A Records:
   - **Host:** `@` → **Value:** `YOUR_VPS_IP`
   - **Host:** `www` → **Value:** `YOUR_VPS_IP`
4. Wait for DNS propagation (5-60 minutes)
5. Verify: `ping your-domain.com`

**For DuckDNS (Self-Hosting):**

Follow the DuckDNS setup guide to link your subdomain to your public IP.

### SSL Certificate Installation

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# For regular domains:
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# For DuckDNS:
sudo certbot certonly --nginx -d yourstore.duckdns.org
```

**After successful certificate generation:**

1. Uncomment the HTTPS server block in `/etc/nginx/nginx.conf`
2. Replace `your-domain.com` with your actual domain
3. Restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

Your site is now live at `https://your-domain.com` 🎉

You can then implement other things such as default fallback page when the server is down and so on.

---

## SEO & Indexing

### Dynamic Sitemap Generation

You'll have this sitemap generator: `src/app/sitemap.js` to automatically list all products every 24 hours, you can edit it if you want.

<!-- ```javascript
import { APP_BASE_URL } from "@/helpers/config";
import prisma from "@/lib/db";

export const revalidate = 86400; // 86400 seconds = 24 hours

export default async function sitemap() {
  // 1. Define your Base URL
  const baseUrl = APP_BASE_URL;

  // 2. Fetch all your dynamic data (Products, Sets, Categories)
  const products = await prisma.product.findMany({
    select: { slug: true, updated_at: true },
  });

  const sets = await prisma.set.findMany({
    select: { slug: true, updated_at: true },
  });

  // 3. Define your Static Pages (Main pages)
  const routes = ["", "/store", "/sets", "/about", "/contact", "/login"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    }),
  );

  // 4. Map Products to Sitemap format
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/store/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 5. Map Sets to Sitemap format
  const setRoutes = sets.map((set) => ({
    url: `${baseUrl}/sets/${set.slug}`,
    lastModified: new Date(set.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 6. Combine everything
  return [...routes, ...productRoutes, ...setRoutes];
}
``` -->

### Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add Property** → Select **Domain**
3. Copy the `google-site-verification` code
4. Add TXT Record in your DNS:
   - **Host:** `@`
   - **Value:** `google-site-verification=XXXXX`
5. Return to Search Console and click **Verify**
6. Navigate to **Sitemaps** → Submit `https://your-domain.com/sitemap.xml`

---

## Maintenance

### Common Commands

| Action                    | Command                                     |
| :------------------------ | :------------------------------------------ |
| **Deploy Updates**        | `git pull && docker compose up --build -d`  |
| **View Application Logs** | `docker compose logs -f web`                |
| **View Nginx Logs**       | `sudo tail -f /var/log/nginx/access.log`    |
| **Restart Nginx**         | `sudo systemctl restart nginx`              |
| **Check Nginx Status**    | `sudo systemctl status nginx`               |
| **Test Nginx Config**     | `sudo nginx -t`                             |
| **Renew SSL**             | `sudo certbot renew` (auto-renews normally) |
| **Stop Containers**       | `docker compose down`                       |
| **Restart Containers**    | `docker compose restart`                    |

### Monitoring

**Check container health:**

```bash
docker compose ps
```

**View resource usage:**

```bash
docker stats
```

**Database backup:**

```bash
docker compose exec db pg_dump -U your_user your_database > backup.sql
```

---

## Alternative Deployment Options

This application can also be deployed using:

- **Asura Hosting** - Specialized Node.js hosting
- **Ngrok** - Quick tunneling for development/testing
- **Cloudflare Tunnel** - Secure tunneling without port forwarding
- **Railway.app** - Platform-as-a-Service deployment
- **Vercel** - Serverless Next.js deployment (requires database adjustments)

Refer to their respective documentation for setup instructions.

---

## Troubleshooting

**Port already in use:**

```bash
sudo lsof -i :80
sudo lsof -i :443
# Kill the process if needed
```

**SSL certificate renewal fails:**

```bash
sudo certbot renew --dry-run
# Check DNS and firewall settings
```

**Application not accessible:**

```bash
# Check if Docker containers are running
docker compose ps

# Check if Nginx is running
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

**Database connection errors:**

```bash
# Check database container
docker compose logs db

# Verify DATABASE_URL in .env
```

---

_Last updated on February 7, 2026 by Ayman._
