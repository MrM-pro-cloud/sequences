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
  entree: "notion",
  competence: null,   // index de la compétence mise en avant
  suggestMode: "analyser",
  autoPb: "",         // problématique posée automatiquement par le sélecteur
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
  document.querySelectorAll(".entry-tab").forEach((b) => b.addEventListener("click", () => setEntree(b.dataset.entry)));
  el("entry-picker").addEventListener("click", onPickerClick);
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
  el("suggest-box").addEventListener("click", onSuggestClick);
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
  state.domaineFiltre = null;
  state.competence = null;
  renderEntryPicker();
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
  const pbField = el("problematique-custom");
  if (state.autoPb && pbField.value === state.autoPb) pbField.value = "";
  state.autoPb = "";
  const niveau = el("niveau").value;
  const notionId = el("notion").value;
  const notion = getNotion(niveau, notionId);
  const preview = el("notion-preview");
  highlightPicked();
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
  if (state.entree !== "competence") state.competence = null;

  state.suggestMode = "analyser";
  state.vocab = initVocabFromNotion(notion, nbSeances);
  state.oeuvres = notion.oeuvres_suggerees.map((o) => ({ titre: o.titre, auteur: o.auteur, note: o.note || "", usage: "analyser" }));

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
  state.oeuvres.push({ titre: "", auteur: "", note: "", usage: "analyser" });
  renderOeuvresEditor();
}

function onOeuvresEditorClick(e) {
  const btn = e.target.closest("[data-action='remove-oeuvre']");
  if (!btn) return;
  const idx = parseInt(btn.dataset.index, 10);
  state.oeuvres.splice(idx, 1);
  renderOeuvresEditor();
  renderSuggestions();
  rebuildSeances();
  renderSeancesTable();
}

function onOeuvresEditorInput(e) {
  const row = e.target.closest(".edit-row");
  if (!row) return;
  const idx = parseInt(row.dataset.index, 10);
  if (Number.isNaN(idx) || !state.oeuvres[idx]) return;
  const field = e.target.dataset.field;
  if (["titre", "auteur", "note", "usage"].includes(field)) {
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
          <select data-field="usage" aria-label="Usage">
            <option value="analyser" ${o.usage === "analyser" ? "selected" : ""}>À analyser</option>
            <option value="chanter" ${o.usage === "chanter" ? "selected" : ""}>À chanter</option>
            <option value="ac" ${o.usage === "ac" ? "selected" : ""}>Les deux</option>
          </select>
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
  const valides = state.oeuvres.filter((o) => o.titre.trim() !== "");
  const label = (o) => `${o.titre}${o.auteur ? " — " + o.auteur : ""}`;
  if (type === "pratique") {
    const chant = valides.find((o) => o.usage === "chanter" || o.usage === "ac");
    return chant ? `À chanter : ${label(chant)}` : "Projet musical de la classe (chant / création en cours)";
  }
  const oeuvre = valides.find((o) => o.usage !== "chanter");
  return oeuvre ? label(oeuvre) : "Support à préciser";
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
  el("seq-competences").innerHTML = g.competences.map((c, i) => i === state.competence ? `<li class="focus">${c} <span class="badge warn">★ mise en avant</span></li>` : `<li>${c}</li>`).join("");
  el("seq-attendus").innerHTML = state.notion.attendus.map((a) => `<li>${a}</li>`).join("");
  renderSeancesTable();
  renderSuggestions();
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
    `<li>${o.titre}${o.auteur ? " — " + o.auteur : ""} <strong>[${usageLabel(o.usage)}]</strong>${o.note ? ` <em>(${o.note})</em>` : ""}</li>`
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
    <ul class="attendus">${g.competences.map((c, i) => `<li>${c}${i === state.competence ? " <strong>(compétence mise en avant)</strong>" : ""}</li>`).join("")}</ul>

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
    `<li>${o.titre}${o.auteur ? " — " + o.auteur : ""} <strong>[${usageLabel(o.usage)}]</strong></li>`
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


// --- Points d'entrée : notion, problématique, domaine, compétence -------------

const COMPETENCE_MOTS = [
  /chant|interpr|reproduire|r[ée]aliser|projet|jouer|pratique|vocal/i,
  /[ée]cout|identifier|rep[ée]r|compar|reconna|situer|culture|d[ée]crire/i,
  /cr[ée]|imagin|explor|inventer|improvis|compos|produire/i,
  /[ée]chang|argument|d[ée]bat|commenter|justifier|partager|exprimer|vocabulaire/i,
];

function notionTexte(n) {
  return [n.titre, n.domaine, ...n.attendus].join(" ");
}

function notionCorrespondCompetence(n, idx) {
  return COMPETENCE_MOTS[idx] ? COMPETENCE_MOTS[idx].test(notionTexte(n)) : false;
}

function domainesDuNiveau(niveau) {
  const set = new Set();
  GABARITS[niveau].notions.forEach((n) => n.domaine.split("/").forEach((d) => set.add(d.trim())));
  return [...set];
}

function setEntree(mode) {
  state.entree = mode;
  document.querySelectorAll(".entry-tab").forEach((b) => {
    const on = b.dataset.entry === mode;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  el("field-notion").style.display = mode === "notion" ? "" : "none";
  if (mode !== "competence") state.competence = null;
  renderEntryPicker();
}

function selectNotion(id, problematique) {
  el("notion").value = id;
  onNotionChange();
  if (problematique) {
    el("problematique-custom").value = problematique;
    state.autoPb = problematique;
  }
  el("notion-preview").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function notionCard(n, extra) {
  return `<button type="button" class="pick" data-pick="notion" data-notion="${n.id}">
    <strong>${n.titre}</strong>
    <span class="meta">${n.periode} · ${n.domaine}${extra || ""}</span>
  </button>`;
}

function renderEntryPicker() {
  const box = el("entry-picker");
  const niveau = el("niveau").value;
  if (!niveau || !GABARITS[niveau] || state.entree === "notion") { box.innerHTML = ""; return; }
  const g = GABARITS[niveau];
  const notions = [...g.notions].sort((a, b) => a.ordre - b.ordre);

  if (state.entree === "problematique") {
    const items = notions.flatMap((n) => n.problematiques_exemples.map((p, i) => ({ n, p, i })));
    box.innerHTML = `
      <p class="entry-note">Choisissez la question qui vous donne envie de démarrer : la notion associée est sélectionnée pour vous.</p>
      <div class="pick-list">${items.map(({ n, p, i }) => `
        <button type="button" class="pick" data-pick="problematique" data-notion="${n.id}" data-pb="${i}">
          <strong>${p}</strong>
          <span class="meta">${n.titre} · ${n.domaine}</span>
        </button>`).join("")}
      </div>`;
  } else if (state.entree === "domaine") {
    const doms = domainesDuNiveau(niveau);
    const f = state.domaineFiltre;
    const liste = f ? notions.filter((n) => n.domaine.split("/").map((d) => d.trim()).includes(f)) : [];
    box.innerHTML = `
      <p class="entry-note">Choisissez un des domaines du programme, puis la notion qui s'y rattache.</p>
      <div class="chip-row">${doms.map((d) => `<button type="button" class="chip ${d === f ? "active" : ""}" data-pick="domaine" data-domaine="${d}">${d}</button>`).join("")}</div>
      ${f ? `<div class="pick-list">${liste.map((n) => notionCard(n)).join("")}</div>` : ""}`;
  } else if (state.entree === "competence") {
    const c = state.competence;
    const triees = c === null ? [] : [...notions].sort((a, b) =>
      Number(notionCorrespondCompetence(b, c)) - Number(notionCorrespondCompetence(a, c)) || a.ordre - b.ordre);
    box.innerHTML = `
      <p class="entry-note">Choisissez la compétence à mettre en avant. Les notions dont les attendus la mobilisent le plus sont proposées en premier (★) : c'est une suggestion à valider, les quatre compétences restent travaillées dans toute séquence.</p>
      <div class="chip-row">${g.competences.map((comp, i) => `<button type="button" class="chip ${i === c ? "active" : ""}" data-pick="competence" data-comp="${i}">${comp}</button>`).join("")}</div>
      ${c !== null ? `<div class="pick-list">${triees.map((n) => notionCard(n, notionCorrespondCompetence(n, c) ? ' · <span class="star">★ suggérée</span>' : "")).join("")}</div>` : ""}`;
  }
  highlightPicked();
}

function onPickerClick(e) {
  const b = e.target.closest("[data-pick]");
  if (!b) return;
  const kind = b.dataset.pick;
  const niveau = el("niveau").value;
  if (kind === "domaine") {
    state.domaineFiltre = b.dataset.domaine;
    renderEntryPicker();
  } else if (kind === "competence") {
    state.competence = parseInt(b.dataset.comp, 10);
    renderEntryPicker();
  } else if (kind === "problematique") {
    const n = getNotion(niveau, b.dataset.notion);
    selectNotion(n.id, n.problematiques_exemples[parseInt(b.dataset.pb, 10)]);
  } else if (kind === "notion") {
    selectNotion(b.dataset.notion);
  }
}

function highlightPicked() {
  const id = el("notion").value;
  const pb = el("problematique-custom").value;
  document.querySelectorAll("#entry-picker button.pick").forEach((b) => {
    let on = b.dataset.notion === id;
    if (b.dataset.pick === "problematique") {
      const n = getNotion(el("niveau").value, b.dataset.notion);
      on = on && n && n.problematiques_exemples[parseInt(b.dataset.pb, 10)] === pb;
    }
    b.classList.toggle("selected", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
}


// --- Suggestions d'œuvres : à analyser / à chanter --------------------------------

function usageLabel(u) {
  return u === "chanter" ? "à chanter" : u === "ac" ? "à analyser et à chanter" : "à analyser";
}

function renderSuggestions() {
  const box = el("suggest-box");
  if (!state.notion || typeof BANQUE_OEUVRES === "undefined") { box.innerHTML = ""; return; }
  const cycle = state.niveau === "6e" ? 3 : 4;
  const doms = state.notion.domaine.split("/").map((d) => d.trim());
  const mode = state.suggestMode;
  const lettre = mode === "chanter" ? "c" : "a";
  const dejaAjoutees = new Set(state.oeuvres.map((o) => o.titre.trim().toLowerCase()));
  const liste = BANQUE_OEUVRES
    .filter((o) => o.cycles.includes(cycle) && o.u.includes(lettre))
    .map((o) => ({ o, score: o.d.filter((d) => doms.includes(d)).length }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score);

  box.innerHTML = `
    <h4>💡 Suggestions pour « ${state.notion.titre} »</h4>
    <p class="hint">Choisies selon le domaine (${doms.join(", ")}) et le niveau. Écoutez chaque œuvre avant de la retenir : titres et références sont à vérifier.</p>
    <div class="chip-row">
      <button type="button" class="chip ${mode === "analyser" ? "active" : ""}" data-sugg-mode="analyser">🎧 À analyser</button>
      <button type="button" class="chip ${mode === "chanter" ? "active" : ""}" data-sugg-mode="chanter">🎤 À chanter</button>
    </div>
    ${liste.length ? `<div class="suggest-list">${liste.map(({ o }) => {
      const ajoutee = dejaAjoutees.has(o.t.toLowerCase());
      return `<div class="sugg ${ajoutee ? "added" : ""}">
        <strong>${o.t}</strong>
        <span class="meta">${o.a}</span>
        <p>${o.n}</p>
        <button type="button" class="small ${ajoutee ? "" : "secondary"}" data-sugg-add="${BANQUE_OEUVRES.indexOf(o)}" ${ajoutee ? "disabled" : ""}>${ajoutee ? "✓ Ajoutée" : "＋ Ajouter"}</button>
      </div>`;
    }).join("")}</div>` : `<p class="hint">Aucune suggestion pour ce domaine et ce niveau : ajoutez vos propres œuvres ci-dessus.</p>`}
  `;
}

function onSuggestClick(e) {
  const m = e.target.closest("[data-sugg-mode]");
  if (m) { state.suggestMode = m.dataset.suggMode; renderSuggestions(); return; }
  const add = e.target.closest("[data-sugg-add]");
  if (!add) return;
  const o = BANQUE_OEUVRES[parseInt(add.dataset.suggAdd, 10)];
  if (!o) return;
  state.oeuvres.push({
    titre: o.t, auteur: o.a, note: o.n,
    usage: o.u === "ac" ? "ac" : (state.suggestMode === "chanter" ? "chanter" : "analyser"),
  });
  renderOeuvresEditor();
  rebuildSeances();
  renderSeancesTable();
  renderSuggestions();
}

document.addEventListener("DOMContentLoaded", initApp);
