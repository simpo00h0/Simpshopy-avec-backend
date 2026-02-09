---
name: pre-coding-procedure
description: >
  Toute modification ou création de règle projet doit suivre une procédure stricte et séquentielle validée avant toute implémentation.

rationale: >
  Cette exigence assure cohérence, robustesse et maintenabilité en évitant toute dérive architecturale ou décision unilatérale.

enforcement:
  - Refuser toute PR, commit ou merge qui ne justifie pas explicitement une validation collective préalable de la structure et des responsabilités.
  - L’adéquation à l’architecture Clean Architecture et l’absence de recouvrement des responsabilités sont systématiquement contrôlées lors de la revue.
  - Aucune exception, adaptation partielle ou dérogation n’est tolérée.

steps:
  - Proposer une organisation des fichiers alignée sur la Clean Architecture (présentation, application, domaine, infrastructure).
  - Définir une responsabilité unique claire et non-recouvrante pour chaque fichier.
  - Soumettre cette organisation et ces responsabilités à une validation écrite et collective avant de coder.
  - Attendre l’approbation documentée de cette structure pour débuter l’implémentation.
  - Limiter chaque modification à un incrément minimal, cohérent et motivé, strictement conforme à la structure validée.
  - Corriger immédiatement toute modification non conforme à ce processus.

---
# Overview

Aucune évolution ou découpage de règle ne peut se faire sans accord formel et traçable sur l’organisation et la responsabilité des fichiers. Cela préserve durablement la clarté et l’alignement du projet sur la Clean Architecture.
