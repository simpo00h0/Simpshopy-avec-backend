---
name: absolute-prohibitions
description: |
  Les points suivants sont strictement interdits dans ce projet :
    - Intégrer de la logique métier directement dans les controllers (présentation)
    - Accéder à Prisma ou à toute infrastructure de persistence dans les use cases (application)
    - Toute forme de duplication de code, quelle qu'en soit la taille
    - Utiliser des fonctions monolithiques (trop longues, responsables de plusieurs tâches)
    - Employer une logique conditionnelle complexe ou imbriquée de façon excessive
    - Ajouter des commentaires pour « justifier » ou tenter d’expliquer du code mal organisé ou mal structuré
rationale: |
  Ces interdictions visent à préserver la clarté architecturale, la maintenabilité, et la robustesse du code. Leur non-respect entraîne un code difficile à tester, relire et faire évoluer.
examples:
  incorrect:
    - Ajouter une validation ou un calcul métier dans un controller Express/NestJS
    - Effectuer un `prisma.user.findMany` dans un fichier d'use case
    - Copier-coller la même fonction utilitaire dans plusieurs modules
    - Ecrire une fonction de 120 lignes remplie d'effets de bord et de switch imbriqués
    - Laisser des commentaires du type « Attention: ce bloc sert à x car sinon ça plante »
  correct:
    - Logique métier isolée dans le domaine ou use case dédié
    - Accès à Prisma strictement dans les repositories infrastructurels
    - Extraction systématique et dédoublonnage du code commun
    - Petites fonctions simples à responsabilité unique
    - Pas besoin de commenter une structure bien pensée
enforcement:
  - Refuse toute PR contenant l’un de ces interdits flagrants.
  - Oblige à refactorer toute portion de code contrevenante avant merge.
---

# Overview

Cette règle recense les interdits majeurs à respecter pour garantir la lisibilité, la maintenabilité et l’alignement avec l’architecture Clean/Hexagonale du projet.
Tout manquement doit être repéré, documenté et corrigé sans délai avant toute livraison ou code review critique.
