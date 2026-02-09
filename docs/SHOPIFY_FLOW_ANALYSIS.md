# Analyse flux Shopify vs Simpshopy

## Parcours Shopify (A à Z)

### 1. Page d'accueil (shopify.com)
- **Header** : Logo, "Log in", "Start for free" (CTA principal)
- **Hero** : Slogan accrocheur ("Be the next big thing"), sous-titre, CTA "Start for free"
- **Sections** : 
  - Galerie de boutiques clientes (social proof)
  - "For everyone from entrepreneurs to enterprise" + chiffres ($1000B+ sales)
  - Témoignages courts (Get started fast, Grow as big, Raise the bar)
  - Pricing CTA
  - Fonctionnalités (Online/in person, Direct/wholesale, etc.)
  - "Start selling in no time" : **3 étapes visuelles** (01 Add product, 02 Customize, 03 Set up payments)
  - CTA final "Take your shot"
- **Footer** : Help, Privacy, Terms

### 2. Inscription (store-signup / admin.shopify.com/signup)
- **Minimal** : "Create a Shopify account" ou formulaire email + mot de passe
- **Offre** : "3 days free, then 3 months for 150円" (adapté par pays)
- **Lien** : "Already have an account? Log in"
- Pas de prénom/nom au tout début — collecte progressive

### 3. Création de boutique
- **Nom de la boutique** demandé tôt
- Génération auto du sous-domaine `xxx.myshopify.com`
- Possibilité de changer le nom 2 fois

### 4. Onboarding post-inscription
- **Checklist** : Add product → Choose theme → Set domain → etc.
- **3 étapes phares** affichées : Add product, Customize, Payments
- Tableau de bord avec guide de démarrage

### 5. Configuration business
- Legal name, adresse, timezone, devise, unité de poids
- Protection par mot de passe de la boutique (avant lancement)

---

## Parcours Simpshopy actuel

| Étape | État |
|-------|------|
| Landing | ✅ Hero, features, CTA |
| Signup | ✅ Complet (prénom, nom, email, téléphone, password) |
| Login | ✅ Email + password |
| Onboarding | ✅ Formulaire boutique (nom, email, phone, ville, pays) |
| Dashboard | ✅ Basique |

---

## Améliorations à implémenter

### Priorité haute
1. **Landing** : Section "Commencez en 3 étapes" (comme Shopify) + offre trial
2. **Signup** : Mention "Gratuit pour commencer" / essai
3. **Onboarding** : Wizard multi-étapes + aperçu du slug en temps réel
4. **Login** : Lien "Mot de passe oublié" (Supabase)
5. **Footer** : Aide, Confidentialité, CGU

### Priorité moyenne
6. **Dashboard** : Checklist "Prochaines étapes" après création
7. **Landing** : Section tarifs ou "Gratuit"
8. **Onboarding** : Sélecteur pays (SN, CI, BJ, etc.)

### Priorité basse
9. **Signup simplifié** : Email first (optionnel)
10. **Social proof** : Témoignages, logos
