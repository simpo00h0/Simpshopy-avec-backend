# Configuration Supabase Auth

L'authentification utilise **Supabase Auth** : inscription, connexion, confirmation email, reset mot de passe.

## 1. Récupérer les clés Supabase

Dans **Supabase Dashboard** > **Project Settings** > **API** :

| Variable | Où la trouver |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (ex: `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_JWT_SECRET` | JWT Secret (section JWT Settings) |

## 2. Backend (NestJS)

Dans `backend/.env` :

```env
SUPABASE_JWT_SECRET=votre-jwt-secret-ici
```

## 3. Frontend (Next.js)

Créez `frontend-admin/.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 4. Confirmation email (optionnel)

Dans **Supabase Dashboard** > **Authentication** > **Providers** > **Email** :

- **Enable Email Confirmations** : activé pour exiger la confirmation avant connexion
- **Secure email change** : recommandé

Une fois activé, après inscription un email est envoyé. L’utilisateur clique sur le lien et est redirigé vers `/auth/callback`, puis vers l’onboarding.

## 5. Redirection après confirmation

L’URL de redirection est définie à l’inscription : `{origin}/auth/callback`.

Pour les redirections autorisées : **Authentication** > **URL Configuration** > **Redirect URLs** — ajoutez :
- `http://localhost:3001/auth/callback` (confirmation email)
- `http://localhost:3001/reset-password` (réinitialisation mot de passe)
