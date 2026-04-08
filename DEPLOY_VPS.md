# Deploy to Ubuntu VPS

This guide assumes:

- Ubuntu 24.04 VPS
- Domain: `ledanhdat.online`
- Project path on server: `/var/www/ledanhdat`
- Backend runs on `127.0.0.1:5000`
- Nginx serves the frontend and proxies `/api`
- Only ports `80/443` are public; do not expose backend port `5000`

## 1. Install base packages

```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

Check versions:

```bash
node -v
npm -v
psql --version
nginx -v
pm2 -v
```

## 2. Pull source with Git

Install git if needed:

```bash
sudo apt install -y git
```

Clone the repo:

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/lucihigh/portfolio.git ledanhdat
cd ledanhdat
git checkout main
```

If the repo already exists, update it with:

```bash
cd /var/www/ledanhdat
git pull origin main
```

## 3. Create PostgreSQL database

```bash
sudo -u postgres psql
```

Inside `psql`:

```sql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'change_me_now';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
\q
```

## 4. Configure backend env

```bash
cd /var/www/ledanhdat
cp .env.example server/.env
nano server/.env
```

Set at least:

- `HOST=127.0.0.1`
- `DATABASE_URL`
- `JWT_SECRET`
- `CLIENT_URL=https://ledanhdat.online`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Create the frontend production env so the browser always talks to Nginx instead of a raw backend port:

```bash
cat > client/.env.production <<'EOF'
VITE_API_URL=/api
EOF
```

## 5. Install dependencies and build

```bash
cd /var/www/ledanhdat
npm install
npm run prisma:generate
cd server
npx prisma migrate deploy
cd ..
npm run seed
npm run build
```

## 6. Optional: restore your current portfolio data

If you want to restore your latest backup instead of relying only on seed data:

1. Upload your backup file to the server, for example:

```bash
/var/www/ledanhdat/backups/portfolio-data.latest.json
```

2. Run:

```bash
cd /var/www/ledanhdat
npm run restore:data -- ../backups/portfolio-data.latest.json
```

## 7. Start backend with PM2

```bash
cd /var/www/ledanhdat
pm2 start deploy/vps/ecosystem.config.cjs
pm2 save
pm2 startup systemd -u $USER --hp $HOME
```

Run the command printed by `pm2 startup` with `sudo` so PM2 restarts automatically after reboot.

Check:

```bash
pm2 status
curl http://127.0.0.1:5000/health
ss -ltnp | grep 5000
```

## 8. Configure Nginx

Copy the included config:

```bash
sudo cp deploy/vps/ledanhdat.online.conf /etc/nginx/sites-available/ledanhdat.online.conf
sudo ln -s /etc/nginx/sites-available/ledanhdat.online.conf /etc/nginx/sites-enabled/ledanhdat.online.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Confirm only Nginx is public:

```bash
sudo ufw status
ss -ltnp | grep -E ':80|:443|:5000'
```

## 9. Point DNS

Set both records to your VPS IP:

- `A` record for `@` -> your VPS IPv4
- `A` record for `www` -> your VPS IPv4

## 10. Enable HTTPS

```bash
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d ledanhdat.online -d www.ledanhdat.online
```

## 11. Update workflow later

After new code changes:

```bash
cd /var/www/ledanhdat
cat > client/.env.production <<'EOF'
VITE_API_URL=/api
EOF
npm install
npm run build
pm2 restart portfolio-api
```

If Prisma schema changed:

```bash
cd /var/www/ledanhdat/server
npx prisma migrate deploy
```

If you changed admin content locally and want to restore from backup:

```bash
cd /var/www/ledanhdat
npm run restore:data -- ../backups/portfolio-data.latest.json
pm2 restart portfolio-api
```
