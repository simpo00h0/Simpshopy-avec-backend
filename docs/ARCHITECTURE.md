# 🏗️ Architecture Technique - Simpshopy

## Vue d'Ensemble

Simpshopy suit une architecture **modulaire monolithique** avec séparation claire entre backend et frontend, prête pour une migration future vers microservices.

## Structure du Projet

```
Simpshopy/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/         # Authentification JWT
│   │   ├── users/        # Gestion utilisateurs
│   │   ├── stores/       # Gestion boutiques
│   │   ├── products/     # Gestion produits
│   │   ├── orders/       # Gestion commandes
│   │   ├── payments/     # Paiements (Mobile Money, Cartes)
│   │   ├── subscriptions/# Abonnements
│   │   ├── cart/         # Panier
│   │   ├── reviews/      # Avis produits
│   │   ├── pages/        # Page Builder
│   │   └── notifications/# Notifications
│   └── prisma/           # Schéma base de données
│
├── frontend-admin/       # Dashboard vendeur
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # Composants React
│   │   ├── stores/       # State management (Zustand)
│   │   └── lib/          # Utilitaires
│
├── storefront/           # Site client dynamique
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # Composants réutilisables
│   │   └── lib/          # Utilitaires
│
├── shared/               # Code partagé
│   └── src/
│       └── types/        # Types TypeScript partagés
│
└── docker/               # Configurations Docker
    └── nginx/            # Configuration Nginx
```

## Flux de Données

### Authentification
```
Client → Frontend → API (/auth/login) → JWT Token → Stockage Local → Requêtes authentifiées
```

### Création Commande
```
Storefront → API (/orders) → Validation → Payment Service → Mobile Money API → Webhook → Notification
```

### Page Builder
```
Admin → Page Builder UI → JSON Config → API (/pages) → Database → Storefront → Rendu Dynamique
```

## Base de Données

### Modèle Relationnel
- **Users** ← → **Stores** (One-to-Many)
- **Stores** ← → **Products** (One-to-Many)
- **Products** ← → **ProductVariants** (One-to-Many)
- **Orders** ← → **OrderItems** (One-to-Many)
- **Users** ← → **Orders** (One-to-Many)

### Multi-Tenancy
- Isolation par `storeId` dans toutes les tables
- Index sur `storeId` pour performance
- Middleware Prisma pour filtrage automatique

## API REST

### Endpoints Principaux

#### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/refresh` - Rafraîchir token
- `GET /api/v1/auth/me` - Profil utilisateur

#### Boutiques
- `GET /api/v1/stores` - Liste boutiques
- `POST /api/v1/stores` - Créer boutique
- `GET /api/v1/stores/:id` - Détails boutique
- `PUT /api/v1/stores/:id` - Modifier boutique

#### Produits
- `GET /api/v1/stores/:storeId/products` - Liste produits
- `POST /api/v1/stores/:storeId/products` - Créer produit
- `GET /api/v1/products/:id` - Détails produit
- `PUT /api/v1/products/:id` - Modifier produit

#### Commandes
- `GET /api/v1/stores/:storeId/orders` - Liste commandes
- `POST /api/v1/stores/:storeId/orders` - Créer commande
- `GET /api/v1/orders/:id` - Détails commande
- `PUT /api/v1/orders/:id/status` - Mettre à jour statut

#### Paiements
- `POST /api/v1/payments/initiate` - Initier paiement
- `POST /api/v1/payments/verify` - Vérifier paiement
- `GET /api/v1/payments/:id` - Statut paiement

## Sécurité

### Authentification
- **JWT** avec refresh tokens
- **Expiration** : 7 jours (access), 30 jours (refresh)
- **Rotation** : Refresh tokens régénérés à chaque utilisation

### Autorisation
- **RBAC** : Rôles (ADMIN, SELLER, CUSTOMER)
- **Guards** : JwtAuthGuard, RolesGuard
- **Permissions** : Vérification au niveau service

### Protection
- **Rate Limiting** : 100 req/min par IP
- **CORS** : Domaines autorisés uniquement
- **Validation** : class-validator sur tous les inputs
- **Sanitization** : Protection XSS/CSRF

## Performance

### Caching
- **Redis** : Cache sessions, données fréquentes
- **CDN** : Assets statiques (images, CSS, JS)
- **Next.js** : ISR (Incremental Static Regeneration)

### Optimisations
- **Lazy Loading** : Composants React
- **Code Splitting** : Next.js automatique
- **Database Indexing** : Index stratégiques
- **Connection Pooling** : Prisma

## Monitoring

### Logging
- **Console** : Développement
- **Winston** : Production (fichiers + centralisé)
- **Structured Logs** : JSON format

### Error Tracking
- **Sentry** : Backend & Frontend
- **Alertes** : Notifications critiques

### Métriques
- **PM2** : Métriques processus
- **Prometheus** : Métriques custom (futur)
- **Grafana** : Dashboards (futur)

## Scalabilité

### Horizontal Scaling
- **Load Balancer** : Nginx/ALB
- **Stateless Backend** : Sessions Redis
- **Read Replicas** : PostgreSQL

### Vertical Scaling
- **Database** : Upgrade instance
- **Cache** : Redis Cluster
- **Storage** : S3 avec CloudFront

### Future: Microservices
- **API Gateway** : Kong/Tyk
- **Service Mesh** : Istio
- **Message Queue** : Kafka
- **Service Discovery** : Consul

---

**Dernière mise à jour** : Décembre 2024
