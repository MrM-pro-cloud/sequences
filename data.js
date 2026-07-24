/*
 * BASE DE GABARITS PÉDAGOGIQUES — Éducation musicale, collège
 * -------------------------------------------------------------
 * Fichier à éditer directement (ou via l'écran "Bibliothèque" de l'app).
 * Le champ "competences" (les 4 compétences travaillées par cycle) reprend
 * la formulation exacte et vérifiée du Bulletin officiel. Les champs
 * "attendus" sont des formulations pédagogiques inspirées des domaines du
 * programme, pas des citations littérales vérifiées — à confronter aux
 * attendus de fin de cycle officiels avant usage en inspection.
 * Les champs "oeuvres_suggerees" et "problematiques_exemples" sont des
 * PROPOSITIONS D'EXEMPLE : à vérifier, corriger et compléter selon votre
 * progression réelle et vos choix d'œuvres avant tout usage en classe.
 *
 * "ordre" et "periode" proposent un enchaînement annuel indicatif (8
 * séquences réparties sur 5 périodes). Les périodes sont génériques
 * (Période 1 à 5) : le calendrier scolaire de la zone Antilles-Guyane
 * (Martinique) diffère de celui de la Métropole (rentrée, Carnaval,
 * vacances) — à recaler sur le calendrier officiel de l'année en cours.
 *
 * Référence réglementaire commune :
 * BO spécial n°11 du 26 novembre 2015 (arrêté du 9 novembre 2015)
 *  - Annexe 2 : programme du cycle 3 (6e)
 *  - Annexe 3 : programme du cycle 4 (5e, 4e, 3e)
 */

const GABARITS = {
  "6e": {
    cycle: "Cycle 3",
    reference_programme: "BO spécial n°11 du 26 novembre 2015 (arrêté du 9-11-2015), Annexe 2 — programme du cycle 3",
    competences: [
      "Chanter et interpréter",
      "Écouter, comparer et commenter",
      "Explorer, imaginer et créer",
      "Échanger, partager et argumenter"
    ],
    notions: [
      {
        id: "pulsation-rythme-tempo",
        ordre: 1,
        periode: "Période 1",
        titre: "Pulsation, rythme et tempo",
        domaine: "Temps et rythme",
        attendus: [
          "Reproduire un rythme, une formule rythmique simple, après écoute",
          "Repérer et situer des caractéristiques musicales simples d'une pulsation à un tempo donné",
          "Identifier des variations de tempo à l'écoute (accelerando, ritardando)"
        ],
        vocabulaire: ["pulsation", "rythme", "tempo", "accelerando", "ritardando", "ostinato"],
        problematiques_exemples: [
          "Comment la musique organise-t-elle notre perception du temps ?",
          "Le tempo peut-il changer le sens d'une musique ?"
        ],
        oeuvres_suggerees: [
          { titre: "Boléro (extrait)", auteur: "Maurice Ravel", note: "pulsation stable, ostinato rythmique — à confirmer selon durée disponible" },
          { titre: "Exemple de bèlè martiniquais à sélectionner", auteur: "à préciser", note: "ancrage culturel local — pulsation portée par le tambour bèlè ; référence précise à valider par vous" }
        ],
        a_valider: true
      },
      {
        id: "timbre-formations",
        ordre: 4,
        periode: "Période 2",
        titre: "Timbre et formations instrumentales",
        domaine: "Timbre et espace",
        attendus: [
          "Décrire et comparer des éléments sonores en utilisant un vocabulaire spécifique",
          "Identifier des types de formations vocales et/ou instrumentales"
        ],
        vocabulaire: ["timbre", "formation instrumentale", "orchestre", "voix (soprano, alto, ténor, basse)"],
        problematiques_exemples: [
          "Comment reconnaît-on un instrument à son timbre ?",
          "Une même mélodie change-t-elle de sens selon qui la joue ?"
        ],
        oeuvres_suggerees: [
          { titre: "Pierre et le Loup (extraits)", auteur: "Sergueï Prokofiev", note: "association thème/timbre instrumental" }
        ],
        a_valider: true
      },
      {
        id: "dynamique-nuances",
        ordre: 3,
        periode: "Période 2",
        titre: "Dynamique et nuances",
        domaine: "Dynamique",
        attendus: [
          "Repérer et reproduire des variations d'intensité dans une musique",
          "Utiliser des nuances de façon expressive dans une interprétation vocale"
        ],
        vocabulaire: ["intensité", "nuance", "piano", "forte", "crescendo", "decrescendo"],
        problematiques_exemples: [
          "Comment les nuances donnent-elles du sens à une musique ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple à fort contraste dynamique à sélectionner", auteur: "à préciser", note: "contrastes piano/forte marqués — titre à valider par vous" }
        ],
        a_valider: true
      },
      {
        id: "unisson-canon-simple",
        ordre: 6,
        periode: "Période 4",
        titre: "Chanter à l'unisson et en canon",
        domaine: "Successif et simultané",
        attendus: [
          "Chanter avec justesse une mélodie simple, seul ou en groupe",
          "Découvrir les contraintes du chant en canon à deux voix"
        ],
        vocabulaire: ["unisson", "canon", "voix seule", "polyphonie simple"],
        problematiques_exemples: [
          "Chanter à plusieurs, est-ce plus difficile que chanter seul ?"
        ],
        oeuvres_suggerees: [
          { titre: "Canon traditionnel à 2 voix, à sélectionner selon le projet choral", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "forme-couplet-refrain-simple",
        ordre: 7,
        periode: "Période 4",
        titre: "Repérer la forme couplet/refrain",
        domaine: "Forme",
        attendus: [
          "Repérer les grandes parties d'une chanson à l'écoute",
          "Représenter simplement la structure d'une musique (frise, schéma)"
        ],
        vocabulaire: ["couplet", "refrain", "introduction", "forme"],
        problematiques_exemples: [
          "Pourquoi retient-on plus facilement le refrain d'une chanson ?"
        ],
        oeuvres_suggerees: [
          { titre: "Chanson à structure couplet/refrain claire, à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "geste-corps-pulsation",
        ordre: 5,
        periode: "Période 3",
        titre: "Musique et geste : le corps dans la pulsation",
        domaine: "Temps et rythme",
        attendus: [
          "Traduire corporellement une pulsation ou un rythme entendu",
          "Coordonner un geste rythmique simple avec un groupe"
        ],
        vocabulaire: ["geste musical", "percussions corporelles", "coordination"],
        problematiques_exemples: [
          "Le corps peut-il « jouer » de la musique sans instrument ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de percussions corporelles ou de body percussion à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "voix-parlee-chantee",
        ordre: 2,
        periode: "Période 1",
        titre: "Voix parlée et voix chantée",
        domaine: "Timbre et espace",
        attendus: [
          "Distinguer les caractéristiques de la voix parlée et de la voix chantée",
          "Expérimenter les possibilités expressives de sa propre voix"
        ],
        vocabulaire: ["voix parlée", "voix chantée", "diction", "timbre vocal"],
        problematiques_exemples: [
          "Qu'est-ce qui différencie parler et chanter ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple alternant passages parlés et chantés (slam, comédie musicale), à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "musiques-du-monde-reperes",
        ordre: 8,
        periode: "Période 5",
        titre: "Musiques du monde : premiers repères",
        domaine: "Style",
        attendus: [
          "Repérer des caractéristiques musicales propres à une aire culturelle",
          "Situer géographiquement l'origine d'une musique écoutée"
        ],
        vocabulaire: ["musique du monde", "diversité culturelle", "instrument traditionnel"],
        problematiques_exemples: [
          "Comment reconnaît-on qu'une musique vient d'une culture précise ?"
        ],
        oeuvres_suggerees: [
          { titre: "Corpus de 2-3 musiques traditionnelles contrastées, dont un exemple martiniquais, à sélectionner", auteur: "à préciser", note: "ancrage culturel local — sélection à valider par vous" }
        ],
        a_valider: true
      }
    ]
  },

  "5e": {
    cycle: "Cycle 4",
    reference_programme: "BO spécial n°11 du 26 novembre 2015 (arrêté du 9-11-2015), Annexe 3 — programme du cycle 4",
    competences: [
      "Réaliser des projets musicaux d'interprétation ou de création",
      "Écouter, comparer, construire une culture musicale commune",
      "Explorer, imaginer, créer et produire",
      "Échanger, partager, argumenter et débattre"
    ],
    domaines_complementaires: ["Timbre et espace", "Temps et rythme", "Dynamique", "Successif et simultané", "Forme", "Style"],
    notions: [
      {
        id: "parametres-son",
        ordre: 1,
        periode: "Période 1",
        titre: "Les paramètres du son : hauteur, intensité, timbre",
        domaine: "Dynamique",
        attendus: [
          "Identifier, caractériser et comparer des musiques après écoute",
          "Repérer des similitudes et différences entre deux ou plusieurs œuvres"
        ],
        vocabulaire: ["hauteur", "intensité", "nuance", "crescendo", "decrescendo", "timbre"],
        problematiques_exemples: [
          "Comment un compositeur joue-t-il avec les nuances pour raconter une histoire ?",
          "L'intensité sonore change-t-elle notre ressenti d'une musique ?"
        ],
        oeuvres_suggerees: [
          { titre: "Une Nuit sur le Mont Chauve (extrait)", auteur: "Modeste Moussorgski", note: "contrastes dynamiques marqués — à confirmer selon le projet vocal en cours" }
        ],
        a_valider: true
      },
      {
        id: "successif-simultane",
        ordre: 3,
        periode: "Période 2",
        titre: "Écritures successives et simultanées (monodie, polyphonie)",
        domaine: "Successif et simultané",
        attendus: [
          "Percevoir et caractériser des superpositions ou successions de sons",
          "Distinguer monodie, polyphonie, homophonie à l'écoute"
        ],
        vocabulaire: ["monodie", "polyphonie", "homophonie", "canon", "contrepoint"],
        problematiques_exemples: [
          "Une musique à plusieurs voix est-elle toujours plus complexe qu'une musique à une seule voix ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de chant lewoz ou de gwo-ka à sélectionner", auteur: "à préciser", note: "dialogue voix/tambour — sélection précise à valider par vous" }
        ],
        a_valider: true
      },
      {
        id: "temps-rythme-mesure",
        ordre: 2,
        periode: "Période 1",
        titre: "Mesure, temps forts et temps faibles",
        domaine: "Temps et rythme",
        attendus: [
          "Percevoir et représenter une mesure simple (binaire, ternaire)",
          "Distinguer temps fort et temps faible à l'écoute et dans la pratique"
        ],
        vocabulaire: ["mesure", "temps fort", "temps faible", "binaire", "ternaire"],
        problematiques_exemples: [
          "Comment la mesure structure-t-elle notre perception d'une musique ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple à mesure ternaire (valse) à comparer avec un exemple binaire, à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "timbre-espace-spatialisation",
        ordre: 5,
        periode: "Période 3",
        titre: "Timbre, espace et spatialisation du son",
        domaine: "Timbre et espace",
        attendus: [
          "Décrire l'occupation de l'espace sonore d'une musique",
          "Identifier des effets de spatialisation (proche/lointain, stéréophonie)"
        ],
        vocabulaire: ["spatialisation", "espace sonore", "proche/lointain", "stéréophonie"],
        problematiques_exemples: [
          "Comment un compositeur ou un ingénieur du son joue-t-il avec l'espace ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple avec effets d'espace marqués, à sélectionner", auteur: "à préciser", note: "musique électroacoustique ou de concert — titre à valider par vous" }
        ],
        a_valider: true
      },
      {
        id: "musique-image-intro",
        ordre: 8,
        periode: "Période 5",
        titre: "Musique et image : une première approche",
        domaine: "Style",
        attendus: [
          "Mettre en relation une musique et une image ou une situation",
          "Justifier un choix musical en fonction d'une intention narrative"
        ],
        vocabulaire: ["musique de film", "ambiance sonore", "intention", "synchronisation"],
        problematiques_exemples: [
          "La musique peut-elle raconter une histoire sans les mots ?"
        ],
        oeuvres_suggerees: [
          { titre: "Extrait de musique de film significatif, à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "forme-cyclique",
        ordre: 7,
        periode: "Période 4",
        titre: "Formes cycliques et principe de reprise",
        domaine: "Forme",
        attendus: [
          "Repérer un principe de reprise ou de boucle dans une musique",
          "Représenter la structure cyclique d'une musique écoutée"
        ],
        vocabulaire: ["forme cyclique", "reprise", "boucle formelle"],
        problematiques_exemples: [
          "La répétition rend-elle une musique plus facile à retenir, ou plus monotone ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple à structure cyclique marquée (musique répétitive, boucle électronique), à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "instruments-traditionnels-monde",
        ordre: 4,
        periode: "Période 2",
        titre: "Instruments traditionnels et facture instrumentale",
        domaine: "Style",
        attendus: [
          "Identifier des instruments traditionnels à l'écoute et par leur mode de fabrication",
          "Mettre en relation un instrument avec son contexte culturel d'origine"
        ],
        vocabulaire: ["instrument traditionnel", "facture instrumentale", "lutherie"],
        problematiques_exemples: [
          "Le matériau d'un instrument influence-t-il sa musique ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple avec instrument traditionnel identifiable (tambour bèlè, ti-bwa...), à sélectionner", auteur: "à préciser", note: "ancrage culturel local — sélection à valider par vous" }
        ],
        a_valider: true
      },
      {
        id: "rythme-danse",
        ordre: 6,
        periode: "Période 4",
        titre: "Rythme et danse",
        domaine: "Temps et rythme",
        attendus: [
          "Mettre en relation une formule rythmique et un pas ou un style de danse associé",
          "Percevoir la carrure d'une musique de danse"
        ],
        vocabulaire: ["danse", "carrure", "pas de danse"],
        problematiques_exemples: [
          "Le rythme d'une musique impose-t-il une façon de danser ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de musique de danse antillaise (zouk, biguine) à sélectionner", auteur: "à préciser", note: "ancrage culturel local — sélection à valider par vous" }
        ],
        a_valider: true
      }
    ]
  },

  "4e": {
    cycle: "Cycle 4",
    reference_programme: "BO spécial n°11 du 26 novembre 2015 (arrêté du 9-11-2015), Annexe 3 — programme du cycle 4",
    competences: [
      "Réaliser des projets musicaux d'interprétation ou de création",
      "Écouter, comparer, construire une culture musicale commune",
      "Explorer, imaginer, créer et produire",
      "Échanger, partager, argumenter et débattre"
    ],
    domaines_complementaires: ["Timbre et espace", "Temps et rythme", "Dynamique", "Successif et simultané", "Forme", "Style"],
    notions: [
      {
        id: "forme-construction",
        ordre: 1,
        periode: "Période 1",
        titre: "Forme et construction de l'œuvre",
        domaine: "Forme",
        attendus: [
          "Repérer des grandes lignes formelles d'une œuvre (couplet/refrain, rondo, thème et variations)",
          "Représenter graphiquement la structure d'une musique écoutée"
        ],
        vocabulaire: ["forme", "couplet", "refrain", "rondo", "thème et variations", "coda"],
        problematiques_exemples: [
          "Comment la répétition et la variation construisent-elles une œuvre musicale ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de zouk à structure couplet/refrain marquée, à sélectionner", auteur: "à préciser", note: "ancrage culturel local — titre précis à valider par vous" }
        ],
        a_valider: true
      },
      {
        id: "mao-creation-numerique",
        ordre: 5,
        periode: "Période 3",
        titre: "Créer avec les outils numériques (MAO)",
        domaine: "Timbre et espace / Forme",
        attendus: [
          "Exploiter les fonctions de base d'un logiciel simple de traitement du son",
          "Imaginer des solutions inventives et adaptées à un projet de création sonore"
        ],
        vocabulaire: ["MAO", "boucle", "piste", "arrangement", "échantillon", "édition sonore"],
        problematiques_exemples: [
          "Comment les outils numériques transforment-ils l'acte de composer ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemples de musiques électroniques/pop composées en home studio, à sélectionner selon l'activité AP MAO", auteur: "à préciser", note: "cohérence à établir avec votre atelier AP MAO existant" }
        ],
        a_valider: true
      },
      {
        id: "polyrythmie-temps-rythme",
        ordre: 3,
        periode: "Période 2",
        titre: "Rythmes complexes et polyrythmie",
        domaine: "Temps et rythme",
        attendus: [
          "Percevoir et reproduire des superpositions rythmiques simples",
          "Identifier des exemples de polyrythmie dans des musiques de tradition orale"
        ],
        vocabulaire: ["polyrythmie", "superposition rythmique", "tambour", "ostinato"],
        problematiques_exemples: [
          "Comment plusieurs rythmes peuvent-ils coexister sans se contredire ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de bèlè ou de percussions traditionnelles martiniquaises à sélectionner", auteur: "à préciser", note: "polyrythmie caractéristique des musiques traditionnelles antillaises — sélection précise à valider par vous" }
        ],
        a_valider: true
      },
      {
        id: "plans-sonores-orchestration",
        ordre: 4,
        periode: "Période 2",
        titre: "Superposition de plans sonores et orchestration",
        domaine: "Successif et simultané",
        attendus: [
          "Distinguer plusieurs plans sonores superposés dans une texture musicale",
          "Identifier le rôle de chaque plan (mélodie, accompagnement, basse)"
        ],
        vocabulaire: ["plan sonore", "texture", "accompagnement", "basse", "orchestration"],
        problematiques_exemples: [
          "Comment un arrangeur hiérarchise-t-il les différents éléments d'une musique ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple à texture riche (pop, orchestre), à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "styles-hybridation",
        ordre: 8,
        periode: "Période 5",
        titre: "Musiques populaires actuelles et hybridation des styles",
        domaine: "Style",
        attendus: [
          "Identifier des influences croisées entre plusieurs styles musicaux",
          "Situer une œuvre actuelle dans une filiation stylistique"
        ],
        vocabulaire: ["hybridation", "influence", "filiation musicale", "fusion"],
        problematiques_exemples: [
          "Un style musical peut-il naître de la rencontre entre plusieurs cultures ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de zouk, dancehall ou fusion contemporaine, à sélectionner", auteur: "à préciser", note: "ancrage culturel local à privilégier — titre précis à valider par vous" }
        ],
        a_valider: true
      },
      {
        id: "dynamique-interpretation-expressive",
        ordre: 2,
        periode: "Période 1",
        titre: "Dynamique et interprétation expressive",
        domaine: "Dynamique",
        attendus: [
          "Utiliser les nuances et le phrasé pour donner du sens à une interprétation",
          "Analyser les choix d'interprétation de deux versions d'une même œuvre"
        ],
        vocabulaire: ["expressivité", "phrasé", "interprétation"],
        problematiques_exemples: [
          "Deux interprètes peuvent-ils raconter des choses différentes avec la même partition ?"
        ],
        oeuvres_suggerees: [
          { titre: "Deux versions contrastées d'une même œuvre à comparer, à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "leitmotiv-theme-recurrent",
        ordre: 6,
        periode: "Période 4",
        titre: "Musique et cinéma : leitmotiv et thème récurrent",
        domaine: "Forme",
        attendus: [
          "Repérer le retour d'un thème musical associé à un personnage ou une situation",
          "Expliquer la fonction narrative d'un leitmotiv"
        ],
        vocabulaire: ["leitmotiv", "thème récurrent", "musique de film"],
        problematiques_exemples: [
          "Pourquoi un compositeur de film associe-t-il une musique à un personnage ?"
        ],
        oeuvres_suggerees: [
          { titre: "Extrait de musique de film à leitmotiv identifiable, à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "improvisation-creation-collective",
        ordre: 7,
        periode: "Période 4",
        titre: "Improvisation et création collective",
        domaine: "Successif et simultané",
        attendus: [
          "S'engager dans une improvisation courte, seul ou en groupe, à partir d'une consigne",
          "Écouter et s'ajuster aux propositions musicales des autres élèves"
        ],
        vocabulaire: ["improvisation", "création collective", "consigne ouverte"],
        problematiques_exemples: [
          "Peut-on créer de la musique ensemble sans l'avoir écrite à l'avance ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple d'improvisation collective (jazz, musiques actuelles) à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      }
    ]
  },

  "3e": {
    cycle: "Cycle 4",
    reference_programme: "BO spécial n°11 du 26 novembre 2015 (arrêté du 9-11-2015), Annexe 3 — programme du cycle 4",
    competences: [
      "Réaliser des projets musicaux d'interprétation ou de création",
      "Écouter, comparer, construire une culture musicale commune",
      "Explorer, imaginer, créer et produire",
      "Échanger, partager, argumenter et débattre"
    ],
    domaines_complementaires: ["Timbre et espace", "Temps et rythme", "Dynamique", "Successif et simultané", "Forme", "Style"],
    notions: [
      {
        id: "musique-engagement",
        ordre: 2,
        periode: "Période 1",
        titre: "Musique et société : la chanson engagée",
        domaine: "Style",
        attendus: [
          "Situer une œuvre dans son contexte historique, social et culturel",
          "Argumenter un jugement esthétique et critique sur une œuvre"
        ],
        vocabulaire: ["engagement", "contexte historique", "message", "porte-parole", "contestation"],
        problematiques_exemples: [
          "La musique peut-elle être une arme de contestation ?",
          "Comment un artiste engage-t-il son public à travers une chanson ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de chanson engagée antillaise ou francophone à sélectionner", auteur: "à préciser", note: "titre précis à valider selon l'actualité du programme et vos choix" }
        ],
        a_valider: true
      },
      {
        id: "style-evolution",
        ordre: 1,
        periode: "Période 1",
        titre: "Style et évolution des langages musicaux",
        domaine: "Style",
        attendus: [
          "Comparer des œuvres de styles différents et identifier des caractéristiques propres à une époque ou un genre",
          "Construire une frise chronologique de repères stylistiques"
        ],
        vocabulaire: ["style", "genre musical", "esthétique", "filiation musicale"],
        problematiques_exemples: [
          "Comment un style musical se transforme-t-il au contact d'autres cultures ?"
        ],
        oeuvres_suggerees: [
          { titre: "Corpus comparatif à construire (à sélectionner selon la progression annuelle)", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "son-image-dispositifs",
        ordre: 5,
        periode: "Période 3",
        titre: "Son, image et dispositifs sonores contemporains",
        domaine: "Timbre et espace",
        attendus: [
          "Analyser le rôle du son dans un dispositif audiovisuel (film, jeu vidéo, spectacle)",
          "Concevoir un habillage sonore simple pour une image ou une scène"
        ],
        vocabulaire: ["habillage sonore", "dispositif", "sound design", "ambiance"],
        problematiques_exemples: [
          "Comment le son transforme-t-il notre perception d'une image ?"
        ],
        oeuvres_suggerees: [
          { titre: "Extrait de bande originale ou de sound design de jeu vidéo, à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "projet-creation-personnelle",
        ordre: 8,
        periode: "Période 5",
        titre: "Projet de création personnelle (vers l'oral du DNB)",
        domaine: "Forme",
        attendus: [
          "Concevoir et réaliser un projet musical personnel ou collectif abouti",
          "Présenter et argumenter ses choix artistiques à l'oral"
        ],
        vocabulaire: ["projet", "intention artistique", "argumentation", "restitution"],
        problematiques_exemples: [
          "Comment passer d'une idée musicale à une réalisation aboutie ?"
        ],
        oeuvres_suggerees: [
          { titre: "Travaux d'anciens élèves ou œuvres de référence selon le projet retenu", auteur: "à préciser", note: "contenu très dépendant du projet annuel — à construire avec vous" }
        ],
        a_valider: true
      },
      {
        id: "dynamique-spectacle-vivant",
        ordre: 6,
        periode: "Période 4",
        titre: "Dynamique et mise en espace en spectacle vivant",
        domaine: "Dynamique",
        attendus: [
          "Analyser l'effet d'un dispositif scénique sur la perception d'une musique",
          "Adapter son interprétation à un contexte de restitution publique"
        ],
        vocabulaire: ["mise en espace", "régie", "dispositif scénique", "balance sonore"],
        problematiques_exemples: [
          "La disposition des musiciens sur scène change-t-elle notre écoute ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de captation de concert avec dispositif scénique marqué, à sélectionner", auteur: "à préciser", note: "lien possible avec votre expérience de régisseur plateau" }
        ],
        a_valider: true
      },
      {
        id: "metriques-complexes-non-occidentales",
        ordre: 3,
        periode: "Période 2",
        titre: "Rythmes non occidentaux et métriques complexes",
        domaine: "Temps et rythme",
        attendus: [
          "Percevoir et représenter des cycles rythmiques asymétriques ou non binaires",
          "Comparer l'organisation du temps musical dans différentes cultures"
        ],
        vocabulaire: ["métrique complexe", "rythme non occidental", "cycle rythmique"],
        problematiques_exemples: [
          "Le temps musical s'organise-t-il de la même façon partout dans le monde ?"
        ],
        oeuvres_suggerees: [
          { titre: "Exemple de musique à cycle rythmique asymétrique (musiques d'Afrique de l'Ouest, Balkans...) à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "improvisation-jazz",
        ordre: 4,
        periode: "Période 2",
        titre: "Successif et simultané : l'improvisation dans le jazz",
        domaine: "Successif et simultané",
        attendus: [
          "Repérer un chorus improvisé dans une grille harmonique",
          "Identifier le rôle de chaque musicien dans une section rythmique de jazz"
        ],
        vocabulaire: ["improvisation", "jazz", "chorus", "walking bass"],
        problematiques_exemples: [
          "Improviser, est-ce jouer n'importe quoi ?"
        ],
        oeuvres_suggerees: [
          { titre: "Standard de jazz avec chorus improvisé identifiable, à sélectionner", auteur: "à préciser", note: "" }
        ],
        a_valider: true
      },
      {
        id: "scene-musicale-caribeenne",
        ordre: 7,
        periode: "Période 4",
        titre: "Musique et identité : la scène musicale caribéenne contemporaine",
        domaine: "Style",
        attendus: [
          "Situer une œuvre actuelle dans le contexte culturel et social de sa création",
          "Argumenter en quoi une musique peut porter une identité culturelle"
        ],
        vocabulaire: ["scène musicale", "identité culturelle", "actualité musicale"],
        problematiques_exemples: [
          "En quoi une musique actuelle peut-elle porter l'identité d'un territoire ?"
        ],
        oeuvres_suggerees: [
          { titre: "Corpus d'artistes caribéens contemporains à sélectionner selon l'actualité", auteur: "à préciser", note: "ancrage culturel local fort — sélection à construire avec votre expertise" }
        ],
        a_valider: true
      }
    ]
  }
};

// Trame générique de scénario de séances (structure réutilisable, 4 ou 5 séances)
// Le contenu détaillé de chaque séance est généré dynamiquement dans app.js
// à partir de la notion choisie.
const TRAME_SEANCES_4 = [
  { titre: "Découverte et problématisation", type: "decouverte" },
  { titre: "Écoute active et apports notionnels", type: "ecoute" },
  { titre: "Pratique vocale / instrumentale et appropriation", type: "pratique" },
  { titre: "Restitution, bilan et évaluation formative", type: "bilan" }
];

const TRAME_SEANCES_5 = [
  { titre: "Découverte et problématisation", type: "decouverte" },
  { titre: "Écoute active et apports notionnels", type: "ecoute" },
  { titre: "Approfondissement et mise en réseau des œuvres", type: "approfondissement" },
  { titre: "Pratique vocale / instrumentale et appropriation", type: "pratique" },
  { titre: "Restitution, bilan et évaluation formative", type: "bilan" }
];

/*
 * LEXIQUE — propositions de définitions pour le vocabulaire des gabarits.
 * Définitions génériques (notions de théorie musicale usuelles), à adapter
 * librement au niveau de vos élèves. Un mot ajouté par vous sans définition
 * connue apparaîtra avec une définition vide à compléter.
 */
const LEXIQUE = {
  "pulsation": "Battement régulier et continu qui sert de repère au temps dans la musique.",
  "rythme": "Organisation des durées des sons dans le temps.",
  "tempo": "Vitesse à laquelle se déroule la pulsation d'une musique.",
  "accelerando": "Indication demandant d'accélérer progressivement le tempo.",
  "ritardando": "Indication demandant de ralentir progressivement le tempo.",
  "ostinato": "Motif rythmique ou mélodique répété de façon insistante.",
  "timbre": "Couleur sonore propre à une voix ou à un instrument, qui permet de le reconnaître.",
  "formation instrumentale": "Ensemble d'instruments réunis pour jouer une œuvre.",
  "orchestre": "Grande formation regroupant plusieurs familles d'instruments.",
  "voix (soprano, alto, ténor, basse)": "Classification des voix chantées, de la plus aiguë (soprano) à la plus grave (basse).",
  "hauteur": "Caractère d'un son qui le situe entre grave et aigu.",
  "intensité": "Force ou volume sonore d'un son.",
  "nuance": "Indication de l'intensité avec laquelle une musique doit être jouée ou chantée.",
  "crescendo": "Augmentation progressive de l'intensité sonore.",
  "decrescendo": "Diminution progressive de l'intensité sonore.",
  "monodie": "Musique à une seule ligne mélodique, sans accompagnement.",
  "polyphonie": "Musique à plusieurs voix ou lignes mélodiques simultanées et indépendantes.",
  "homophonie": "Musique à plusieurs voix qui progressent selon le même rythme.",
  "canon": "Forme de polyphonie où une même mélodie est reprise en décalé par plusieurs voix.",
  "contrepoint": "Technique d'écriture qui combine plusieurs lignes mélodiques indépendantes.",
  "forme": "Organisation générale d'une œuvre musicale dans le temps.",
  "couplet": "Partie d'une chanson dont le texte change à chaque reprise.",
  "refrain": "Partie d'une chanson répétée à l'identique entre les couplets.",
  "rondo": "Forme musicale où un thème principal alterne avec des épisodes contrastants.",
  "thème et variations": "Forme où un thème initial est repris et transformé plusieurs fois.",
  "coda": "Section finale qui conclut une œuvre musicale.",
  "mao": "Musique assistée par ordinateur : ensemble des techniques de création et de production sonore avec un ordinateur.",
  "boucle": "Court fragment sonore répété en continu.",
  "piste": "Ligne de travail indépendante dans un logiciel d'enregistrement (une piste par instrument ou voix, par exemple).",
  "arrangement": "Manière d'organiser et d'orchestrer les différents éléments d'une musique.",
  "échantillon": "Extrait sonore enregistré, réutilisé dans une nouvelle création (sample).",
  "édition sonore": "Ensemble des opérations de montage et de traitement appliquées à un enregistrement.",
  "engagement": "Prise de position, souvent sociale ou politique, exprimée à travers une œuvre.",
  "contexte historique": "Ensemble des évènements et circonstances de l'époque qui éclairent le sens d'une œuvre.",
  "message": "Idée ou propos qu'un artiste cherche à transmettre à travers son œuvre.",
  "porte-parole": "Personne (ou artiste) qui exprime publiquement les idées d'un groupe.",
  "contestation": "Expression d'un désaccord, souvent vis-à-vis d'une autorité ou d'une situation sociale.",
  "style": "Ensemble de caractéristiques propres à une œuvre, un artiste ou une époque.",
  "genre musical": "Catégorie regroupant des œuvres qui partagent des caractéristiques communes.",
  "esthétique": "Ensemble des choix qui définissent le caractère sensible et artistique d'une œuvre.",
  "filiation musicale": "Lien de parenté ou d'influence entre plusieurs œuvres, artistes ou courants musicaux.",
  "piano": "Nuance indiquant de jouer ou chanter doucement.",
  "forte": "Nuance indiquant de jouer ou chanter fort.",
  "unisson": "Fait, pour plusieurs voix ou instruments, de jouer ou chanter exactement la même note.",
  "voix seule": "Interprétation par une seule voix, sans accompagnement ni superposition.",
  "polyphonie simple": "Superposition de deux lignes mélodiques peu complexes, comme un canon à deux voix.",
  "introduction": "Partie initiale d'une musique qui précède le premier couplet.",
  "mesure": "Unité de temps musical regroupant un nombre fixe de temps, répétée régulièrement.",
  "temps fort": "Temps d'une mesure naturellement accentué.",
  "temps faible": "Temps d'une mesure non accentué, entre deux temps forts.",
  "binaire": "Se dit d'une mesure ou d'une subdivision organisée par groupes de deux.",
  "ternaire": "Se dit d'une mesure ou d'une subdivision organisée par groupes de trois.",
  "spatialisation": "Répartition et mouvement des sons dans l'espace d'écoute.",
  "espace sonore": "Ensemble des dimensions (hauteur, largeur, profondeur) que peut occuper un son perçu.",
  "proche/lointain": "Effet de distance donnant l'impression qu'un son est proche ou éloigné de l'auditeur.",
  "stéréophonie": "Technique de diffusion du son sur deux canaux (gauche/droite) donnant une impression de relief.",
  "musique de film": "Musique composée spécifiquement pour accompagner des images animées.",
  "ambiance sonore": "Ensemble des sons qui installent un climat ou un lieu dans une œuvre.",
  "intention": "Effet ou message recherché par un créateur à travers ses choix artistiques.",
  "synchronisation": "Fait de faire correspondre précisément un son à une image ou une action.",
  "polyrythmie": "Superposition de plusieurs rythmes différents joués simultanément.",
  "superposition rythmique": "Fait de faire entendre en même temps plusieurs formules rythmiques distinctes.",
  "tambour": "Instrument de percussion à membrane tendue, frappée pour produire le son.",
  "plan sonore": "Niveau ou couche identifiable dans une texture musicale (mélodie, accompagnement, basse...).",
  "texture": "Manière dont les différentes lignes ou plans sonores d'une musique s'organisent entre eux.",
  "accompagnement": "Partie musicale qui soutient harmoniquement ou rythmiquement une mélodie principale.",
  "basse": "Ligne musicale la plus grave, qui fonde souvent l'harmonie d'une pièce.",
  "orchestration": "Choix et répartition des instruments qui interprètent les différentes parties d'une œuvre.",
  "hybridation": "Rencontre et mélange d'éléments issus de styles ou cultures musicales différents.",
  "influence": "Trace perceptible d'un style ou d'un artiste dans l'œuvre d'un autre.",
  "fusion": "Style musical né du mélange assumé de plusieurs genres ou traditions.",
  "habillage sonore": "Ensemble des sons et musiques ajoutés à une image ou une scène pour en renforcer l'effet.",
  "dispositif": "Ensemble des moyens techniques et artistiques organisés pour produire un effet sonore ou scénique.",
  "sound design": "Conception et création des sons destinés à accompagner une image, un jeu ou un spectacle.",
  "ambiance": "Climat sonore général qui situe une scène ou un lieu.",
  "projet": "Démarche de création organisée autour d'une intention et d'objectifs définis à l'avance.",
  "intention artistique": "Choix conscient qui oriente une création vers un effet ou un sens recherché.",
  "argumentation": "Fait de justifier ses choix par des raisons claires et organisées.",
  "restitution": "Moment où un travail ou un projet est présenté publiquement.",
  "mise en espace": "Organisation de la disposition des musiciens ou des éléments sonores dans un lieu donné.",
  "régie": "Ensemble des opérations techniques (son, lumière, plateau) qui organisent un spectacle.",
  "dispositif scénique": "Organisation matérielle et spatiale prévue pour une prestation sur scène.",
  "balance sonore": "Équilibre entre les différentes sources sonores d'une prestation, réglé notamment à la sonorisation.",
  "geste musical": "Mouvement corporel utilisé pour produire, accompagner ou traduire un élément musical.",
  "percussions corporelles": "Technique consistant à produire des sons rythmiques avec le corps (mains, pieds, cuisses...).",
  "coordination": "Capacité à synchroniser plusieurs gestes ou plusieurs personnes dans une même action rythmique.",
  "voix parlée": "Usage de la voix dans le registre du langage courant, sans hauteur musicale fixée.",
  "voix chantée": "Usage de la voix organisé autour de hauteurs et d'une durée musicale précises.",
  "diction": "Manière d'articuler et de prononcer un texte, parlé ou chanté.",
  "timbre vocal": "Couleur particulière d'une voix, qui la rend reconnaissable.",
  "musique du monde": "Musique issue d'une tradition culturelle particulière, souvent hors du répertoire occidental classique.",
  "diversité culturelle": "Coexistence de traditions, langues et expressions artistiques différentes.",
  "instrument traditionnel": "Instrument associé à une culture ou une région précise, souvent transmis oralement.",
  "forme cyclique": "Organisation musicale fondée sur la répétition régulière d'un même motif ou d'une même section.",
  "reprise": "Retour d'un élément musical déjà entendu plus tôt dans l'œuvre.",
  "boucle formelle": "Section musicale conçue pour être répétée en continu.",
  "facture instrumentale": "Ensemble des techniques de fabrication d'un instrument de musique.",
  "lutherie": "Art et métier de la fabrication des instruments de musique.",
  "danse": "Ensemble de mouvements corporels organisés en lien avec une musique.",
  "carrure": "Régularité de l'organisation des phrases musicales, souvent par groupes de 4 ou 8 mesures.",
  "pas de danse": "Mouvement codifié caractéristique d'une danse donnée.",
  "expressivité": "Capacité d'une interprétation à transmettre une émotion ou une intention.",
  "phrasé": "Manière de relier et de nuancer les notes d'une phrase musicale.",
  "interprétation": "Manière personnelle dont un musicien réalise une œuvre à partir d'une partition ou d'un modèle.",
  "leitmotiv": "Motif musical associé à un personnage, un lieu ou une idée, et repris à chaque apparition.",
  "thème récurrent": "Motif musical qui revient plusieurs fois au cours d'une œuvre.",
  "improvisation": "Création musicale spontanée, produite au moment même de l'interprétation.",
  "création collective": "Processus de création musicale mené à plusieurs, en interaction directe.",
  "consigne ouverte": "Instruction laissant une large marge d'initiative à l'interprète ou au créateur.",
  "métrique complexe": "Organisation du temps musical qui ne se limite pas aux mesures binaires ou ternaires simples.",
  "rythme non occidental": "Organisation rythmique issue d'une tradition musicale extérieure à la musique occidentale.",
  "cycle rythmique": "Suite de temps ou de motifs rythmiques qui se répète de façon régulière.",
  "jazz": "Genre musical né aux États-Unis, caractérisé notamment par l'improvisation et le swing.",
  "chorus": "Section improvisée d'un morceau de jazz, construite sur une grille harmonique donnée.",
  "walking bass": "Ligne de basse continue en jazz, jouant une note par temps pour soutenir l'harmonie.",
  "scène musicale": "Ensemble des artistes, lieux et pratiques qui font vivre la musique d'un territoire à un moment donné.",
  "identité culturelle": "Ensemble des traits qui rattachent une œuvre ou une pratique à une culture particulière.",
  "actualité musicale": "Ensemble des productions et évènements musicaux récents."
};
