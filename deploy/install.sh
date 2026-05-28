#!/usr/bin/env bash
set -euo pipefail

DOMAIN="ved.ansht.tech"
APP_DIR="/opt/vedai"
REPO="https://github.com/Ansh-699/VedaAi.git"

echo "==> System update"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y -qq
apt-get install -y -qq curl ca-certificates gnupg build-essential ufw nginx certbot python3-certbot-nginx

echo "==> Node 20 (NodeSource)"
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -dv -f2 | cut -d. -f1)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
node -v
npm -v

echo "==> PM2 (global)"
npm install -g --silent pm2

echo "==> Kiro CLI"
if ! command -v kiro-cli >/dev/null 2>&1; then
  curl -fsSL https://desktop-release.kiro.dev/cli/install.sh | bash || true
fi
# Make kiro-cli reachable from systemd-managed PM2 processes.
if [[ -x "$HOME/.local/bin/kiro-cli" ]]; then
  ln -sf "$HOME/.local/bin/kiro-cli" /usr/local/bin/kiro-cli
fi
command -v kiro-cli && kiro-cli --version || true

echo "==> Clone or update repo"
if [[ -d "$APP_DIR/.git" ]]; then
  git -C "$APP_DIR" fetch --all --prune
  git -C "$APP_DIR" reset --hard origin/master
else
  git clone --depth=1 "$REPO" "$APP_DIR"
fi

echo "==> Write .env"
if [[ ! -f "$APP_DIR/backend/.env" ]]; then
  cat > "$APP_DIR/backend/.env" <<'ENV'
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://ved.ansht.tech

MONGODB_URI=__MONGODB_URI__
REDIS_URL=__REDIS_URL__

AI_PROVIDER=kiro
KIRO_API_KEY=__KIRO_API_KEY__

WORKER_CONCURRENCY=2
ENV
fi
if [[ ! -f "$APP_DIR/frontend/.env.local" ]]; then
  cat > "$APP_DIR/frontend/.env.local" <<'ENV'
NEXT_PUBLIC_API_URL=https://ved.ansht.tech
NEXT_PUBLIC_WS_URL=wss://ved.ansht.tech/ws
ENV
fi

echo "==> Install dependencies"
cd "$APP_DIR"
npm install --no-audit --no-fund

echo "==> Build"
npm run build

echo "==> PM2 ecosystem"
cat > "$APP_DIR/ecosystem.config.cjs" <<'PM2'
module.exports = {
  apps: [
    {
      name: "vedai-api",
      cwd: "/opt/vedai/backend",
      script: "dist/index.js",
      env: { NODE_ENV: "production", PORT: "4000" },
      max_memory_restart: "350M",
      restart_delay: 2000,
    },
    {
      name: "vedai-worker",
      cwd: "/opt/vedai/backend",
      script: "dist/worker.js",
      env: { NODE_ENV: "production" },
      max_memory_restart: "400M",
      restart_delay: 2000,
    },
    {
      name: "vedai-web",
      cwd: "/opt/vedai/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: { NODE_ENV: "production", PORT: "3000" },
      max_memory_restart: "400M",
      restart_delay: 2000,
    },
  ],
};
PM2

echo "==> Start with PM2"
pm2 startOrReload "$APP_DIR/ecosystem.config.cjs" --update-env
pm2 save
pm2 startup systemd -u root --hp /root | tail -5 || true

echo "==> Nginx"
cat > /etc/nginx/sites-available/vedai.conf <<NGINX
server {
  listen 80;
  listen [::]:80;
  server_name $DOMAIN;
  return 301 https://\$host\$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name $DOMAIN;

  # certbot will fill in the cert paths after the http-01 challenge
  ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

  client_max_body_size 12M;

  # Backend API
  location /api/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_buffering off;
    proxy_read_timeout 120s;
  }

  # Health
  location = /health {
    proxy_pass http://127.0.0.1:4000/health;
  }

  # WebSocket
  location /ws {
    proxy_pass http://127.0.0.1:4000/ws;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_read_timeout 3600s;
  }

  # Next.js
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_buffering off;
  }
}
NGINX

# A minimal HTTP-only server while we wait for the cert (replaced after).
cat > /etc/nginx/sites-available/vedai-bootstrap.conf <<NGINX
server {
  listen 80;
  listen [::]:80;
  server_name $DOMAIN;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
  }
  location /api/ { proxy_pass http://127.0.0.1:4000; }
  location /ws   { proxy_pass http://127.0.0.1:4000/ws; proxy_http_version 1.1; proxy_set_header Upgrade \$http_upgrade; proxy_set_header Connection "upgrade"; }
}
NGINX

rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/vedai.conf
ln -sf /etc/nginx/sites-available/vedai-bootstrap.conf /etc/nginx/sites-enabled/vedai-bootstrap.conf
nginx -t
systemctl reload nginx || systemctl restart nginx

echo "==> UFW (allow OpenSSH + Nginx)"
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 'Nginx Full' >/dev/null 2>&1 || true
ufw --force enable >/dev/null 2>&1 || true

echo "==> Issue Let's Encrypt certificate"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" --redirect || \
  echo "[warn] certbot failed; check DNS, then run: certbot --nginx -d $DOMAIN"

# Once certbot succeeds it edits the bootstrap file to add SSL. Swap in the
# proper full config to keep things tidy.
if [[ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]]; then
  rm -f /etc/nginx/sites-enabled/vedai-bootstrap.conf
  ln -sf /etc/nginx/sites-available/vedai.conf /etc/nginx/sites-enabled/vedai.conf
  nginx -t && systemctl reload nginx
fi

echo "==> Done"
pm2 status
echo "Visit: https://$DOMAIN"
