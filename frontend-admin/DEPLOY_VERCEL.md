# Déploiement du frontend-admin sur Vercel

## 1. Prérequis

- Compte [Vercel](https://vercel.com)
- Repo Git (GitHub, GitLab ou Bitbucket)

## 2. Créer le projet sur Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Importe ton repo Simpshopy
3. **Root Directory** : `frontend-admin`
4. Framework : Next.js (détecté automatiquement)

## 3. Variables d'environnement

Dans **Project Settings > Environment Variables**, ajoute :

| Variable | Description | Valeur |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | `eyJ...` |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `https://ygossss4k4ks4k08gk08cg8g.161.35.211.212.sslip.io/api/v1` |
| `NEXT_PUBLIC_STOREFRONT_URL` | URL du storefront (déployé) | À définir |
| `NEXT_PUBLIC_STOREFRONT_DOMAIN` | Domaine pour sous-domaines | À définir |
| `NEXT_PUBLIC_REVALIDATE_SECRET` | Secret pour invalidation cache (optionnel) | `ton-secret` |

## 3.1 CORS – Backend

Le backend doit autoriser l’URL Vercel. Ajoute sur ton serveur backend :

```env
FRONTEND_ADMIN_URL=https://ton-projet.vercel.app
```

(Remplace par l’URL réelle de ton déploiement Vercel.)

## 4. Déployer

Clique sur **Deploy**. Vercel va :

1. Installer les dépendances (workspace npm)
2. Builder le projet Next.js
3. Déployer sur une URL type `simpshopy-admin-xxx.vercel.app`

## 5. Domaine personnalisé (optionnel)

Dans **Project Settings > Domains**, ajoute ton domaine (ex. `admin.simpshopy.com`).
