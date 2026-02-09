---
name: mandatory-architecture
description: |
  Cette règle impose une architecture strictement inspirée de Clean Architecture / Hexagonal.

  **Séparation stricte des couches :**
  - Presentation (controllers)
  - Application (use cases)
  - Domain (logique métier pure)
  - Infrastructure (DB, APIs, services externes)

  **Aucune exception n'est tolérée.**

---

# Overview

Respecte la séparation stricte des responsabilités : ne mélange jamais la logique métier, les détails d’infrastructure ou les cas d’usage dans les mêmes modules. Cette règle guide toute décision d’architecture sur ce projet.
