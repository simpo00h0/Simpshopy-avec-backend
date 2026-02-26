# Déploiement du storefront sur Vercel

## 1. Créer le projet sur Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Importe ton repo Simpshopy
3. **Root Directory** : `storefront`
4. Framework : Next.js (détecté automatiquement)

## 2. Variables d'environnement

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://ygossss4k4ks4k08gk08cg8g.161.35.211.212.sslip.io/api/v1` |
| `NEXT_PUBLIC_STOREFRONT_DOMAIN` | Placeholder au 1er déploiement, puis l’URL réelle (ex. `simpshopy-storefront-xxx.vercel.app`) |
| `NEXT_PUBLIC_ADMIN_URL` | Placeholder pour l’instant ; à remplacer par l’URL du frontend-admin après son déploiement |
| `REVALIDATE_SECRET` | Un secret de ton choix *(pour sécuriser l'invalidation cache)* |

**Note** : Pour le 1er déploiement, mets `placeholder.vercel.app` dans `NEXT_PUBLIC_STOREFRONT_DOMAIN`. Une fois déployé, récupère l’URL (ex. `simpshopy-storefront-xxx.vercel.app`), mets-la dans cette variable, puis redéploie.

## 3. CORS – Backend

Sur ton backend, ajoute l’URL du storefront :

```env
FRONTEND_STOREFRONT_URL=https://ton-projet-storefront.vercel.app
```

## 4. Déployer

Clique sur **Deploy**. Une fois déployé, note l’URL (ex. `https://simpshopy-storefront-xxx.vercel.app`).

## 5. Mise à jour après déploiement

1. Dans Vercel → Storefront → **Settings** → **Environment Variables**
2. Mets à jour `NEXT_PUBLIC_STOREFRONT_DOMAIN` avec l’URL réelle (ex. `simpshopy-storefront-xxx.vercel.app`)
3. Redéploie si nécessaire
