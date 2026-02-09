---
name: golden-rule
description: >
  Toujours privilégier la solution la plus simple. Éviter toute complexité inutile ou prématurée si une alternative évidente, claire et concise existe.

rationale: >
  La simplicité garantit :
    - Lisibilité et compréhension rapide du code par tous.
    - Maintenabilité et évolutivité facilitées.
    - Réduction des risques d’erreurs et de bugs cachés.
    - Facilitation de la revue de code et de l’onboarding de nouveaux membres.

examples:
  correct:
    - Utilisation d’une structure ou d’un algorithme simple lorsque cela suffit au besoin.
    - Prise en compte des outils fournis nativement par le langage ou le framework sans sur-ingénierie.
    - Suppression d’un code inutile ou d’une logique conditionnelle superflue.
  incorrect:
    - Adoption d’une complexité technique (patterns avancés, abstraction excessive, solutions “magiques”) sans nécessité concrète.
    - Multiplication des couches, outils ou dépendances pour un besoin simple.
    - Ajout de paramètres ou d’options inutiles “au cas où”.

enforcement:
  - Tout ajout ou modification de code doit être justifié par la simplicité et la lisibilité.
  - Les Pull Requests apportant une complexité non justifiée doivent être refusées ou réécrites.
  - Les cas d’exception doivent être explicitement documentés et validés collectivement.

---

# Overview

Toujours rechercher et appliquer la solution la plus simple pour chaque problème : c’est la meilleure garantie pour un code robuste, durable et maîtrisé. La simplicité s’impose comme le principal critère de qualité et prévaut sur toute optimisation ou sophistication prématurée.
