---
name: testability-rules
description: |
  Chaque use case doit être testable isolément : il ne doit dépendre ni d’un framework, ni de la base de données, ni d’API externes – uniquement d’abstractions injectées (interfaces, ports). 
  Toute logique non pure ou dépendance externe doit être mockable ou substituable lors des tests.
rationale: |
  L’indépendance des use cases permet :
    - Des tests unitaires rapides, fiables et prédictibles.
    - Une maintenance facilitée (les régressions sont vite isolées).
    - Un code évolutif, découplé des choix d’infrastructure ou de présentation.
examples:
  correct:
    - Un use case qui reçoit un repository en paramètre d’interface, sans connaître sa concrète implémentation.
    - Un use case qui n’utilise que des types métier purs et des objets injectés.
  incorrect:
    - Un use case qui appelle directement Prisma, Mongoose, Axios, ou dépend d'un décorateur/la couche NestJS/Express.
    - Un use case qui construit une connexion DB directement ou s’appuie sur un SDK externe.
enforcement:
  - Toute PR contenant un use case couplé directement à une infra/framework doit être refusée ou immédiatement refactorée.
  - L’introduction de dépendances doit toujours passer par des abstractions explicites.
---

# Overview

Un use case est isolé quand il peut être testé sans lancer l’application, sans DB ni API tierce, et sans dépendance à un framework. Il doit n’orchestrer que de la logique métier ou des ports abstraits : tout effet de bord (IO, réseau, persistance) est délégué à des adaptateurs extérieurs, injectés. Cela garantit la robustesse, la maintenabilité et l’évolutivité du projet.
