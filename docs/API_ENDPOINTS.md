# 📚 Documentation API REST - Simpshopy

## 🔐 Authentification

Tous les endpoints (sauf `/auth/*` et `/shipping/calculate`) nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

---

## 📦 Endpoints par Module

### 1. 💰 Commissions

#### `POST /api/v1/commissions/calculate`
Calculer la commission pour un montant.

**Body:**
```json
{
  "storeId": "store-uuid-123",
  "amount": 50000,
  "appliesTo": "order"
}
```

**Response:**
```json
{
  "amount": 2500,
  "percentage": 5,
  "type": "percentage",
  "plan": "FREE"
}
```

---

### 2. 💳 Wallet

#### `GET /api/v1/wallet/balance`
Obtenir le solde du wallet.

**Response:**
```json
{
  "balance": 125000,
  "currency": "XOF"
}
```

#### `POST /api/v1/wallet/credit`
Créditer le wallet.

**Body:**
```json
{
  "amount": 50000,
  "type": "credit",
  "orderId": "order-uuid-123",
  "description": "Paiement commande #123"
}
```

#### `POST /api/v1/wallet/debit`
Débiter le wallet.

**Body:**
```json
{
  "amount": 10000,
  "type": "payout",
  "description": "Retrait vers compte bancaire"
}
```

#### `GET /api/v1/wallet/transactions?limit=50`
Obtenir l'historique des transactions.

**Query Params:**
- `limit` (optionnel, défaut: 50)

**Response:**
```json
[
  {
    "id": "txn-uuid-123",
    "type": "credit",
    "amount": 50000,
    "balance": 125000,
    "orderId": "order-uuid-123",
    "description": "Paiement commande #123",
    "createdAt": "2024-12-01T10:00:00Z"
  }
]
```

---

### 3. 📦 Orders

#### `POST /api/v1/orders`
Créer une nouvelle commande.

**Body:**
```json
{
  "storeId": "store-uuid-123",
  "items": [
    {
      "productId": "product-uuid-123",
      "variantId": "variant-uuid-123",
      "quantity": 2,
      "price": 25000
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+221771234567",
    "addressLine1": "123 Rue de la République",
    "city": "Dakar",
    "country": "SN"
  },
  "paymentMethod": "MOBILE_MONEY",
  "shippingZoneId": "zone-uuid-123",
  "shippingMethodId": "method-uuid-123"
}
```

**Response:**
```json
{
  "id": "order-uuid-123",
  "orderNumber": "ORD-1234567890-123",
  "subtotal": 50000,
  "taxAmount": 9000,
  "shippingAmount": 2000,
  "platformFeeAmount": 2500,
  "total": 63500,
  "status": "PENDING"
}
```

#### `GET /api/v1/orders`
Liste des commandes.

**Query Params:**
- `storeId` (optionnel)
- `status` (optionnel)

**Response:**
```json
[
  {
    "id": "order-uuid-123",
    "orderNumber": "ORD-1234567890-123",
    "total": 63500,
    "status": "CONFIRMED",
    "items": [...],
    "store": {...}
  }
]
```

#### `GET /api/v1/orders/:id`
Détails d'une commande.

**Response:**
```json
{
  "id": "order-uuid-123",
  "orderNumber": "ORD-1234567890-123",
  "items": [...],
  "store": {...},
  "customer": {...}
}
```

#### `POST /api/v1/orders/:id/confirm-payment`
Confirmer le paiement d'une commande.

**Body:**
```json
{
  "paymentId": "payment-id-123"
}
```

**Response:**
```json
{
  "message": "Paiement confirmé avec succès"
}
```

---

### 4. 🚚 Shipping

#### `POST /api/v1/shipping/calculate`
Calculer les options de livraison (public, pas besoin d'auth).

**Body:**
```json
{
  "storeId": "store-uuid-123",
  "country": "SN",
  "city": "Dakar",
  "weight": 2.5
}
```

**Response:**
```json
[
  {
    "method": {
      "id": "method-uuid-123",
      "name": "Livraison Standard",
      "price": 2000,
      "currency": "XOF"
    },
    "price": 2000,
    "currency": "XOF",
    "estimatedDays": "2-5 jours"
  }
]
```

---

### 5. 📋 Events

#### `POST /api/v1/events`
Créer un log d'événement.

**Body:**
```json
{
  "type": "ORDER_CREATED",
  "storeId": "store-uuid-123",
  "payload": {
    "orderId": "order-uuid-123"
  }
}
```

#### `GET /api/v1/events`
Liste des événements.

**Query Params:**
- `storeId` (optionnel)
- `type` (optionnel)
- `limit` (optionnel, défaut: 50)

---

### 6. 📄 Pages

#### `POST /api/v1/pages`
Créer une nouvelle page.

**Body:**
```json
{
  "title": "Ma Page",
  "slug": "ma-page",
  "content": {
    "sections": [...]
  }
}
```

#### `GET /api/v1/pages`
Liste des pages.

**Query Params:**
- `storeId` (optionnel)
- `published` (optionnel: true/false)

#### `GET /api/v1/pages/:id`
Détails d'une page.

#### `PUT /api/v1/pages/:id?createVersion=true&note=Modification`
Mettre à jour une page.

**Query Params:**
- `createVersion` (optionnel, défaut: true)
- `note` (optionnel)

**Body:**
```json
{
  "title": "Ma Page Modifiée",
  "content": {...},
  "isPublished": true
}
```

#### `GET /api/v1/pages/:id/versions`
Liste des versions d'une page.

**Response:**
```json
[
  {
    "id": "version-uuid-123",
    "version": 2,
    "note": "Ajout section produits",
    "createdAt": "2024-12-01T10:00:00Z"
  }
]
```

#### `POST /api/v1/pages/:id/restore/:version`
Restaurer une version précédente.

**Response:**
```json
{
  "id": "page-uuid-123",
  "content": {...},
  "version": 3
}
```

---

## 🔒 Permissions

### Par Rôle

- **ADMIN** : Accès complet à toutes les ressources
- **SELLER** : Accès uniquement à ses propres ressources (store, orders, pages, etc.)
- **CUSTOMER** : Accès uniquement à ses propres commandes

### Auto-détection

Les controllers détectent automatiquement le rôle de l'utilisateur connecté et filtrent les données en conséquence :

- **SELLER** : Accès automatique à sa boutique
- **CUSTOMER** : Accès uniquement à ses commandes
- **ADMIN** : Accès à tout

---

## 📝 Swagger Documentation

La documentation Swagger complète est disponible à :
```
http://localhost:3000/api/docs
```

---

**Dernière mise à jour** : Décembre 2024
