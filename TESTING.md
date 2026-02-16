# Tests automatisés — Simpshopy

## Vue d'ensemble

| Package | Tests unitaires | Tests E2E | Commande |
|---------|-----------------|-----------|----------|
| backend | Jest | Jest + Supertest | `cd backend && npm run test` |
| frontend-admin | Jest + React Testing Library | Playwright | `cd frontend-admin && npm run test` |
| storefront | — | — | — |

## Commandes

### Tous les tests (racine)

```bash
npm run test
```

Exécute les tests unitaires backend + frontend-admin. Le storefront n'a pas encore de tests configurés.

### Tests unitaires

```bash
# Backend
cd backend && npm run test

# Frontend-admin
cd frontend-admin && npm run test
```

**Prérequis** : aucun (pas de DB, pas de navigateur). Rapide (~10–15 s).

### Tests E2E

```bash
# Backend
cd backend && npm run test:e2e
```

**Prérequis** : base de données accessible (`DATABASE_URL` dans `.env`).

```bash
# Frontend-admin
cd frontend-admin && npm run test:e2e
```

**Prérequis** : Chrome installé sur la machine (la config utilise `channel: 'chrome'` pour éviter le téléchargement des navigateurs Playwright).

Interface mode : `cd frontend-admin && npm run test:e2e:ui`

## Structure des tests

```
backend/
├── src/**/*.spec.ts          # Tests unitaires (Jest)
└── test/
    └── app.e2e-spec.ts       # Tests E2E API

frontend-admin/
├── src/**/*.test.ts(x)       # Tests unitaires (Jest + RTL)
└── e2e/
    ├── landing.spec.ts
    ├── login.spec.ts
    └── signup.spec.ts        # Tests E2E (Playwright)
```

## Prérequis par type de test

| Type | DB | Chrome | Serveur |
|------|----|--------|---------|
| Unitaires backend | Non | Non | Non |
| Unitaires frontend-admin | Non | Non | Non |
| E2E backend | Oui | Non | Non (Jest lance l'app) |
| E2E frontend-admin | Non | Oui | Non (Playwright lance `npm run dev`) |
