// ==========================================================================
// Séquences EM — logique applicative
// ==========================================================================

const state = {
  niveau: null,
  notion: null,
  nbSeances: 5,
  etablissement: "",
  classe: "",
  problematique: "",
  vocab: [],     // [{ mot, definition, seance }]
  oeuvres: [],   // [{ titre, auteur, note }]
  seances: [],
};

const el = (id) => document.getElementById(id);

function initApp() {
  const niveauSelect = el("niveau");
  Object.keys(GABARITS).forEach((niv) => {
    const opt = document.createElement("option");
    opt.value = niv;
    opt.textContent = `${niv} (${GABARITS[niv].cycle})`;
    niveauSelect.appendChild(opt);
  });

  niveauSelect.addEventListener("change", onNiveauChange);
  el("notion").addEventListener("change", onNotionChange);
  el("form-parametres").addEventListener("submit", onGenerate);

  document.querySelectorAll('input[name="nb-seances"]').forEach((r) => {
    r.addEventListener("change", () => {
      document.querySelectorAll(".radio-option").forEach((o) => o.classList.remove("selected"));
      r.closest(".radio-option").classList.add("selected");
    });
  });

  el("btn-retour-parametres").addEventListener("click", () => showStep(1));
  el("btn-voir-fiches").addEventListener("click", () => { renderFiches(); showStep(3); });
  el("btn-retour-sequence").addEventListener("click", () => showStep(2));

  el("btn-fiche-eleve").addEventListener("click", () => switchFiche("eleve"));
  el("btn-fiche-prof").addEventListener("click", () => switchFiche("prof"));
  el("btn-fiche-trace").addEventListener("click", () => switchFiche("trace"));
  el("btn-print").addEventListener("click", () => window.print());

  el("btn-add-vocab").addEventListener("click", addVocabRow);
  el("btn-add-oeuvre").addEventListener("click", addOeuvreRow);
  el("vocab-editor").addEventListener("click", onVocabEditorClick);
  el("vocab-editor").addEventListener("input", onVocabEditorInput);
  el("vocab-editor").addEventListener("change", onVocabEditorInput);
  el("oeuvres-editor").addEventListener("click", onOeuvresEditorClick);
  el("oeuvres-editor").addEventListener("input", onOeuvresEditorInput);

  el("problematique-live").addEventListener("input", (e) => {
    state.problematique = e.target.value;
  });

  onNiveauChange();
}

function onNiveauChange() {
  const niveau = el("niveau").value;
  const notionSelect = el("notion");
  notionSelect.innerHTML = "";
  if (!niveau || !GABARITS[niveau]) return;
  const notionsTriees = [...GABARITS[niveau].notions].sort((a, b) => a.ordre - b.ordre);
  notionsTriees.forEach((n) => {
    const opt = document.createElement("option");
    opt.value = n.id;
    opt.textContent = `${n.periode} — ${n.titre}`;
    notionSelect.appendChild(opt);
  });
  renderProgressionAnnuelle(niveau);
  onNotionChange();
}

function renderProgressionAnnuelle(niveau) {
  const notionsTriees = [...GABARITS[niveau].notions].sort((a, b) => a.ordre - b.ordre);
  const rows = notionsTriees.map((n) => `
    <tr>
      <td>${n.ordre}</td>
      <td>${n.periode}</td>
      <td>${n.titre}</td>
      <td>${n.domaine}</td>
    </tr>
  `).join("");
  el("progression-annuelle").innerHTML = `
    <table class="editor-table">
      <thead><tr><th>N°</th><th>Période</th><th>Notion</th><th>Domaine</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="hint">Périodes génériques à recaler sur le calendrier Antilles-Guyane de l'année en cours.</p>
  `;
}

function onNotionChange() {
  const niveau = el("niveau").value;
  const notionId = el("notion").value;
  const notion = getNotion(niveau, notionId);
  const preview = el("notion-preview");
  if (!notion) { preview.innerHTML = ""; return; }
  preview.innerHTML = `
    <div class="ref-box">${GABARITS[niveau].reference_programme}</div>
    <p class="hint" style="margin-top:0.6rem;"><strong>Période suggérée :</strong> ${notion.periode} (séquence ${notion.ordre}/8) — <strong>Domaine :</strong> ${notion.domaine}</p>
    <p class="hint"><strong>Attendus (extraits) :</strong> ${notion.attendus[0]}</p>
  `;
}

function getNotion(niveau, notionId) {
  if (!niveau || !GABARITS[niveau]) return null;
  return GABARITS[niveau].notions.find((n) => n.id === notionId) || null;
}

// --- Génération initiale à partir des paramètres -------------------------

function onGenerate(e) {
  e.preventDefault();
  const niveau = el("niveau").value;
  const notionId = el("notion").value;
  const notion = getNotion(niveau, notionId);
  if (!notion) return;

  const nbSeances = parseInt(document.querySelector('input[name="nb-seances"]:checked').value, 10);
  const problematiqueChoisie = el("problematique-custom").value.trim() || notion.problematiques_exemples[0];

  state.niveau = niveau;
  state.notion = notion;
  state.nbSeances = nbSeances;
  state.etablissement = el("etablissement").value.trim();
  state.classe = el("classe").value.trim();
  state.problematique = problematiqueChoisie;

  state.vocab = initVocabFromNotion(notion, nbSeances);
  state.oeuvres = notion.oeuvres_suggerees.map((o) => ({ titre: o.titre, auteur: o.auteur, note: o.note || "" }));

  rebuildSeances();
  renderSequence();
  renderVocabEditor();
  renderOeuvresEditor();
  showStep(2);
}

function trameForNb(nb) {
  return nb === 4 ? TRAME_SEANCES_4 : TRAME_SEANCES_5;
}

function seanceNumberOfType(trame, type) {
  const idx = trame.findIndex((s) => s.type === type);
  return idx === -1 ? null : idx + 1;
}

function initVocabFromNotion(notion, nbSeances) {
  const trame = trameForNb(nbSeances);
  const seanceEcoute = seanceNumberOfType(trame, "ecoute") || 1;
  const seanceApprof = seanceNumberOfType(trame, "approfondissement");
  const words = notion.vocabulaire;
  const mid = seanceApprof ? Math.ceil(words.length / 2) : words.length;
  return words.map((mot, i) => ({
    mot,
    definition: LEXIQUE[mot.toLowerCase()] || "",
    seance: (seanceApprof && i >= mid) ? seanceApprof : seanceEcoute,
  }));
}

// --- Édition du vocabulaire ------------------------------------------------

function addVocabRow() {
  state.vocab.push({ mot: "", definition: "", seance: 1 });
  renderVocabEditor();
}

function onVocabEditorClick(e) {
  const btn = e.target.closest("[data-action='remove-vocab']");
  if (!btn) return;
  const idx = parseInt(btn.dataset.index, 10);
  state.vocab.splice(idx, 1);
  renderVocabEditor();
  rebuildSeances();
  renderSequence();
}

function onVocabEditorInput(e) {
  const row = e.target.closest(".edit-row");
  if (!row) return;
  const idx = parseInt(row.dataset.index, 10);
  if (Number.isNaN(idx) || !state.vocab[idx]) return;
  const field = e.target.dataset.field;
  if (field === "seance") {
    state.vocab[idx].seance = parseInt(e.target.value, 10);
  } else if (field === "mot" || field === "definition") {
    state.vocab[idx][field] = e.target.value;
  }
  rebuildSeances();
  renderSeancesTable();
}

function renderVocabEditor() {
  const nb = state.nbSeances;
  const options = Array.from({ length: nb }, (_, i) => i + 1);
  el("vocab-editor").innerHTML = `
    <div class="edit-list" style="margin-top:.8rem;">
      ${state.vocab.map((v, i) => `
        <div class="edit-row" data-index="${i}">
          <input type="text" data-field="mot" aria-label="Mot" value="${escapeAttr(v.mot)}" placeholder="Mot">
          <input type="text" data-field="definition" aria-label="Définition" value="${escapeAttr(v.definition)}" placeholder="Définition (facultatif)">
          <select data-field="seance" aria-label="Séance">
            ${options.map((n) => `<option value="${n}" ${v.seance === n ? "selected" : ""}>Séance ${n}</option>`).join("")}
          </select>
          <button type="button" class="ghost small" data-action="remove-vocab" data-index="${i}">Retirer</button>
        </div>
      `).join("")}
    </div>
  `;
}

// --- Édition des œuvres / supports -----------------------------------------

function addOeuvreRow() {
  state.oeuvres.push({ titre: "", auteur: "", note: "" });
  renderOeuvresEditor();
}

function onOeuvresEditorClick(e) {
  const btn = e.target.closest("[data-action='remove-oeuvre']");
  if (!btn) return;
  const idx = parseInt(btn.dataset.index, 10);
  state.oeuvres.splice(idx, 1);
  renderOeuvresEditor();
  rebuildSeances();
  renderSeancesTable();
}

function onOeuvresEditorInput(e) {
  const row = e.target.closest(".edit-row");
  if (!row) return;
  const idx = parseInt(row.dataset.index, 10);
  if (Number.isNaN(idx) || !state.oeuvres[idx]) return;
  const field = e.target.dataset.field;
  if (["titre", "auteur", "note"].includes(field)) {
    state.oeuvres[idx][field] = e.target.value;
  }
  rebuildSeances();
  renderSeancesTable();
}

function renderOeuvresEditor() {
  el("oeuvres-editor").innerHTML = `
    <div class="edit-list" style="margin-top:.8rem;">
      ${state.oeuvres.map((o, i) => `
        <div class="edit-row oeuvre" data-index="${i}">
          <input type="text" data-field="titre" aria-label="Titre" value="${escapeAttr(o.titre)}" placeholder="Titre">
          <input type="text" data-field="auteur" aria-label="Auteur" value="${escapeAttr(o.auteur)}" placeholder="Auteur / interprète">
          <input type="text" data-field="note" aria-label="Note" value="${escapeAttr(o.note)}" placeholder="Note (facultatif)">
          <button type="button" class="ghost small" data-action="remove-oeuvre" data-index="${i}">Retirer</button>
        </div>
      `).join("")}
    </div>
  `;
}

function escapeAttr(str) {
  return String(str || "").replace(/"/g, "&quot;");
}

// --- Construction du scénario de séances ------------------------------------

function rebuildSeances() {
  const trame = trameForNb(state.nbSeances);
  state.seances = trame.map((s, i) => {
    const numero = i + 1;
    const vocabSeance = state.vocab.filter((v) => v.seance === numero && v.mot.trim() !== "");
    return {
      numero,
      titre: s.titre,
      type: s.type,
      objectif: objectifPourType(s.type, state.notion, vocabSeance),
      deroule: derouleePourType(s.type, vocabSeance),
      support: supportPourType(s.type),
      traceEcrite: traceEcritePourType(s.type, vocabSeance),
      vocabSeance,
    };
  });
}

function objectifPourType(type, notion, vocabSeance) {
  switch (type) {
    case "decouverte":
      return `Entrer dans la problématique et mobiliser les représentations initiales sur : ${notion.titre.toLowerCase()}.`;
    case "ecoute":
      return vocabSeance.length
        ? `Identifier à l'écoute les caractéristiques suivantes : ${vocabSeance.map((v) => v.mot).join(", ")}.`
        : "Identifier à l'écoute les caractéristiques travaillées dans la séquence.";
    case "approfondissement":
      return `Mettre en réseau plusieurs œuvres pour consolider la notion de « ${notion.titre.toLowerCase()} ».`;
    case "pratique":
      return "S'approprier la notion par la pratique vocale ou instrumentale (interprétation ou création).";
    case "bilan":
      return "Restituer les apprentissages et s'auto-évaluer sur les attendus travaillés.";
    default:
      return "";
  }
}

function derouleePourType(type, vocabSeance) {
  switch (type) {
    case "decouverte":
      return "Écoute-problème sans consigne préalable, recueil des impressions à l'oral, formulation collective de la problématique.";
    case "ecoute":
      return vocabSeance.length
        ? `Écoute active guidée par un questionnaire, apport du vocabulaire (${vocabSeance.map((v) => v.mot).join(", ")}), institutionnalisation.`
        : "Écoute active guidée par un questionnaire, institutionnalisation.";
    case "approfondissement":
      return "Comparaison de 2 à 3 extraits, tableau comparatif à compléter, mise en relation avec la problématique.";
    case "pratique":
      return "Reprise du projet musical de la classe (chant ou création), consignes différenciées, travail par groupes ou en collectif.";
    case "bilan":
      return "Restitution (interprétation ou présentation orale), évaluation formative (QCM), bilan collectif de la séquence.";
    default:
      return "";
  }
}

function supportPourType(type) {
  if (type === "pratique") return "Projet musical de la classe (chant / création en cours)";
  const oeuvre = state.oeuvres.find((o) => o.titre.trim() !== "");
  return oeuvre ? `${oeuvre.titre}${oeuvre.auteur ? " — " + oeuvre.auteur : ""}` : "Support à préciser";
}

function traceEcritePourType(type, vocabSeance) {
  switch (type) {
    case "decouverte":
      return "Formulation de la problématique dans le cahier.";
    case "ecoute":
      return vocabSeance.length ? `Définitions du vocabulaire : ${vocabSeance.map((v) => v.mot).join(", ")}.` : "—";
    case "approfondissement":
      return "Tableau comparatif des œuvres écoutées.";
    case "pratique":
      return "Schéma ou partition annotée du projet musical.";
    case "bilan":
      return "Bilan de séquence + auto-évaluation des compétences.";
    default:
      return "";
  }
}

// --- Rendu écran 2 : séquence ------------------------------------------------

function renderSequence() {
  const g = GABARITS[state.niveau];
  el("seq-titre").textContent = `${state.notion.titre} — Classe de ${state.niveau}`;
  el("seq-etablissement").textContent = [state.etablissement, state.classe].filter(Boolean).join(" · ") || "—";
  el("problematique-live").value = state.problematique;
  el("seq-reference").innerHTML = `<div class="ref-box">${g.reference_programme}</div>`;
  el("seq-competences").innerHTML = g.competences.map((c) => `<li>${c}</li>`).join("");
  el("seq-attendus").innerHTML = state.notion.attendus.map((a) => `<li>${a}</li>`).join("");
  renderSeancesTable();
}

const TYPE_META = {
  decouverte:        { icone: "🔎", label: "Découverte" },
  ecoute:            { icone: "🎧", label: "Écoute" },
  approfondissement: { icone: "🧩", label: "Approfondissement" },
  pratique:          { icone: "🎤", label: "Pratique" },
  bilan:             { icone: "✅", label: "Bilan" },
};

function renderSeancesTable() {
  el("seq-seances-body").innerHTML = state.seances.map((s) => {
    const m = TYPE_META[s.type] || { icone: "🎵", label: "" };
    return `
    <article class="seance ${s.type}">
      <div class="num"><span>Séance</span><b>${s.numero}</b></div>
      <div class="body">
        <h4>${m.icone} ${s.titre} <span class="tag">${m.label}</span></h4>
        <dl>
          <div><dt>Objectif</dt><dd>${s.objectif}</dd></div>
          <div><dt>Déroulé</dt><dd>${s.deroule}</dd></div>
          <div class="grid2">
            <div class="box"><dt>Support</dt><dd>${s.support}</dd></div>
            <div class="box"><dt>Trace écrite</dt><dd>${s.traceEcrite}</dd></div>
          </div>
        </dl>
      </div>
    </article>`;
  }).join("");
}

// --- Rendu écran 3 : fiches ---------------------------------------------------

function renderFiches() {
  rebuildSeances();
  renderFicheEleve();
  renderFicheProf();
  renderFicheTrace();
  switchFiche("eleve");
}

function renderFicheEleve() {
  const s = state;
  const seancesRows = s.seances.map((se) => `
    <tr>
      <td>${se.numero}</td>
      <td>${se.titre}</td>
      <td><div class="blank-lines"></div></td>
    </tr>
  `).join("");

  const vocabRows = s.vocab.filter((v) => v.mot.trim() !== "").map((v) => `
    <tr><td style="width:35%;">${v.mot} <span class="hint">(séance ${v.seance})</span></td><td><div class="blank-lines"></div></td></tr>
  `).join("");

  el("fiche-eleve").innerHTML = `
    <div class="fiche-header">
      <div>
        <div class="titre-fiche">${s.notion.titre}</div>
        <div class="hint">Classe de ${s.niveau} — ${GABARITS[s.niveau].cycle}</div>
      </div>
      <div class="type-fiche">Fiche élève</div>
    </div>
    <div class="identite-eleve">
      <div><span>Nom</span><div class="blank-line"></div></div>
      <div><span>Prénom</span><div class="blank-line"></div></div>
      <div><span>Classe</span><div class="blank-line">${s.classe || ""}</div></div>
      <div><span>Date</span><div class="blank-line"></div></div>
    </div>

    <h4>Problématique</h4>
    <p><em>${s.problematique}</em></p>

    <h4>Vocabulaire à définir</h4>
    <table><tbody>${vocabRows || "<tr><td>Aucun mot renseigné</td></tr>"}</tbody></table>

    <h4>Déroulé de la séquence</h4>
    <table>
      <thead><tr><th>Séance</th><th>Titre</th><th>Notes personnelles</th></tr></thead>
      <tbody>${seancesRows}</tbody>
    </table>

    <h4>Bilan de séquence</h4>
    <p>Ce que je retiens :</p>
    <div class="blank-lines"></div><div class="blank-lines"></div><div class="blank-lines"></div>
  `;
}

function renderFicheProf() {
  const s = state;
  const g = GABARITS[s.niveau];

  const seancesRows = s.seances.map((se) => `
    <tr>
      <td>${se.numero}</td>
      <td>${se.titre}</td>
      <td>${se.objectif}</td>
      <td>${se.deroule}</td>
      <td>${se.support}</td>
      <td>${se.traceEcrite}</td>
    </tr>
  `).join("");

  const vocabRows = s.vocab.filter((v) => v.mot.trim() !== "").map((v) => `
    <tr>
      <td style="width:22%;">${v.mot}</td>
      <td class="corrige">${v.definition || "définition à compléter"}</td>
      <td style="width:12%;">séance ${v.seance}</td>
    </tr>
  `).join("");

  const oeuvresList = s.oeuvres.filter((o) => o.titre.trim() !== "").map((o) =>
    `<li>${o.titre}${o.auteur ? " — " + o.auteur : ""}${o.note ? ` <em>(${o.note})</em>` : ""}</li>`
  ).join("");

  el("fiche-prof").innerHTML = `
    <div class="fiche-header">
      <div>
        <div class="titre-fiche">${s.notion.titre}</div>
        <div class="hint">Classe de ${s.niveau} — ${g.cycle} ${s.etablissement ? "— " + s.etablissement : ""}</div>
      </div>
      <div class="type-fiche">Fiche professeur — corrigé</div>
    </div>

    <h4>Référence réglementaire</h4>
    <p class="hint">${g.reference_programme}</p>

    <h4>Compétences travaillées</h4>
    <ul class="attendus">${g.competences.map((c) => `<li>${c}</li>`).join("")}</ul>

    <h4>Attendus de fin de cycle mobilisés</h4>
    <ul class="attendus">${s.notion.attendus.map((a) => `<li>${a}</li>`).join("")}</ul>

    <h4>Problématique</h4>
    <p><em>${s.problematique}</em></p>

    <h4>Vocabulaire — corrigé (par séance)</h4>
    <table>
      <thead><tr><th>Mot</th><th>Définition</th><th>Séance</th></tr></thead>
      <tbody>${vocabRows || "<tr><td colspan='3'>Aucun mot renseigné</td></tr>"}</tbody>
    </table>

    <h4>Œuvres / supports retenus</h4>
    <ul>${oeuvresList || "<li>Aucune œuvre renseignée</li>"}</ul>
    <p class="hint">⚠ Liste telle que vous l'avez éditée — vérifiez-la avant diffusion.</p>

    <h4>Scénario détaillé des séances</h4>
    <table>
      <thead><tr><th>N°</th><th>Titre</th><th>Objectif</th><th>Déroulé</th><th>Support</th><th>Trace écrite</th></tr></thead>
      <tbody>${seancesRows}</tbody>
    </table>

    <h4>Grille d'évaluation indicative</h4>
    <table>
      <thead><tr><th>Compétence</th><th>Maîtrise insuffisante</th><th>Maîtrise fragile</th><th>Maîtrise satisfaisante</th><th>Très bonne maîtrise</th></tr></thead>
      <tbody>
        ${g.competences.map((c) => `<tr><td>${c}</td><td></td><td></td><td></td><td></td></tr>`).join("")}
      </tbody>
    </table>
    <p class="hint">Grille à préciser avec vos propres critères observables avant usage en conseil de classe ou en inspection.</p>
  `;
}

function renderFicheTrace() {
  const s = state;
  const g = GABARITS[s.niveau];

  const seancesAvecVocab = s.seances.filter((se) => se.vocabSeance.length > 0);
  const sections = seancesAvecVocab.map((se) => `
    <h4>Séance ${se.numero} — ${se.titre}</h4>
    <table>
      <thead><tr><th style="width:28%;">Mot</th><th>Définition proposée</th></tr></thead>
      <tbody>
        ${se.vocabSeance.map((v) => `
          <tr><td>${v.mot}</td><td>${v.definition || '<span class="hint">à rédiger avec la classe</span>'}</td></tr>
        `).join("")}
      </tbody>
    </table>
  `).join("");

  const oeuvresList = s.oeuvres.filter((o) => o.titre.trim() !== "").map((o) =>
    `<li>${o.titre}${o.auteur ? " — " + o.auteur : ""}</li>`
  ).join("");

  el("fiche-trace").innerHTML = `
    <div class="fiche-header">
      <div>
        <div class="titre-fiche">${s.notion.titre}</div>
        <div class="hint">Classe de ${s.niveau} — ${g.cycle}</div>
      </div>
      <div class="type-fiche">Trace écrite — support de préparation</div>
    </div>
    <p class="hint">À projeter, dicter ou recopier au tableau ; les définitions proposées sont des points de départ à ajuster avec la classe.</p>

    <h4>Problématique de la séquence</h4>
    <p style="font-size:1.02rem; font-style:italic;">${s.problematique}</p>

    ${sections || "<p class='hint'>Aucun vocabulaire affecté à une séance pour le moment.</p>"}

    <h4>Œuvres et repères culturels étudiés</h4>
    <ul>${oeuvresList || "<li>Aucune œuvre renseignée</li>"}</ul>
  `;
}

function switchFiche(which) {
  document.querySelectorAll(".fiche").forEach((f) => f.classList.remove("active"));
  el(`fiche-${which}`).classList.add("active");
  ["eleve", "prof", "trace"].forEach((k) => {
    el(`btn-fiche-${k}`).classList.toggle("secondary", k !== which);
    el(`btn-fiche-${k}`).classList.toggle("tab-active", k === which);
  });
}

function showStep(n) {
  [1, 2, 3].forEach((i) => {
    el(`screen-${i}`).style.display = i === n ? "block" : "none";
    el(`step-${i}`).classList.toggle("active", i === n);
    el(`step-${i}`).classList.toggle("done", i < n);
  });
  window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", initApp);
