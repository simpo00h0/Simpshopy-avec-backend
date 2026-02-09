---
name: strict-typescript
description: |
  Toutes les parties du projet doivent adopter une utilisation stricte de TypeScript, sans aucune tolérance pour les types implicites ou les "any". 
  Le typage doit toujours être explicite : chaque fonction, classe, paramètre, retour, propriété et module doit déclarer le type adéquat.
  Le mode strict du compilateur TypeScript (`strict: true` dans tsconfig) est obligatoire et toutes les options de sécurité (noImplicitAny, strictNullChecks, etc.) doivent être activées.
rationale: |
  L’utilisation stricte des types garantit :
    - Une robustesse maximum du code (détection précoce des erreurs)
    - Des refactorings sécurisés et fiables
    - Une documentation automatique via les signatures de types
    - Une meilleure lisibilité et compréhension pour toute l’équipe
examples:
  correct:
    - Déclaration explicite des types de retour pour toutes les fonctions.
    - Pas d'utilisation du type `any`.
    - Utilisation de types et interfaces custom métier à la place des objets bruts.
    - Généricité encadrée par des contraintes de type précises.
  incorrect:
    - Omettre les types de paramètres ou de retour.
    - Toute utilisation du type `any` ou de cast excessif.
    - Code compilant en mode non strict.
    - Dépendances à des packages ou du code JavaScript non typé.
enforcement:
  - Aucun type implicite toléré (pas de "any", pas de typage par défaut).
  - CI/CD doit refuser toute PR n’étant pas strictement typée.
  - Revue obligatoire pour toute levée temporaire de règle via `@ts-ignore` (à bannir sauf cas exceptionnel documenté).

---

# Overview

Impose une discipline stricte sur l'utilisation de TypeScript : pas de type implicite, aucun "any", chaque valeur est typée explicitement. Cette règle est fondamentale pour garantir la fiabilité, la maintenabilité, et accompagner sereinement la croissance du projet. Aucun contournement ne sera accepté : le respect du typage strict est obligatoire pour tout commit accepté dans la base de code.
