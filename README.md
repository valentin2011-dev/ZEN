[README.md](https://github.com/user-attachments/files/32145368/README.md)
# ZEN — PWA

Version V1 complète pour GitHub Pages.

## Ce qui est inclus

- Écran de lancement ZEN avec le visuel fourni.
- Accueil inspiré de la maquette : fond Dubai, montre vivante, quote, trois raccourcis.
- Quatre écrans : accueil, notes, projets, motivation.
- Montres CSS recréées avec de vraies aiguilles : heures, minutes, secondes en temps réel.
- Notes : ajout, suppression, favoris « idée importante », affichage des 7 dernières et filtre toutes/importantes.
- Projets : création de dossiers, notes, import d'une note existante, ajout de photos et suppression.
- Motivation : citation principale + ajout/suppression de citations.
- Réglages : thème sombre/clair, français/anglais, changement du fond par photo.
- Mode ZEN.
- Données sauvegardées dans `localStorage`.
- PWA + service worker pour fonctionnement hors-ligne après première visite.

## Mise en ligne sur GitHub Pages

1. Crée un repository GitHub.
2. Mets **tout le contenu de ce dossier** à la racine du repository.
3. GitHub → Settings → Pages.
4. Source : **Deploy from a branch**.
5. Choisis `main` et `/ (root)`.
6. Ouvre l'URL GitHub Pages fournie par GitHub.

## Important

Les photos de montres originales restent dans `assets/` comme références/ressources. Les cadrans affichés dans l'application sont reconstruits en HTML/CSS afin que les aiguilles puissent réellement tourner.

Pour un résultat visuel encore plus proche de la maquette, les paramètres de taille, flou, transparence et typographie sont centralisés dans `style.css`.
