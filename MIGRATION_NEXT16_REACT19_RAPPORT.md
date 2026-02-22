# Rapport d'analyse : Migration Simpshopy vers Next.js 16.2.0-canary.56 et React 19.2.4

**Date :** 22 février 2025  
**Projet :** Simpshopy (monorepo)  
**Objectif :** Préparer la migration sans régression

---

## 1. Structure et dépendances

### 1.1 État actuel

| Package | frontend-admin | storefront | shared |
|---------|----------------|------------|--------|
| **Next.js** | 14.0.4 | 14.0.4 | - |
| **React** | ^18.2.0 | ^18.2.0 | - |
| **TypeScript** | ^5.3.3 | ^5.3.3 | ^5.3.3 |
| **Node.js (engines)** | >=18.0.0 (racine) | idem | idem |

### 1.2 Dépendances directes frontend-admin

| Dépendance | Version | Risque React 19 |
|------------|---------|-----------------|
| @mantine/core | ^7.4.0 | **ÉLEVÉ** – Mantine v8+ recommandé pour React 19 |
| @mantine/dates | ^7.4.0 | Idem |
| @mantine/dropzone | ^7.17.8 | Idem |
| @mantine/form | ^7.4.0 | Idem |
| @mantine/hooks | ^7.4.0 | Idem |
| @mantine/notifications | ^7.4.0 | Idem |
| @supabase/supabase-js | ^2.94.0 | **FAIBLE** – Client isomorphique, pas de couplage React |
| @tabler/icons-react | ^2.47.0 | **FAIBLE** |
| @tanstack/react-query | ^5.14.2 | **FAIBLE** – v5 compatible, à valider en tests |
| react-hook-form | ^7.49.2 | **FAIBLE** |
| zustand | ^4.4.7 | **FAIBLE** |
| axios | ^1.6.2 | **NUL** |

### 1.3 Dépendances directes storefront

| Dépendance | Version | Risque React 19 |
|------------|---------|-----------------|
| @mantine/core | ^7.4.0 | **ÉLEVÉ** |
| @mantine/hooks | ^7.4.0 | **ÉLEVÉ** |
| @mantine/carousel | ^7.4.0 | **ÉLEVÉ** |
| @tabler/icons-react | ^2.47.0 | **FAIBLE** |
| @tanstack/react-query | ^5.14.2 | **FAIBLE** |
| react-hook-form | ^7.49.2 | **FAIBLE** |
| zustand | ^4.4.7 | **FAIBLE** |
| axios | ^1.6.2 | **NUL** |

### 1.4 Recommandations dépendances

- **Mantine** : Migrer vers **Mantine v8.0+** (compatibilité React 19 confirmée). Mantine v7 peut générer des warnings (`element.ref` dans ComboboxEventsTarget).
- **TanStack Query** : Conserver v5, valider en tests E2E.
- **Supabase** : Aucune action requise.
- **@tabler/icons-react** : Vérifier la dernière version compatible React 19.

---

## 2. APIs Next.js utilisées

### 2.1 next/navigation

| API | Usage | Fichiers |
|-----|-------|----------|
| useRouter | Oui | login, auth/callback, onboarding, signup, reset-password, dashboard/layout, boutique, products/[id], orders/[id], useDashboardPrefetch, useDashboardAuth |
| usePathname | Oui | dashboard/layout, useDashboardNavigation |
| useParams | Oui | preview/[themeId]/layout, products/[productSlug], collections/[collectionSlug], preview/products/[slug], orders/[id], products/[id] |
| useSearchParams | Oui | preview/[themeId]/products, boutique/editor |

**Conformité** : Toutes ces APIs sont côté client (`'use client'` ou composants enfants de Client Components). Aucune modification requise pour Next 16.

### 2.2 next/link, next/image, next/server, next/cache, next/og

| Module | Usage |
|--------|-------|
| next/link | Oui – nombreux composants |
| next/image | Oui – ProductTemplate, HeroSection, CartTemplate, ImageTextSection, ProductCard, ThemeLayout |
| next/server | Oui – middleware (NextRequest, NextResponse), route revalidate |
| next/cache | Oui – unstable_cache, revalidateTag (storefront) |
| next/og | Oui – storefront/src/app/icon.tsx (ImageResponse) |

### 2.3 Route handlers, layouts, pages

- **Route handlers** : `storefront/src/app/api/revalidate/route.ts` (POST, OPTIONS)
- **Layouts** : 7 fichiers (root, dashboard, s/[slug], preview/[themeId], boutique/editor)
- **Pages** : 37 fichiers

---

## 3. Points de conformité Next 15/16

### 3.1 params async (layouts/pages)

| Fichier | État | Action |
|---------|------|--------|
| storefront/src/app/s/[slug]/layout.tsx | **CONFORME** | `params: Promise<{ slug: string }>`, `const { slug } = await params` |
| Tous les autres layouts | N/A | Pas de params serveur |
| Pages avec params | N/A | Utilisent `useParams()` côté client |

**Verdict** : Le seul layout avec params serveur est déjà conforme.

### 3.2 searchParams

- **Côté serveur** : Aucune page/layout n’utilise `searchParams` en props serveur.
- **Côté client** : `useSearchParams()` dans :
  - `storefront/src/app/preview/[themeId]/products/page.tsx`
  - `frontend-admin/src/app/dashboard/boutique/editor/page.tsx`

**Verdict** : Conforme (usage client uniquement).

### 3.3 cookies(), headers(), draftMode()

- **Aucun usage** dans le code source.

### 3.4 middleware vs proxy (Next 16)

- **Fichier** : `storefront/src/middleware.ts`
- **Fonctionnalité** : Gestion des subdomains, redirects `/s/[slug]` → subdomain, rewrite subdomain → `/s/[slug]`
- **Action requise** :
  1. Renommer `middleware.ts` → `proxy.ts`
  2. Renommer l’export `middleware` → `proxy`
  3. **Attention** : Le runtime `proxy` est **nodejs** (pas edge). Si le projet dépend du runtime Edge, conserver `middleware` (déprécié mais toujours supporté).

### 3.5 unstable_cache, revalidateTag

| API | Fichier | Action Next 16 |
|-----|---------|----------------|
| unstable_cache | storefront/src/app/s/[slug]/layout.tsx | Remplacer par `cache` (si stable) ou conserver – le codemod retire le préfixe `unstable_` |
| revalidateTag | storefront/src/app/api/revalidate/route.ts | Nouvelle signature optionnelle : `revalidateTag(tag, 'max')` – second paramètre optionnel |

### 3.6 experimental.optimizePackageImports

- **frontend-admin** : `optimizePackageImports: ['@mantine/core', '@mantine/hooks']`
- **storefront** : Non configuré (à ajouter pour @mantine/core, @mantine/hooks, @mantine/carousel)
- **Next 16** : Reste sous `experimental` – pas de changement de config attendu.

### 3.7 Config webpack personnalisée

- **Aucune** config webpack dans `next.config.js`.
- **Turbopack** : Storefront utilise déjà `--turbo` en dev. Next 16 utilise Turbopack par défaut pour dev et build.

---

## 4. Fichiers critiques – modifications requises

### 4.1 storefront/src/middleware.ts

**Actions :**
1. Renommer en `proxy.ts`
2. Remplacer `export function middleware` par `export function proxy`
3. Adapter la signature si nécessaire (Request au lieu de NextRequest – à vérifier dans la doc Next 16)
4. Vérifier la compatibilité du runtime (nodejs vs edge)

### 4.2 storefront/src/app/s/[slug]/layout.tsx

- **params** : Déjà async ✓
- **unstable_cache** : Exécuter le codemod ou remplacer manuellement par `cache` si l’API est stabilisée.

### 4.3 storefront/src/app/api/revalidate/route.ts

- **revalidateTag** : Signature actuelle compatible. Optionnel : ajouter un profil `cacheLife` en second argument si besoin de sémantique read-your-writes.

### 4.4 frontend-admin/next.config.js

```js
// Actuel
experimental: {
  optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
}
// Conserver tel quel
```

### 4.5 storefront/next.config.js – images

**Modifications requises pour Next 16 :**

```js
images: {
  remotePatterns: [ /* inchangé, remotePatterns reste valide */ ],
  dangerouslyAllowLocalIP: true,  // NOUVEAU – storefront utilise localhost:3000 pour /uploads
  // Optionnel : minimumCacheTTL: 60 si besoin du comportement précédent (défaut 4h en Next 16)
}
```

### 4.6 storefront/src/app/icon.tsx

- Utilise `ImageResponse` de `next/og`.
- **Next 16** : Si `icon` reçoit des `params` async, adapter. Ici, pas de params – pas de changement attendu.

---

## 5. Exigences Next 16

### 5.1 Node.js

| Actuel | Cible |
|--------|-------|
| engines.node >= 18.0.0 | **Node.js 20.9+** |

**Action** : Mettre à jour `package.json` racine :

```json
"engines": {
  "node": ">=20.9.0",
  "npm": ">=9.0.0"
}
```

### 5.2 TypeScript

| Actuel | Cible |
|--------|-------|
| ^5.3.3 | **5.1.0+** |

**Verdict** : Conforme.

### 5.3 Turbopack

- **Dev** : Par défaut en Next 16. Storefront utilise déjà `--turbo` → retirer le flag.
- **Build** : Turbopack par défaut. Aucune config webpack → pas de conflit.

### 5.4 Images – récapitulatif

| Option | Storefront | Action |
|--------|------------|--------|
| remotePatterns | localhost:3000, ik.imagekit.io, images.unsplash.com | Conserver |
| dangerouslyAllowLocalIP | Non configuré | **Ajouter `true`** (localhost:3000) |
| minimumCacheTTL | Non configuré | Optionnel : 60 si besoin |
| localPatterns | Non utilisé | N/A (pas d’images locales avec query strings) |

---

## 6. Tests

### 6.1 Jest (frontend-admin)

- **Config** : `jest.config.ts` avec `nextJest`, `jest-environment-jsdom`
- **Setup** : `jest.setup.ts` avec `@testing-library/jest-dom`
- **Tests** : useDashboardNavigation, useEditorState, authStore, storeStore, error-handler, EmptyState
- **Action** : Vérifier la compatibilité `next/jest` avec Next 16. Les mocks (`@mantine/notifications`, etc.) peuvent nécessiter des ajustements avec React 19.

### 6.2 Playwright E2E

- **Config** : `frontend-admin/playwright.config.ts`
- **Base URL** : http://localhost:3001
- **webServer** : `npm run dev` (port 3001)
- **Action** : Exécuter la suite E2E après migration pour valider les flux critiques.

### 6.3 Storefront

- **Aucun test** configuré (`"test": "echo Storefront: aucun test configure"`).
- **Recommandation** : Ajouter au minimum des tests E2E Playwright pour les parcours storefront (navigation, panier, checkout).

---

## 7. Scripts package.json à mettre à jour

### 7.1 frontend-admin

```json
"dev": "next dev -p 3001",        // Retirer --turbopack si ajouté (déjà défaut)
"lint": "eslint .",               // Remplacer "next lint" (supprimé en Next 16)
```

### 7.2 storefront

```json
"dev": "next dev -p 3002",        // Retirer --turbo (déjà défaut)
"lint": "eslint .",               // Remplacer "next lint"
```

### 7.3 Migration next lint → ESLint CLI

Exécuter le codemod :

```bash
npx @next/codemod@canary next-lint-to-eslint-cli .
```

Puis migrer `.eslintrc.json` vers ESLint Flat Config (`eslint.config.js`) si nécessaire (Next 16 aligné sur ESLint v10).

---

## 8. Synthèse des modifications par fichier

| Fichier | Modification |
|---------|--------------|
| `package.json` (racine) | engines.node >= 20.9.0 |
| `frontend-admin/package.json` | next@16.2.0-canary.56, react@19.2.4, react-dom@19.2.4, lint script |
| `storefront/package.json` | idem |
| `storefront/next.config.js` | images.dangerouslyAllowLocalIP: true |
| `storefront/src/middleware.ts` | Renommer en proxy.ts, export proxy |
| `storefront/src/app/s/[slug]/layout.tsx` | unstable_cache → cache (si codemod) |
| `frontend-admin/.eslintrc.json` | Migrer vers eslint.config.js (flat config) |
| `storefront/.eslintrc.json` | Idem |
| Dépendances Mantine | Mettre à jour vers v8+ (frontend-admin + storefront) |

---

## 9. Risques et recommandations

### 9.1 Risques identifiés

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| Mantine v7 + React 19 | Élevé | Migrer vers Mantine v8 avant ou pendant la migration |
| Middleware → Proxy (runtime edge) | Moyen | Vérifier si le proxy supporte les mêmes cas d’usage (headers, redirects) |
| Jest + React 19 | Moyen | Mettre à jour @testing-library/react, jest-environment-jsdom |
| Turbopack build | Faible | Aucune config webpack → risque limité |
| next lint supprimé | Faible | Codemod + migration ESLint flat config |

### 9.2 Ordre de migration recommandé

1. **Préparation**
   - Mettre à jour Node.js à 20.9+
   - Créer une branche dédiée
   - Exécuter les tests existants (baseline)

2. **Dépendances**
   - Mettre à jour Mantine vers v8 (frontend-admin puis storefront)
   - Mettre à jour next, react, react-dom
   - Mettre à jour @types/react, @types/react-dom

3. **Codemods**
   - `npx @next/codemod@canary upgrade latest`
   - `npx @next/codemod@canary next-lint-to-eslint-cli .`

4. **Ajustements manuels**
   - middleware → proxy (storefront)
   - next.config.js images (storefront)
   - Vérifier les tests Jest

5. **Validation**
   - `npm run build` (frontend-admin + storefront)
   - `npm run test` (frontend-admin)
   - `npm run test:e2e` (frontend-admin)
   - Tests manuels storefront (subdomains, revalidation, images)

### 9.3 Points conformes (aucune action)

- Layout `s/[slug]` avec params async
- searchParams via useSearchParams (client)
- Pas d’usage de cookies(), headers(), draftMode()
- Pas de config webpack
- TypeScript 5+
- Pas de parallel routes (pas de default.js requis)
- Pas de serverRuntimeConfig/publicRuntimeConfig
- Pas de AMP

---

## 10. Checklist finale

- [ ] Node.js 20.9+ installé
- [ ] Mantine v8+ (frontend-admin, storefront)
- [ ] next@16.2.0-canary.56, react@19.2.4
- [ ] middleware.ts → proxy.ts (storefront)
- [ ] images.dangerouslyAllowLocalIP: true (storefront)
- [ ] next lint → eslint (frontend-admin, storefront)
- [ ] ESLint flat config (si requis)
- [ ] engines.node >= 20.9.0 (package.json racine)
- [ ] Tests Jest passants
- [ ] Tests E2E Playwright passants
- [ ] Build frontend-admin OK
- [ ] Build storefront OK
- [ ] Validation manuelle storefront (subdomains, images localhost)
