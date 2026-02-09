---
name: folder-structure-backend
description: |
  Chaque fonctionnalité doit être organisée en un module totalement indépendant, respectant la séparation stricte des responsabilités Clean Architecture / Hexagonal.

  **Structure requise :**

  module/
   ├── application/
   │    └── *.usecase.ts            # Cas d'usage (orchestration métier applicatif)
   ├── domain/
   │    ├── *.entity.ts             # Entités métier pures
   │    ├── *.policy.ts             # Règles métier/stratégies
   │    └── *.value-object.ts       # Value objects métier
   ├── infrastructure/
   │    └── *.repository.ts         # Implémentations concrètes (DB, APIs…)
   ├── presentation/
   │    └── *.controller.ts         # Entrées (HTTP, GraphQL…)
   └── module.module.ts             # Définition du module (dépendances, exports)

---

# Overview

Chaque dossier de module du backend isole indépendamment toutes les couches de la fonctionnalité : présentation (contrôleurs), application (use cases), domaine (logique métier pure), infrastructure (accès DB/services). 
Aucune logique d’une couche ne doit « fuiter » dans une autre. On ne référence JAMAIS directement la DB ou des détails infra dans le domaine ou l’application : on passe par des abstractions.

Ce découpage vise :
- Lisibilité maximale : chaque développeur comprend où modifier/ajouter une logique.
- Scalabilité : chaque module peut (à terme) devenir microservice.
- Maintenabilité : isolation des dépendances, impact limité des modifications.

Suis cette structure sans exception pour tout nouveau module backend.
