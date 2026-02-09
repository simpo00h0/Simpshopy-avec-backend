# 🚀 Guide de Déploiement - Simpshopy

## 📋 Prérequis

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (ou via Docker)
- Redis (ou via Docker)
- VPS/Cloud Server (Ubuntu 20.04+ recommandé)

---

## 🐳 Déploiement avec Docker (Recommandé)

### 1. Configuration Environnement

```bash
# Cloner le projet
git clone <repo-url>
cd Simpshopy

# Copier les fichiers .env
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos valeurs
```

### 2. Variables d'Environnement

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@postgres:5432/simpshopy_db"
JWT_SECRET="your-secret-jwt-key"
JWT_EXPIRES_IN="7d"
REDIS_URL="redis://redis:6379"
NODE_ENV="production"
PORT=3000
API_URL="https://api.simpshopy.com"
FRONTEND_ADMIN_URL="https://admin.simpshopy.com"
FRONTEND_STOREFRONT_URL="https://simpshopy.com"

# Mobile Money APIs
ORANGE_MONEY_API_KEY="your-key"
MTN_MOBILE_MONEY_API_KEY="your-key"
MOOV_MONEY_API_KEY="your-key"

# Storage
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET="simpshopy-uploads"
```

#### Frontend Admin
```env
NEXT_PUBLIC_API_URL="https://api.simpshopy.com/api/v1"
```

#### Storefront
```env
NEXT_PUBLIC_API_URL="https://api.simpshopy.com/api/v1"
```

### 3. Build & Démarrage

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

### 4. Initialisation Base de Données

```bash
# Migrations Prisma
docker-compose exec backend npx prisma migrate deploy

# Seed (optionnel)
docker-compose exec backend npm run prisma:seed
```

---

## 🖥️ Déploiement Manuel (VPS)

### 1. Préparation Serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Installer Redis
sudo apt install -y redis-server

# Installer Nginx
sudo apt install -y nginx

# Installer PM2
sudo npm install -g pm2
```

### 2. Configuration PostgreSQL

```bash
# Créer utilisateur et base de données
sudo -u postgres psql
CREATE USER simpshopy WITH PASSWORD 'your-password';
CREATE DATABASE simpshopy_db OWNER simpshopy;
\q
```

### 3. Configuration Redis

```bash
# Démarrer Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 4. Déploiement Backend

```bash
cd backend

# Installation dépendances
npm ci --production

# Build
npm run build

# Migrations
npx prisma migrate deploy
npx prisma generate

# Démarrer avec PM2
pm2 start dist/main.js --name simpshopy-backend
pm2 save
pm2 startup
```

### 5. Déploiement Frontend Admin

```bash
cd frontend-admin

# Installation dépendances
npm ci

# Build
npm run build

# Démarrer avec PM2
pm2 start npm --name simpshopy-admin -- start
pm2 save
```

### 6. Déploiement Storefront

```bash
cd storefront

# Installation dépendances
npm ci

# Build
npm run build

# Démarrer avec PM2
pm2 start npm --name simpshopy-storefront -- start
pm2 save
```

### 7. Configuration Nginx

```nginx
# /etc/nginx/sites-available/simpshopy

# API Backend
server {
    listen 80;
    server_name api.simpshopy.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Admin Dashboard
server {
    listen 80;
    server_name admin.simpshopy.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Storefront
server {
    listen 80;
    server_name simpshopy.com www.simpshopy.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/simpshopy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir certificats SSL
sudo certbot --nginx -d api.simpshopy.com -d admin.simpshopy.com -d simpshopy.com -d www.simpshopy.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

---

## ☁️ Déploiement Cloud (AWS/Azure/GCP)

### AWS

#### Option 1 : ECS (Elastic Container Service)
- Utiliser Docker Compose
- ECR pour images Docker
- ALB pour load balancing
- RDS pour PostgreSQL
- ElastiCache pour Redis
- S3 pour fichiers

#### Option 2 : EC2 + Docker
- Instance EC2 Ubuntu
- Docker Compose
- RDS PostgreSQL
- ElastiCache Redis
- S3 pour fichiers
- CloudFront pour CDN

### Configuration Recommandée

#### Instance EC2
- **Type** : t3.medium ou supérieur
- **RAM** : 4GB minimum
- **Storage** : 20GB SSD minimum
- **OS** : Ubuntu 22.04 LTS

#### Base de Données RDS
- **Type** : db.t3.micro (début) → db.t3.small (scale)
- **PostgreSQL 15**
- **Multi-AZ** : Pour production
- **Backups** : Automatiques quotidiens

#### Redis ElastiCache
- **Type** : cache.t3.micro
- **Mode** : Cluster (pour scale)

---

## 📊 Monitoring & Logs

### PM2 Monitoring

```bash
# Dashboard PM2
pm2 monit

# Logs
pm2 logs

# Métriques
pm2 status
```

### Sentry (Error Tracking)

```bash
# Installation
npm install @sentry/node @sentry/nextjs

# Configuration backend
# src/main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### LogRocket (Session Replay)

```bash
# Installation frontend
npm install logrocket

# Configuration
import LogRocket from 'logrocket';
LogRocket.init('your-app-id');
```

---

## 🔄 Mises à Jour

### Backend

```bash
cd backend
git pull
npm ci
npm run build
npx prisma migrate deploy
pm2 restart simpshopy-backend
```

### Frontend

```bash
cd frontend-admin
git pull
npm ci
npm run build
pm2 restart simpshopy-admin

cd ../storefront
git pull
npm ci
npm run build
pm2 restart simpshopy-storefront
```

---

## 🔐 Sécurité Production

### Checklist
- [ ] Variables d'environnement sécurisées
- [ ] HTTPS/SSL activé
- [ ] Firewall configuré (UFW)
- [ ] Rate limiting activé
- [ ] CORS configuré correctement
- [ ] Secrets dans gestionnaire (AWS Secrets Manager, etc.)
- [ ] Backups automatiques
- [ ] Monitoring activé
- [ ] Logs centralisés

### Firewall UFW

```bash
# Autoriser SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer firewall
sudo ufw enable
```

---

## 📈 Scaling

### Horizontal Scaling

#### Backend
- Load balancer (Nginx/ALB)
- Multi-instances backend
- Redis pour sessions partagées

#### Frontend
- CDN (CloudFront/Cloudflare)
- Static exports pour storefront
- Caching agressif

### Vertical Scaling

#### Database
- Upgrade instance RDS
- Read replicas pour lecture
- Connection pooling

#### Cache
- Redis Cluster
- CDN pour assets statiques

---

**Dernière mise à jour** : Décembre 2024
