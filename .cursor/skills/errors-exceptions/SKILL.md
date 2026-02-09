---
name: errors-exceptions
description: |
  La gestion des erreurs et exceptions doit impérativement répondre à ces exigences :
    - Toute erreur doit être détectée et propagée explicitement, sans jamais être ignorée ou masquée silencieusement.
    - Seules des exceptions dédiées et typées (classes ou types métier explicites) sont acceptées : il est interdit de lancer des chaînes de caractères, des objets bruts ou tout type non défini/any.
    - La capture, transformation, journalisation ou cartographie des erreurs doit être centralisée exclusivement dans une couche technique dédiée (middleware, interceptor…). En dehors de cette couche, toute gestion d’erreur est interdite.

rationale: |
  Respecter ces principes permet :
    - Une traçabilité et une lisibilité claires des erreurs.
    - Une gestion homogène et prévisible des comportements d’exception.
    - L’absence de bugs silencieux causés par la dissimulation ou une gestion dispersée des erreurs.
    - Une robustesse et une maintenabilité accrues sur toute la chaîne applicative.

enforcement:
  - Toute utilisation de blocs try/catch silencieux ou partiels est interdite : chaque erreur doit être propagée ou journalisée explicitement dans la couche technique dédiée.
  - Seules les exceptions typées (classes dédiées, héritage explicite d’Error) sont autorisées via throw ; il est interdit d’utiliser throw avec une chaîne, un objet brut ou un type any.
  - La capture ou la manipulation d’erreurs dans le domaine, l’application ou la présentation est interdite.
  - Toute Pull Request ne respectant pas ces règles devra être corrigée avant validation.

examples:
  correct:
    - Définir une classe d’exception métier explicite (`ProductUnavailableError extends Error`) et la propager sans gestion métier locale.
    - Centraliser toutes les transformations et la journalisation des erreurs dans un middleware ou interceptor technique unique.
    - Propager l’exception au travers des signatures d’interface sans la manipuler dans les couches intermédiaires.

  incorrect:
    - Interdit de lancer une exception non typée (exemple : throw d’une chaîne ou d’un objet brut).
    - ❌ `catch (e) {}` ou tout bloc qui supprime ou cache une erreur sans propagation/journalisation centralisée : cela rend la PR non valide.
    - Gérer ou transformer les exceptions dans plusieurs couches comme les contrôleurs, use cases ou domaine.

---

# Overview

La gestion des erreurs et exceptions doit être explicitement typée et centralisée dans une seule couche technique (middleware, interceptor, etc.). Aucune manipulation, interception ou journalisation d’erreur ne doit avoir lieu dans les couches présentation, application ou domaine. Cette règle vise à garantir la robustesse, la lisibilité et l’évolutivité du projet.
