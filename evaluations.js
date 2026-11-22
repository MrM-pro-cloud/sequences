/*
 * Évaluations générées à partir de la séquence :
 *   - QCM d'évaluation formative (version élève + corrigé)
 *   - Évaluation sommative de fin de séquence, sur 20 (version élève + corrigé et barème)
 *   - Évaluation par compétence (tâche + grille à 4 niveaux)
 *
 * Tout est construit à partir des données de la séquence (vocabulaire et définitions,
 * attendus, problématique, œuvres retenues) : si vous modifiez ces éléments à l'écran 2,
 * les évaluations suivent. Les questions d'écoute portent sur « l'œuvre retenue » sans
 * décrire son contenu : le corrigé donne des critères, à compléter avec l'extrait choisi.
 */

const EV_NIVEAUX = ["Maîtrise insuffisante", "Maîtrise fragile", "Maîtrise satisfaisante", "Très bonne maîtrise"];

function evH(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function evRng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function evShuffle(arr, r) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const evSeed = (st) => `${st.niveau}|${st.notion.id}|${st.vocab.map((v) => v.mot).join(",")}`;
const evTerms = (st) => st.vocab.filter((v) => v.mot.trim() && v.definition.trim());
const evOeuvres = (st) => st.oeuvres.filter((o) => o.titre.trim());
const evLabel = (o) => o.titre + (o.auteur ? " — " + o.auteur : "");

// Mots susceptibles de servir de « mauvaises réponses » : d'abord ceux de la séquence,
// puis ceux du niveau, puis tout le lexique.
function evTiers(st) {
  const own = evTerms(st).map((v) => ({ mot: v.mot, def: v.definition }));
  const niv = new Set();
  GABARITS[st.niveau].notions.forEach((n) => n.vocabulaire.forEach((m) => niv.add(m.toLowerCase())));
  const same = [...niv].filter((m) => LEXIQUE[m]).map((m) => ({ mot: m, def: LEXIQUE[m] }));
  const all = Object.entries(LEXIQUE).map(([m, d]) => ({ mot: m, def: d }));
  return [own, same, all];
}

function evDistracteurs(tiers, ex, n, r) {
  const mots = new Set([ex.mot.toLowerCase()]);
  const defs = new Set([ex.def]);
  const out = [];
  for (const tier of tiers) {
    for (const c of evShuffle(tier, r)) {
      if (out.length >= n) break;
      if (mots.has(c.mot.toLowerCase()) || defs.has(c.def)) continue;
      mots.add(c.mot.toLowerCase()); defs.add(c.def); out.push(c);
    }
    if (out.length >= n) break;
  }
  return out;
}

// Place la bonne réponse à une position donnée (positions équilibrées sur A-D)
function evPlace(bonne, autres, pos, r) {
  const m = evShuffle(autres, r);
  m.splice(Math.min(pos, m.length), 0, bonne);
  return m;
}

// ---------------------------------------------------------------- QCM formatif
function buildQcm(st) {
  const r = evRng(evSeed(st) + "|qcm");
  const positions = evShuffle(Array.from({ length: 12 }, (_, i) => i % 4), r);
  let np = 0;
  const nextPos = () => positions[np++ % positions.length];
  const terms = evTerms(st);
  const tiers = evTiers(st);
  const qs = [];

  terms.slice(0, 5).forEach((v) => {
    const ex = { mot: v.mot, def: v.definition };
    const d = evDistracteurs(tiers, ex, 3, r);
    qs.push({
      q: `Que signifie le mot « ${v.mot} » ?`, seance: v.seance,
      opts: evPlace({ t: ex.def, ok: true }, d.map((x) => ({ t: x.def })), nextPos(), r),
    });
  });
  terms.slice(-4).reverse().forEach((v) => {
    const ex = { mot: v.mot, def: v.definition };
    const d = evDistracteurs(tiers, ex, 3, r);
    qs.push({
      q: `Quel mot correspond à cette définition : « ${v.definition} » ?`, seance: v.seance,
      opts: evPlace({ t: ex.mot, ok: true }, d.map((x) => ({ t: x.mot })), nextPos(), r),
    });
  });

  // domaine du programme
  const doms = new Set();
  Object.values(GABARITS).forEach((g) => g.notions.forEach((n) => n.domaine.split("/").forEach((x) => doms.add(x.trim()))));
  const propres = st.notion.domaine.split("/").map((x) => x.trim());
  const autresDom = evShuffle([...doms].filter((x) => !propres.includes(x)), r).slice(0, 3);
  if (autresDom.length === 3) {
    qs.push({
      q: `À quel domaine du programme se rattache la notion « ${st.notion.titre} » ?`, seance: null,
      opts: evPlace({ t: st.notion.domaine, ok: true }, autresDom.map((t) => ({ t })), nextPos(), r),
    });
  }

  // œuvres retenues (à analyser / à chanter)
  if (typeof BANQUE_OEUVRES !== "undefined") {
    const cycle = st.niveau === "6e" ? 3 : 4;
    const retenues = new Set(evOeuvres(st).map((o) => o.titre.toLowerCase()));
    const ajoute = (liste, lettre, enonce) => {
      const choisie = liste[0];
      if (!choisie) return;
      const faux = evShuffle(BANQUE_OEUVRES.filter((o) => o.cycles.includes(cycle) && o.u.includes(lettre) && !retenues.has(o.t.toLowerCase())), r).slice(0, 3);
      if (faux.length < 3) return;
      qs.push({
        q: enonce, seance: null,
        opts: evPlace({ t: choisie.titre, ok: true }, faux.map((o) => ({ t: o.t })), nextPos(), r),
      });
    };
    ajoute(evOeuvres(st).filter((o) => o.usage !== "chanter"), "a", "Quelle œuvre avons-nous écoutée et analysée pendant la séquence ?");
    ajoute(evOeuvres(st).filter((o) => o.usage === "chanter" || o.usage === "ac"), "c", "Quel chant avons-nous travaillé pendant la séquence ?");
  }
  return qs.slice(0, 12);
}

const EV_LETTRES = ["A", "B", "C", "D", "E"];

function evHeader(st, type, sous) {
  return `<div class="fiche-header">
    <div><div class="titre-fiche">${evH(st.notion.titre)}</div><div class="hint">${sous}</div></div>
    <div class="type-fiche">${type}</div>
  </div>`;
}

function evIdentite(st) {
  return `<div class="identite-eleve">
    <div><span>Nom</span><div class="blank-line"></div></div>
    <div><span>Prénom</span><div class="blank-line"></div></div>
    <div><span>Classe</span><div class="blank-line">${evH(st.classe || "")}</div></div>
    <div><span>Date</span><div class="blank-line"></div></div>
  </div>`;
}

function renderQcmHTML(st, corrige) {
  const qs = buildQcm(st);
  if (qs.length < 3) {
    return evHeader(st, corrige ? "QCM — corrigé" : "QCM formatif", `Classe de ${st.niveau}`) +
      `<p>Pas assez de vocabulaire défini pour générer un QCM. À l'écran « Séquence », renseignez au moins trois mots avec leur définition.</p>`;
  }
  const blocs = qs.map((q, i) => {
    const opts = q.opts.map((o, k) => {
      const txt = `${EV_LETTRES[k]}. ${evH(o.t)}`;
      return corrige && o.ok ? `<li><strong>☒ ${txt} ✔</strong></li>` : `<li>☐ ${txt}</li>`;
    }).join("");
    return `<p><strong>${i + 1}. ${evH(q.q)}</strong>${q.seance ? ` <span class="hint">(séance ${q.seance})</span>` : ""}</p><ul class="opts">${opts}</ul>`;
  }).join("");

  const reponses = qs.map((q, i) => `${i + 1}-${EV_LETTRES[q.opts.findIndex((o) => o.ok)]}`).join("  ·  ");
  return evHeader(st, corrige ? "QCM formatif — corrigé" : "QCM d'évaluation formative", `Classe de ${st.niveau} — ${GABARITS[st.niveau].cycle} · 10 minutes environ`) +
    (corrige ? "" : evIdentite(st)) +
    `<p class="hint">${corrige
      ? "Une seule bonne réponse par question. Barème : 1 point par bonne réponse. Évaluation formative : elle sert à repérer ce qui est à revoir, pas à noter."
      : "Pour chaque question, coche une seule case. Ce QCM ne sert pas à te noter : il montre ce que tu sais déjà et ce qu'il reste à revoir."}</p>` +
    `<h4>${corrige ? "Corrigé" : "Questions"}</h4>` + blocs +
    (corrige
      ? `<h4>Récapitulatif des réponses</h4><p>${reponses}</p><h4>Exploitation en classe</h4><ul><li>Relever les questions échouées par plus d'un tiers de la classe : ce sont les notions à reprendre en séance suivante.</li><li>Pour les élèves en difficulté, renvoyer au vocabulaire de la fiche élève et refaire la question à l'oral.</li></ul>`
      : `<h4>Mon bilan</h4><p>Nombre de bonnes réponses : ........ / ${qs.length}</p><p>Ce que je dois revoir :</p><div class="blank-lines"></div><div class="blank-lines"></div>`);
}

// ---------------------------------------------------------------- Sommative
function buildSommative(st) {
  const r = evRng(evSeed(st) + "|somm");
  const terms = evTerms(st).slice(0, 5);
  const defs = evShuffle(terms.map((v, i) => ({ i, def: v.definition })), r);
  const lettreDe = {};
  defs.forEach((d, k) => { lettreDe[d.i] = EV_LETTRES[k]; });
  const analyse = evOeuvres(st).find((o) => o.usage !== "chanter");
  const chant = evOeuvres(st).find((o) => o.usage === "chanter" || o.usage === "ac");
  const attendus = st.notion.attendus;
  const mots = evTerms(st).map((v) => v.mot);
  const nb1 = terms.length;
  return { terms, defs, lettreDe, analyse, chant, attendus, mots, nb1, total: nb1 + 6 + 5 + 4 };
}

function renderSommativeHTML(st, corrige) {
  const s = buildSommative(st);
  const lignes = (n) => Array.from({ length: n }, () => '<div class="blank-lines"></div>').join("");
  const oeuvreEcoute = s.analyse ? evH(evLabel(s.analyse)) : "l'extrait choisi par le professeur";
  const oeuvreChant = s.chant ? evH(evLabel(s.chant)) : "le chant travaillé en séance de pratique";

  // Exercice 1
  const t1rows = s.terms.map((v, i) => `<tr><td style="width:55%;">${evH(v.mot)}</td><td>${corrige ? `<strong>${s.lettreDe[i]}</strong>` : '<div class="blank-lines"></div>'}</td></tr>`).join("");
  const t1defs = s.defs.map((d, k) => `<tr><td style="width:8%;"><strong>${EV_LETTRES[k]}</strong></td><td>${evH(d.def)}</td></tr>`).join("");
  const ex1 = `<h4>Exercice 1 — Vocabulaire (${s.nb1} points)</h4>
    <p>Associe chaque mot à sa définition en écrivant la lettre correspondante. 1 point par bonne association.</p>
    <table><thead><tr><th>Mot</th><th>Lettre de la définition</th></tr></thead><tbody>${t1rows}</tbody></table>
    <table><thead><tr><th>Lettre</th><th>Définition</th></tr></thead><tbody>${t1defs}</tbody></table>`;

  // Exercice 2
  const motsListe = s.mots.length ? s.mots.map(evH).join(", ") : "pulsation, rythme, tempo…";
  const a1 = s.attendus[0] ? evH(s.attendus[0]) : "ce qui a été travaillé pendant la séquence";
  const a2 = s.attendus[1] ? evH(s.attendus[1]) : null;
  const ex2 = `<h4>Exercice 2 — Écoute (6 points)</h4>
    <p>Écoute l'extrait : <strong>${oeuvreEcoute}</strong>. Il sera diffusé trois fois.</p>
    <p><strong>Question 1 (2 points).</strong> Choisis deux mots de la liste (${motsListe}) et explique, avec tes mots, ce que chacun désigne dans cet extrait.</p>${corrige ? "" : lignes(3)}
    ${corrige ? `<p class="corrige">Attendu : deux mots employés à bon escient (1 point chacun) ; toute reformulation fidèle à la définition est acceptée.</p>` : ""}
    <p><strong>Question 2 (2 points).</strong> Objectif de la séquence : « ${a1} ». Montre-le à partir de ce que tu entends.</p>${corrige ? "" : lignes(3)}
    ${corrige ? `<p class="corrige">Attendu : 1 point pour un élément musical repéré dans l'extrait, 1 point pour le lien explicite avec l'objectif. À préciser avec l'extrait choisi.</p>` : ""}
    <p><strong>Question 3 (2 points).</strong> ${a2 ? `Objectif de la séquence : « ${a2} ». Illustre-le par un exemple tiré de l'extrait.` : "Décris le caractère de l'extrait en deux ou trois phrases, en utilisant au moins un mot du vocabulaire."}</p>${corrige ? "" : lignes(3)}
    ${corrige ? `<p class="corrige">Attendu : 1 point pour l'exemple précis, 1 point pour l'emploi correct du vocabulaire de la séquence.</p>` : ""}`;

  // Exercice 3
  const crit3 = [
    ["Justesse des hauteurs", "2", "Chante juste (2) · quelques écarts (1) · justesse non maîtrisée (0)"],
    ["Pulsation et rythme", "1", "Tient la pulsation et le rythme du chant (1) · décalages fréquents (0)"],
    ["Texte et mémorisation", "1", "Connaît le texte sans support (1) · hésitations importantes (0)"],
    ["Expressivité et nuances", "1", "Nuances, phrasé et attitude adaptés (1) · interprétation neutre (0)"],
  ];
  const ex3 = `<h4>Exercice 3 — Pratique vocale (5 points)</h4>
    <p>Chant évalué : <strong>${oeuvreChant}</strong>, interprété seul(e) ou en petit groupe.</p>
    <table><thead><tr><th>Critère de réussite</th><th style="width:12%;">Points</th><th>${corrige ? "Attendu" : "Points obtenus"}</th></tr></thead><tbody>
      ${crit3.map((c) => `<tr><td>${c[0]}</td><td>${c[1]}</td><td>${corrige ? c[2] : '<div class="blank-lines"></div>'}</td></tr>`).join("")}
    </tbody></table>`;

  // Exercice 4
  const ex4 = `<h4>Exercice 4 — Répondre à la problématique (4 points)</h4>
    <p>« <em>${evH(st.problematique)}</em> »</p>
    <p>Réponds en cinq à huit lignes. Utilise au moins trois mots de la liste : ${motsListe}.</p>${corrige ? "" : lignes(6)}
    ${corrige
      ? `<p class="corrige">Barème : réponse pertinente à la question posée (2 points) · au moins trois mots du vocabulaire employés à bon escient (1 point) · clarté de l'expression et orthographe (1 point).</p>
         <p><strong>Éléments de réponse attendus</strong> (à adapter à ce qui a été fait en classe) :</p>
         <ul>${evTerms(st).map((v) => `<li><strong>${evH(v.mot)}</strong> : ${evH(v.definition)}</li>`).join("") || "<li>à compléter</li>"}</ul>`
      : ""}`;

  // Récapitulatif
  const recap = `<h4>${corrige ? "Barème récapitulatif" : "Résultat"}</h4>
    <table><thead><tr><th>Exercice</th><th style="width:15%;">Barème</th><th style="width:25%;">Points obtenus</th></tr></thead><tbody>
      <tr><td>1. Vocabulaire</td><td>${s.nb1}</td><td></td></tr>
      <tr><td>2. Écoute</td><td>6</td><td></td></tr>
      <tr><td>3. Pratique vocale</td><td>5</td><td></td></tr>
      <tr><td>4. Problématique</td><td>4</td><td></td></tr>
      <tr><td><strong>Total</strong></td><td><strong>${s.total}</strong></td><td></td></tr>
    </tbody></table>
    ${s.total !== 20 ? `<p class="hint">Total sur ${s.total} points : à ramener sur 20 (note = points obtenus × 20 ÷ ${s.total}), car la liste de vocabulaire comporte moins de cinq mots définis.</p>` : ""}`;

  return evHeader(st, corrige ? "Évaluation sommative — corrigé et barème" : "Évaluation sommative", `Classe de ${st.niveau} — ${GABARITS[st.niveau].cycle} · fin de séquence · durée indicative 40 minutes`) +
    (corrige ? "" : evIdentite(st)) + ex1 + ex2 + ex3 + ex4 + recap;
}

// ---------------------------------------------------------------- Par compétence
const EV_FAMILLES = {
  chant: {
    nom: "interpréter",
    criteres: [
      ["Justesse et précision rythmique", ["Nombreuses erreurs de hauteur ou de rythme ; l'interprétation s'interrompt", "Erreurs fréquentes, mais l'élève poursuit ; justesse variable", "Quelques erreurs ponctuelles ; hauteurs et rythme globalement respectés", "Chant juste et précis, y compris dans les passages difficiles"]],
      ["Pulsation, tempo et écoute du groupe", ["Perd la pulsation et n'écoute pas le groupe", "Suit le groupe de façon irrégulière", "Maintient la pulsation et ajuste sa voix au groupe", "Maintient la pulsation et soutient le groupe (départs, fins nets)"]],
      ["Interprétation : texte, nuances, souffle, posture", ["Texte hésitant, voix peu projetée", "Texte su en partie ; nuances peu perceptibles", "Texte su ; nuances respectées ; posture adaptée", "Texte maîtrisé ; phrasé et nuances expressifs ; engagement visible"]],
    ],
  },
  ecoute: {
    nom: "écouter",
    criteres: [
      ["Identification de ce qui est entendu", ["Ne repère aucun élément musical", "Repère un élément, avec aide", "Repère plusieurs éléments (instruments, pulsation, nuances…)", "Repère les éléments essentiels avec précision et les situe dans l'extrait"]],
      ["Vocabulaire musical", ["Aucun mot précis", "Quelques mots, parfois mal employés", "Mots de la séquence employés à bon escient", "Vocabulaire riche et exact ; définitions maîtrisées"]],
      ["Comparaison et mise en relation", ["Aucune mise en relation", "Compare avec aide, de façon superficielle", "Compare deux œuvres ou deux extraits sur un critère", "Compare, relie à un contexte (époque, culture, genre) et conclut"]],
    ],
  },
  creation: {
    nom: "créer",
    criteres: [
      ["Respect de la consigne et des contraintes", ["Consigne non comprise", "Consigne partiellement respectée", "Consigne respectée", "Consigne respectée et contraintes enrichies"]],
      ["Invention et cohérence de la production", ["Pas de production aboutie", "Production courte, peu structurée", "Production cohérente et structurée", "Production originale, cohérente et maîtrisée"]],
      ["Réalisation et présentation devant la classe", ["Ne présente pas sa production", "Présente avec hésitations", "Présente avec assurance", "Présente avec assurance et explique ses choix"]],
    ],
  },
  echange: {
    nom: "échanger",
    criteres: [
      ["Prise de parole claire", ["Ne s'exprime pas", "Parle avec aide, par phrases courtes", "S'exprime clairement", "S'exprime avec aisance et précision"]],
      ["Argumentation appuyée sur l'écoute", ["Donne une opinion sans la justifier", "Justifie avec un exemple isolé", "Argumente en s'appuyant sur ce qui a été écouté", "Argumente avec précision, nuance et références à l'œuvre"]],
      ["Écoute et respect des autres", ["Coupe la parole", "Écoute avec des rappels", "Écoute et respecte les tours de parole", "Reprend et prolonge les propos des autres"]],
    ],
  },
};

function evFamille(texte, index) {
  const t = texte.toLowerCase();
  if (/chant|interpr|projet/.test(t)) return "chant";
  if (/[ée]cout|compar|culture/.test(t)) return "ecoute";
  if (/explor|imagin|cr[ée]|produire/.test(t)) return "creation";
  if (/[ée]chang|partag|argument|d[ée]bat/.test(t)) return "echange";
  return ["chant", "ecoute", "creation", "echange"][index] || "echange";
}

function evTache(fam, st) {
  const analyse = evOeuvres(st).find((o) => o.usage !== "chanter");
  const chant = evOeuvres(st).find((o) => o.usage === "chanter" || o.usage === "ac");
  const mots = evTerms(st).slice(0, 3).map((v) => v.mot).join(", ");
  switch (fam) {
    case "chant":
      return `Interpréter ${chant ? "« " + evH(evLabel(chant)) + " »" : "le chant travaillé en séance de pratique"} (un couplet et le refrain), seul(e) ou en petit groupe, devant la classe.`;
    case "ecoute":
      return `Écouter ${analyse ? "« " + evH(evLabel(analyse)) + " »" : "l'extrait proposé"}, puis le commenter à l'oral ou à l'écrit : ce que j'entends, avec les mots de la séquence${mots ? " (" + evH(mots) + ")" : ""}, et un rapprochement avec une autre œuvre.`;
    case "creation":
      return `Inventer une courte production (rythme, mélodie, paysage sonore ou accompagnement) qui illustre « ${evH(st.notion.titre)} », en utilisant au moins deux mots du vocabulaire, puis la présenter à la classe.`;
    default:
      return `Présenter ou débattre à l'oral de la problématique : « ${evH(st.problematique)} », en s'appuyant sur une œuvre écoutée.`;
  }
}

function renderCompetenceHTML(st) {
  const g = GABARITS[st.niveau];
  let html = evHeader(st, "Évaluation par compétence", `Classe de ${st.niveau} — ${g.cycle} · à renseigner au fil de la séquence`) + evIdentite(st) +
    `<p class="hint">Quatre degrés de maîtrise : ${EV_NIVEAUX.join(" · ")}. Les descripteurs sont indicatifs : ajustez-les à votre classe et aux tâches réellement proposées. Entourez ou cochez le niveau observé pour chaque critère.</p>`;

  g.competences.forEach((comp, i) => {
    const fam = EV_FAMILLES[evFamille(comp, i)];
    const mise = i === st.competence ? " ★ compétence mise en avant" : "";
    html += `<h4>Compétence : ${evH(comp)}${mise}</h4>
      <p><strong>Tâche proposée :</strong> ${evTache(evFamille(comp, i), st)}</p>
      <table>
        <thead><tr><th style="width:22%;">Critère</th>${EV_NIVEAUX.map((n) => `<th>☐ ${n}</th>`).join("")}</tr></thead>
        <tbody>${fam.criteres.map((c) => `<tr><td><strong>${evH(c[0])}</strong></td>${c[1].map((d) => `<td>${evH(d)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>`;
  });

  html += `<h4>Bilan de positionnement</h4>
    <table>
      <thead><tr><th style="width:34%;">Compétence</th>${EV_NIVEAUX.map((n) => `<th>${n}</th>`).join("")}</tr></thead>
      <tbody>${g.competences.map((c) => `<tr><td>${evH(c)}</td>${EV_NIVEAUX.map(() => "<td>☐</td>").join("")}</tr>`).join("")}</tbody>
    </table>
    <h4>Observations et prochaines étapes</h4>
    <div class="blank-lines"></div><div class="blank-lines"></div><div class="blank-lines"></div>`;
  return html;
}

// ---------------------------------------------------------------- Assemblage
function renderEvaluations() {
  const put = (id, html) => { const n = document.getElementById(id); if (n) n.innerHTML = html; };
  put("fiche-qcm", renderQcmHTML(state, false));
  put("fiche-qcmc", renderQcmHTML(state, true));
  put("fiche-somm", renderSommativeHTML(state, false));
  put("fiche-sommc", renderSommativeHTML(state, true));
  put("fiche-comp", renderCompetenceHTML(state));
}
