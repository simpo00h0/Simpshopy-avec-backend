# 🚀 Démarrage Rapide - Simpshopy

## Installation en 5 minutes

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- Git

### Étapes

```bash
# 1. Cloner le projet
git clone <repo-url>
cd Simpshopy

# 2. Installer les dépendances
npm run install:all

# 3. Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos valeurs

# 4. Démarrer avec Docker
docker-compose up -d

# 5. Initialiser la base de données
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma generate

# 6. Accéder aux applications
# Backend API: http://localhost:3000/api/v1
# Swagger Docs: http://localhost:3000/api/docs
# Admin Dashboard: http://localhost:3001
# Storefront: http://localhost:3002
```

## Développement Local (sans Docker)

```bash
# Terminal 1: Backend
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev

# Terminal 2: Frontend Admin
cd frontend-admin
npm install
npm run dev

# Terminal 3: Storefront
cd storefront
npm install
npm run dev
```

## Premier Utilisateur

1. Accéder à http://localhost:3001
2. Créer un compte vendeur
3. Connecter-vous
4. Créer votre première boutique

## Documentation

- [Plan d'Implémentation](./docs/IMPLEMENTATION_PLAN.md)
- [Intégrations Zone CFA](./docs/CFA_INTEGRATIONS.md)
- [Guide de Déploiement](./docs/DEPLOYMENT.md)

## Support

Pour toute question : contact@simpshopy.com
