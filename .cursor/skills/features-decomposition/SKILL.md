---
name: features-decomposition
description: |
  Toute fonctionnalité métier incluant plusieurs étapes ou responsabilités doit être découpée en plusieurs use cases. 
  Chaque use case doit :
    - Porter une seule responsabilité métier (ex : valider, enregistrer, notifier)
    - Posséder une interface simple et explicite
    - Être autonome, testable, indépendant des autres
    - S’inscrire dans une structure strictement alignée sur la Clean Architecture (aucun mélange de rôles ou de couches)
rationale: |
  Cette règle vise à garantir la clarté, la maintenabilité et l’évolutivité du code :
    - Chaque étape métier isolée limite le risque de bugs et facilite les évolutions.
    - On évite qu’une fonction ou un composant englobe plusieurs missions (ex : valider + persister + notifier dans le même bloc).
    - Un découpage inadéquat entraîne confusion, dette technique et difficultés de tests.
examples:
  correct:
    - Un use case dédié pour la validation, un autre pour la persistance, un autre pour la notification.
    - Chaque use case exposé par une classe/fonction avec une seule responsabilité métier, sans dépendance sur la logique des autres.
  incorrect:
    - Un “gros” use case qui valide des entrées, crée l’entité, la sauvegarde et envoie un email dans la même méthode.
    - Une fonction qui mélange la logique de validation et la logique de persistance sans séparation claire.
enforcement:
  - Toute nouvelle fonctionnalité complexe doit obligatoirement suivre cette décomposition.
  - Refuse toute PR contenant des fonctions ou classes multipliant les responsabilités ou non alignées sur la Clean Architecture.
  - Documenter explicitement les responsabilités de chaque use case dans le code ou sa documentation associée.
---
