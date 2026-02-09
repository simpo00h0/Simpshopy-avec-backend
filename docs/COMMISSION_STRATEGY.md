# 💰 Stratégie de Commission - Simpshopy

## 🎯 Principe

**Une plateforme sans revenus = une plateforme qui meurt lentement.**

Pour assurer la pérennité de Simpshopy, nous avons mis en place une stratégie de commission **réaliste et progressive** qui équilibre :
- ✅ Coûts infrastructure (serveurs, support, développement)
- ✅ Croissance et scaling
- ✅ Attractivité pour les vendeurs (prix compétitifs vs Shopify)

## 📊 Structure des Commissions par Plan

### Plan GRATUIT (0 XOF/mois)
**Commission : 5% par transaction**

**Pourquoi ?**
- Pas d'abonnement = compensation par commission
- Permet d'essayer la plateforme sans engagement
- Filtre les vendeurs sérieux (qui passeront à un plan payant)

**Inclus :**
- Jusqu'à 50 produits
- Jusqu'à 100 commandes/mois
- Support email
- 1 boutique

---

### Plan STARTER (5,000 XOF/mois ≈ 8 USD)
**Commission : 1-2% par transaction**

**Pourquoi ?**
- Abonnement modeste = petite commission nécessaire
- Équilibre revenus récurrents + transactionnels
- Permet d'absorber les coûts de base (infra, support)

**Inclus :**
- Jusqu'à 500 produits
- Commandes illimitées
- Support prioritaire (email + WhatsApp)
- 1 boutique
- Analytics basiques

---

### Plan PRO (15,000 XOF/mois ≈ 25 USD)
**Commission : 0% par transaction**

**Pourquoi ?**
- Abonnement suffisant pour couvrir les coûts
- Avantage concurrentiel majeur vs Shopify ($79/mois + 2.9%)
- Attire les vendeurs sérieux avec volume

**Inclus :**
- Produits illimités
- Commandes illimitées
- Support prioritaire 24/7
- Multi-boutiques (jusqu'à 5)
- Analytics avancés
- Page Builder complet
- Intégrations premium

---

### Plan ENTERPRISE (Sur mesure)
**Commission : Négociable (généralement 0%)**

**Pourquoi ?**
- Contrats annuels importants
- Support dédié
- Features custom
- SLA garantis

**Inclus :**
- Tout du plan PRO +
- Multi-boutiques illimité
- Support dédié
- Features sur mesure
- SLA personnalisés
- Migration assistée

## 💡 Calcul Intelligent des Commissions

### Logique d'Application

Le système calcule automatiquement la commission selon :

1. **Plan du vendeur** → Taux de base
2. **Montant de la commande** → Application du pourcentage ou montant fixe
3. **Type de commission** :
   - **Percentage** : `commission = total * (taux / 100)`
   - **Fixed** : `commission = montant fixe`

### Exemples Concrets

#### Exemple 1 : Plan GRATUIT
```
Commande : 50,000 XOF
Commission : 50,000 × 5% = 2,500 XOF
Revenu vendeur : 47,500 XOF
```

#### Exemple 2 : Plan STARTER (1.5%)
```
Commande : 50,000 XOF
Commission : 50,000 × 1.5% = 750 XOF
Revenu vendeur : 49,250 XOF
Abonnement : 5,000 XOF/mois
```

#### Exemple 3 : Plan PRO (0%)
```
Commande : 50,000 XOF
Commission : 0 XOF
Revenu vendeur : 50,000 XOF
Abonnement : 15,000 XOF/mois
```

## 🔧 Implémentation Technique

### Modèle PlatformFee

```prisma
model PlatformFee {
  id        String   @id @default(uuid())
  storeId   String
  type      String   // "percentage" | "fixed"
  value     Float    // Ex: 2.5 (%) ou 500 (XOF)
  appliesTo String   // "order" | "product" | "payment"
  isActive  Boolean  @default(true)
}
```

### Calcul Automatique

```typescript
// backend/src/orders/services/commission.service.ts
async calculateCommission(order: Order, store: Store): Promise<number> {
  const subscription = store.subscription;
  const fee = await this.getActiveFee(store.id, 'order');
  
  if (subscription.plan === 'FREE') {
    return order.total * 0.05; // 5%
  }
  
  if (subscription.plan === 'STARTER') {
    return order.total * 0.015; // 1.5%
  }
  
  if (subscription.plan === 'PRO') {
    return 0; // 0%
  }
  
  // Enterprise : personnalisé
  if (fee?.isActive) {
    if (fee.type === 'percentage') {
      return order.total * (fee.value / 100);
    }
    return fee.value;
  }
  
  return 0;
}
```

### Enregistrement dans Order

```typescript
// Lors de la création de commande
const commission = await this.calculateCommission(order, store);
order.platformFeeAmount = commission;
order.total = order.subtotal + order.taxAmount + order.shippingAmount - order.discountAmount + commission;

// Crédit au wallet vendeur (après paiement)
await this.walletService.credit(store.id, order.total - commission);
```

## 📈 Impact Business

### Projections (Hypothèses)

#### Scénario Conservateur (An 1)
- **1000 boutiques actives**
- **500 commandes/mois** en moyenne
- **50,000 XOF** de commande moyenne
- **Répartition plans** :
  - 60% GRATUIT → 5000×5% = 250 XOF/commande
  - 30% STARTER → 2500×1.5% = 750 XOF/commande
  - 10% PRO → 1000×0% = 0 XOF/commande

**Revenus mensuels :**
- Abonnements : (5000×0.3×5000) + (1000×0.1×15000) = 7,500,000 + 1,500,000 = **9,000,000 XOF**
- Commissions : (5000×0.6×250) + (2500×0.3×750) = 750,000 + 562,500 = **1,312,500 XOF**
- **Total : ~10,312,500 XOF/mois** (≈ 16,500 USD/mois)

#### Scénario Optimiste (An 2)
- **5000 boutiques actives**
- **2000 commandes/mois** en moyenne
- Répartition : 40% FREE / 40% STARTER / 20% PRO

**Revenus mensuels estimés :**
- Abonnements : **~45,000,000 XOF**
- Commissions : **~8,000,000 XOF**
- **Total : ~53,000,000 XOF/mois** (≈ 85,000 USD/mois)

## ✅ Avantages de cette Stratégie

### Pour Simpshopy
1. **Revenus récurrents** : Abonnements garantissent cash flow
2. **Revenus transactionnels** : Scalables avec la croissance
3. **Pérennité** : Finance infrastructure, support, développement

### Pour les Vendeurs
1. **Choix flexible** : Plan adapté à leur situation
2. **Progression naturelle** : FREE → STARTER → PRO
3. **Compétitif** : Même avec commission, reste moins cher que Shopify

### Comparaison vs Shopify

| Plan | Shopify | Simpshopy | Économie |
|------|---------|-----------|----------|
| **Basique** | $29/mois + 2.9% | 5,000 XOF/mois + 1.5% | **~70% moins cher** |
| **Pro** | $79/mois + 2.9% | 15,000 XOF/mois + 0% | **~85% moins cher** |

## 🔄 Évolution Future

### Marketplace Multi-Vendeurs
Quand Simpshopy deviendra marketplace, la commission peut inclure :
- Commission plateforme (2-3%)
- Commission vendeur (gérée séparément)

### Paiements Instantanés
- Option de paiement immédiat au vendeur (contre frais)
- Retenue sur garantie (protection acheteur)

---

**Cette stratégie assure la pérennité de Simpshopy tout en restant ultra-compétitive face à Shopify.**

**Dernière mise à jour** : Décembre 2024
