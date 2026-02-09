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
