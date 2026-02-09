# 🌍 Intégrations Zone CFA - Guide Technique

## 📱 Mobile Money

### Orange Money

#### Configuration
```typescript
// backend/src/payments/services/orange-money.service.ts
export class OrangeMoneyService {
  private apiUrl = process.env.ORANGE_MONEY_API_URL;
  private apiKey = process.env.ORANGE_MONEY_API_KEY;
  
  async initiatePayment(amount: number, phone: string, orderId: string) {
    // Implementation
  }
  
  async verifyPayment(transactionId: string) {
    // Implementation
  }
}
```

#### Pays Supportés
- Sénégal (+221)
- Côte d'Ivoire (+225)
- Mali (+223)
- Burkina Faso (+226)
- Guinée (+224)

#### Documentation API
- [Orange Developer Portal](https://developer.orange.com)

### MTN Mobile Money

#### Configuration
```typescript
// backend/src/payments/services/mtn-momo.service.ts
export class MTNMoMoService {
  private apiUrl = process.env.MTN_MOBILE_MONEY_API_URL;
  private apiKey = process.env.MTN_MOBILE_MONEY_API_KEY;
  
  // Implementation
}
```

#### Pays Supportés
- Bénin (+229)
- Togo (+228)
- Côte d'Ivoire (+225)

### Moov Money

#### Configuration
```typescript
// backend/src/payments/services/moov-money.service.ts
export class MoovMoneyService {
  private apiUrl = process.env.MOOV_MONEY_API_URL;
  private apiKey = process.env.MOOV_MONEY_API_KEY;
  
  // Implementation
}
```

#### Pays Supportés
- Côte d'Ivoire (+225)
- Bénin (+229)
- Togo (+228)

---

## 💳 Cartes Bancaires

### Paystack (Recommandé pour Zone CFA)

#### Avantages
- Support XOF natif
- Cartes locales acceptées
- Frais compétitifs
- Excellent support Afrique

#### Configuration
```typescript
// backend/src/payments/services/paystack.service.ts
import Paystack from 'paystack';

export class PaystackService {
  private paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);
  
  async initializePayment(amount: number, email: string, reference: string) {
    return this.paystack.transaction.initialize({
      amount: amount * 100, // Convertir en centimes
      email,
      reference,
      currency: 'XOF',
    });
  }
}
```

### Flutterwave

#### Avantages
- Support multi-devises
- Cartes locales
- Mobile Money intégré

---

## 📧 Notifications

### WhatsApp Business API

#### Configuration
```typescript
// backend/src/notifications/services/whatsapp.service.ts
export class WhatsAppService {
  private apiUrl = 'https://graph.facebook.com/v18.0';
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private accessToken = process.env.WHATSAPP_API_KEY;
  
  async sendMessage(to: string, message: string) {
    // Implementation
  }
  
  async sendOrderConfirmation(order: Order) {
    // Template message
  }
}
```

#### Use Cases
- Confirmation commande
- Notification expédition
- Support client
- Rappels paiement

### SMS (Twilio ou Service Local)

#### Services Locaux Recommandés
- **AfricasTalking** : Excellent pour SMS Afrique
- **Termii** : Support multi-pays

---

## 🚚 Livraison

### Transporteurs Locaux

#### Sénégal
- **Poste Sénégalaise**
- **DHL Sénégal**
- **UPS Sénégal**
- **Livraisons moto** (partenariats locaux)

#### Côte d'Ivoire
- **Poste Ivoirienne**
- **DHL Côte d'Ivoire**
- **FedEx**

#### Bénin
- **Poste Béninoise**
- **DHL Bénin**

#### Intégration API
```typescript
// backend/src/shipping/services/shipping.service.ts
export class ShippingService {
  async calculateShipping(
    from: Address,
    to: Address,
    weight: number,
  ): Promise<ShippingQuote[]> {
    // Calculer avec différents transporteurs
    // Retourner meilleure option
  }
  
  async createShipment(orderId: string) {
    // Créer expédition
  }
  
  async trackShipment(trackingNumber: string) {
    // Suivre colis
  }
}
```

---

## 🌐 Localisation

### Devises
- **XOF** : Franc CFA (tous pays)
- **Support multi-devises** : Futur (NGN, GHS, etc.)

### Langues

#### Priorité 1 : Français
- Interface complète
- Documentation
- Support client

#### Priorité 2 : Anglais
- Interface principale
- Documentation basique

#### Priorité 3 : Langues Locales
- Wolof (Sénégal)
- Fon (Bénin)
- Bambara (Mali)
- Dioula (Côte d'Ivoire)

### Formatage
```typescript
// Formatage prix XOF
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

// formatPrice(10000) => "10 000 FCFA"
```

---

## 📊 Taxes & Conformité

### TVA par Pays
- **Sénégal** : 18%
- **Côte d'Ivoire** : 18%
- **Bénin** : 18%
- **Mali** : 18%
- **Togo** : 18%

### Configuration
```typescript
// backend/src/taxes/taxes.service.ts
const VAT_RATES = {
  SN: 0.18, // Sénégal
  CI: 0.18, // Côte d'Ivoire
  BJ: 0.18, // Bénin
  ML: 0.18, // Mali
  TG: 0.18, // Togo
};

export class TaxesService {
  calculateVAT(amount: number, country: string): number {
    const rate = VAT_RATES[country] || 0.18;
    return amount * rate;
  }
}
```

---

## 🔐 Sécurité & Conformité

### RGPD Adapté
- Consentement explicite
- Droit à l'oubli
- Portabilité des données
- Gestion des données personnelles

### Conformité Locale
- Respect réglementations pays
- Factures électroniques
- Conservation données (durée légale)
- Reporting fiscal

---

## 📞 Support Client

### Canaux
- **Email** : support@simpshopy.com
- **WhatsApp** : +221 XX XXX XX XX
- **Téléphone** : Support local
- **Chat live** : Dashboard admin

### Horaires
- **Lundi-Vendredi** : 8h-18h (GMT)
- **Samedi** : 9h-13h
- **Urgences** : 24/7 WhatsApp

---

**Dernière mise à jour** : Décembre 2024
