---
name: size-limits
description: |
  Règles de taille pour garantir lisibilité, maintenabilité et simplicité :
    - Une fonction ne doit pas excéder 40 lignes
    - Une classe ne doit pas excéder 200 lignes
    - Un fichier ne doit pas excéder 300 lignes
    - La complexité cyclomatique ne doit pas dépasser 10

---

# Overview

Impose des limites de taille strictes : toute fonction, classe ou fichier dépassant ces seuils doit être découpé. L’objectif est d'éviter l’arborescence spaghetti, de faciliter la revue de code et d’assurer la compréhension rapide par tout membre de l’équipe. La complexité cyclomatique est clé : refactore dès qu’un bloc devient trop complexe à suivre.
Respecte ces bornes dans tout le code du projet.

---

# Exceptions : quand laisser un fichier au-delà de 300 lignes

**La limite de 300 lignes est un guide pratique, pas une règle absolue.** Il est parfois préférable de laisser un fichier tel quel même s’il dépasse 300 lignes.

## Cas où ne PAS découper

- **Données statiques ou de configuration** : listes, mappings, thèmes, constantes volumineuses — le découpage ajoute de la complexité sans gain réel.
- **Bloc homogène et cohérent** : un fichier long mais avec une seule responsabilité claire et une structure lisible.
- **Découpage artificiel** : si le découpage crée des fichiers trop petits ou disperse une logique qui reste conceptuellement une seule unité.

## Cas où découper

- **Composants UI** avec beaucoup de JSX et de logique mélangée.
- **Logique métier dense** avec plusieurs responsabilités.
- **Fichiers monolithiques** (> 500 lignes) qui mélangent plusieurs rôles.

## Priorité

La priorité est la **clarté** et la **séparation des responsabilités**, pas le nombre exact de lignes. En cas de doute, privilégier la solution la plus simple. Si un fichier dépasse 300 lignes mais reste lisible et cohérent, le laisser tel quel est acceptable.
