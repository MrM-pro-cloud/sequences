[README.md](https://github.com/user-attachments/files/30328618/README.md)
# Séquences EM — Générateur de séquences d'éducation musicale

Application web statique (sans serveur, sans dépendance) pour générer des
séquences d'éducation musicale au collège : problématique, scénario de
séances, fiche élève et fiche professeur imprimables au format A4.

## Déploiement sur GitHub Pages

1. Créez un nouveau dépôt GitHub (ex. `sequences-em`), ou réutilisez un
   dépôt existant.
2. Copiez-y tous les fichiers de ce dossier (`index.html`, `style.css`,
   `app.js`, `data.js`, `manifest.json`, `sw.js`, `icons/`).
3. Poussez le contenu sur la branche `main`.
4. Dans les paramètres du dépôt (**Settings → Pages**), choisissez la
   branche `main` et le dossier racine (`/`).
5. L'application sera accessible à une adresse du type
   `https://<votre-utilisateur>.github.io/sequences-em/`.

## Installation sur iPhone (PWA)

1. Ouvrez l'URL ci-dessus dans Safari sur iPhone.
2. Appuyez sur le bouton de partage, puis **« Sur l'écran d'accueil »**.
3. L'application s'ouvrira ensuite comme une app native, sans barre
   d'adresse, avec mise en cache pour un usage sans connexion.

## Installation sur Mac

Ouvrez simplement l'URL dans Safari ou Chrome. Vous pouvez aussi
l'ajouter au Dock via Safari : **Fichier → Ajouter au Dock**.

## Enrichir la bibliothèque de gabarits (`data.js`)

C'est le cœur pédagogique de l'outil. Chaque niveau contient un tableau
`notions`. Pour ajouter une notion :

```js
{
  id: "identifiant-unique",
  titre: "Titre affiché",
  domaine: "Un des 6 domaines complémentaires du cycle 4 (ou libre pour le cycle 3)",
  attendus: ["...", "..."],
  vocabulaire: ["...", "..."],
  problematiques_exemples: ["...", "..."],
  oeuvres_suggerees: [{ titre: "...", auteur: "...", note: "..." }],
  a_valider: true
}
```

**Important** : les champs `oeuvres_suggerees` et `problematiques_exemples`
sont des exemples de départ, pas des références validées. Avant tout usage
en classe ou en inspection, relisez et complétez ces champs avec vos
propres choix d'œuvres et votre expertise disciplinaire. Les champs
`competences` et `attendus` reprennent la formulation du Bulletin
officiel (BO spécial n°11 du 26 novembre 2015) ; vérifiez-les si le
programme venait à évoluer.

## Limites actuelles (Phase 1)

Cette première version couvre : questionnaire de paramétrage, génération
de la problématique et du scénario de séances, fiche élève et fiche
professeur imprimables.

**Non couvert pour l'instant (Phase 2 à construire)** :
- QCM d'évaluation formative
- Évaluation sommative de fin de séquence

Ces modules peuvent être ajoutés dans une itération suivante, une fois
le noyau (séquence + fiches) validé en usage réel.

## Confidentialité

Aucune donnée n'est envoyée à un serveur : tout le traitement se fait
dans le navigateur. La bibliothèque de gabarits est un fichier statique
inclus dans le dépôt.
