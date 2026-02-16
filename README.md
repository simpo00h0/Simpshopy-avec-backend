# 🛍️ Simpshopy - Alternative à Shopify pour l'Afrique de l'Ouest

## 📋 Vue d'ensemble

Simpshopy est une plateforme e-commerce complète permettant à tout le monde de créer et gérer sa boutique en ligne. Optimisée pour la **Zone CFA d'Afrique de l'Ouest**, avec des fonctionnalités et tarifs adaptés au marché local.

## 🎯 Différenciation vs Shopify

### 💰 **Prix compétitifs**
- Plans adaptés au pouvoir d'achat local (XOF)
- **Stratégie de commission intelligente** : 
  - **Gratuit** : 5% de commission
  - **Starter (5,000 XOF/mois)** : 1-2% de commission
  - **Pro (15,000 XOF/mois)** : 0% de commission
  - **Enterprise** : Sur mesure
- Paiements en XOF sans frais de change

### 🚀 **Fonctionnalités adaptées**
- **Intégration Mobile Money native** : Orange Money, MTN Mobile Money, Moov Money
- **WhatsApp Business intégré** : notifications, support client, commandes
- **Support multilingue** : Français (principal), Anglais, langues locales
- **Intégrations locales** : transporteurs locaux, services de livraison régionaux
- **Gestion fiscale CFA** : TVA, taxes locales automatiques
- **Paiements locaux** : Carte bancaire, virement, Mobile Money, cash à la livraison

### 🎨 **UX simplifiée**
- Interface intuitive et mobile-first
- Page Builder drag & drop sans code
- Modèles pré-configurés pour différents secteurs
- Onboarding rapide (boutique en ligne en moins de 10 minutes)
- Support client en français et langues locales
- Dashboard simplifié adapté aux PME et particuliers

## 🏗️ Architecture

```
Simpshopy/
├── backend/              # API NestJS
├── frontend-admin/       # Dashboard vendeur (Next.js + Mantine)
├── storefront/           # Site client dynamique (Next.js + Mantine)
├── shared/              # Code partagé (types, utils)
├── docker/              # Configurations Docker
└── docs/                # Documentation
```

## 📦 Stack Technique

### Backend
- **NestJS** - Framework Node.js
- **PostgreSQL** - Base de données principale
- **Prisma** - ORM
- **JWT** - Authentification
- **Redis** - Cache et sessions
- **Docker** - Containerisation

### Frontend
- **Next.js 14** - Framework React
- **React 18** - Bibliothèque UI
- **Mantine UI** - Composants UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling (optionnel)

### Infrastructure
- **Docker Compose** - Orchestration locale
- **Nginx** - Reverse proxy et load balancing
- **AWS S3** / **Cloudinary** - Stockage fichiers
- **Redis** - Cache distribué

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (ou via Docker)

### Installation

```bash
# Cloner le projet
git clone <repo-url>
cd Simpshopy

# Installation des dépendances
npm run install:all

# Démarrer les services avec Docker
docker-compose up -d

# Initialiser la base de données
cd backend
npx prisma migrate dev
npx prisma generate

# Démarrer en mode développement
npm run dev:all
```

## 📊 Plan d'Implémentation

### Phase 1 : MVP (3-4 mois)

#### Sprint 1-2 : Backend Core (4 semaines)
- [x] Configuration NestJS et structure de base
- [ ] Module d'authentification (JWT, refresh tokens)
- [ ] Module utilisateurs (vendeurs, clients, admins)
- [ ] Module stores (multi-tenancy)
- [ ] Module produits (CRUD, catégories, variantes, images)
- [ ] Module commandes (création, statuts, historique)
- [ ] Module paiements (Mobile Money, cartes, virements)
- [ ] Base de données PostgreSQL avec Prisma

#### Sprint 3-4 : Frontend Admin Dashboard (4 semaines)
- [ ] Authentification (login, register, récupération mot de passe)
- [ ] Dashboard vendeur (stats, aperçu)
- [ ] Gestion produits (CRUD, import/export)
- [ ] Gestion commandes (liste, détails, statuts)
- [ ] Choix et gestion d'abonnement
- [ ] Paramètres boutique (infos, thème, domaines)
- [ ] Page Builder basique (drag & drop)

#### Sprint 5-6 : Storefront (4 semaines)
- [ ] Catalogue produits dynamique
- [ ] Pages produits détaillées
- [ ] Panier d'achat
- [ ] Checkout multi-étapes
- [ ] Rendu dynamique via JSON configs
- [ ] SEO et métadonnées
- [ ] Responsive design mobile-first

#### Sprint 7-8 : Intégrations & Finitions (4 semaines)
- [ ] Intégrations Mobile Money (Orange, MTN, Moov)
- [ ] Système de notifications (email, SMS, WhatsApp)
- [ ] Gestion des stocks
- [ ] Analytics basiques
- [ ] Tests et corrections de bugs
- [ ] Documentation utilisateur

### Phase 2 : Post-MVP (2-3 mois)

#### Fonctionnalités avancées
- [ ] Page Builder avancé (plus de composants, animations)
- [ ] Analytics avancés (revenus, produits populaires, trafic)
- [ ] Marketing tools (codes promo, fidélité, abonnements produits)
- [ ] Multi-boutiques (un vendeur = plusieurs boutiques)
- [ ] API publique pour intégrations
- [ ] Webhooks
- [ ] Applications mobiles (React Native)

#### Optimisations
- [ ] Cache Redis avancé
- [ ] CDN pour assets
- [ ] Optimisations SEO avancées
- [ ] Performance monitoring
- [ ] Tests de charge

### Phase 3 : Scale (Ongoing)

- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Event streaming (Kafka)
- [ ] IA/ML (recommandations produits, pricing)
- [ ] Marketplace (marché multi-vendeurs)
- [ ] Intégrations transporteurs (API)
- [ ] Support multi-devises (XOF, NGN, GHS, etc.)

## 🌍 Spécificités Zone CFA

### Paiements
- ✅ Orange Money (Sénégal, Côte d'Ivoire, Mali, etc.)
- ✅ MTN Mobile Money (Bénin, Togo, etc.)
- ✅ Moov Money (Côte d'Ivoire, Bénin, etc.)
- ✅ Cartes bancaires locales (Visa, Mastercard)
- ✅ Virements bancaires
- ✅ Cash à la livraison

### Langues
- Français (principal)
- Anglais
- Langues locales (Wolof, Fon, etc.) - futur

### Taxes & Conformité
- Gestion TVA locale
- Conformité réglementaire pays
- Factures électroniques
- Rapports fiscaux

### Livraison
- Intégrations transporteurs locaux
- Calcul automatique frais de livraison
- Suivi colis local

## 🔐 Sécurité

- Authentification JWT avec refresh tokens
- Chiffrement des données sensibles
- Protection CSRF/XSS
- Rate limiting sur API
- Validation stricte des inputs
- HTTPS/TLS obligatoire
- Conformité RGPD adaptée

## 📈 Métriques de succès

- **Adoption** : 1000+ boutiques actives en 6 mois
- **Rétention** : 70%+ de rétention après 3 mois
- **Performance** : Temps de chargement < 2s
- **Satisfaction** : Score NPS > 50

## 🧪 Tests

Voir [TESTING.md](./TESTING.md) pour la documentation complète des tests automatisés.

```bash
npm run test
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez lire le guide de contribution avant de soumettre une PR.

## 📄 Licence

Propriétaire - Tous droits réservés

## 📧 Contact

Pour toute question : contact@simpshopy.com
