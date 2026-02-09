---
name: minimalist-document
description: |
  Chaque module doit obligatoirement inclure un fichier README.md documentant uniquement :
    - L’objectif du module
    - Ses responsabilités métier

  Toute documentation au-delà de ces éléments strictement essentiels est interdite et doit être refusée, afin de garantir la clarté, la lisibilité et la non-redondance documentaire.

enforcement:
  - Rejeter toute PR qui introduit de la documentation superflue, dupliquée ou hors périmètre dans un module.
  - Vérifier systématiquement la présence d’un README.md synthétique et ciblé.
  - Interdire les guides, notes d’implémentation ou contenus annexes hors README.md du module.

---

# Overview

Chaque module doit se limiter à un README.md succinct précisant uniquement son objectif et ses responsabilités métier. Toute documentation supplémentaire ou redondante est proscrite afin d’assurer une communication claire, concise et maintenable pour toutes les équipes.
