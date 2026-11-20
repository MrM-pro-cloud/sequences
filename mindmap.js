/*
 * Carte mentale de la séquence — générée en SVG à partir de l'état de l'application.
 * Disposition : la notion au centre, les branches réparties à gauche et à droite
 * (équilibrées en hauteur). Chaque séance reprend la couleur de son type.
 */

const MM_COULEURS = {
  probl:   { c: "#C98F00", soft: "#FFF1C2" },
  comp:    { c: "#5B34D6", soft: "#E9E2FF" },
  attendus:{ c: "#0F6FB8", soft: "#DDF1FF" },
  seances: { c: "#1D1A4A", soft: "#E8E8F5" },
  vocab:   { c: "#00696C", soft: "#D2F5F5" },
  analyser:{ c: "#7A3FD6", soft: "#EFE6FF" },
  chanter: { c: "#1B9A50", soft: "#D9F5E4" },
};

const MM_TYPE_SEANCE = {
  decouverte:        { c: "#C98F00", soft: "#FFF1C2" },
  ecoute:            { c: "#00969A", soft: "#D2F5F5" },
  approfondissement: { c: "#5B34D6", soft: "#E9E2FF" },
  pratique:          { c: "#0F6FB8", soft: "#DDF1FF" },
  bilan:             { c: "#1B9A50", soft: "#D9F5E4" },
};

function mmEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function mmWrap(text, maxChars) {
  const mots = String(text).replace(/\s+/g, " ").trim().split(" ");
  const lignes = [];
  let cur = "";
  mots.forEach((m) => {
    if (!cur) { cur = m; return; }
    if ((cur + " " + m).length <= maxChars) cur += " " + m;
    else { lignes.push(cur); cur = m; }
  });
  if (cur) lignes.push(cur);
  return lignes.length ? lignes : [""];
}

function buildMindMapSVG(st) {
  const g = GABARITS[st.niveau];
  const W = 1500, CX = 750, ELL_RX = 175, ELL_RY = 72;
  const KID_W = 250, KID_CHARS = 31, LH = 17, KID_GAP = 9, BLOCK_GAP = 30;
  const LAB_W = 200, LAB_H = 46;
  const L = { kidX: 20, labX: 310 };
  const R = { labX: 990, kidX: 1230 };

  const oeuvres = st.oeuvres.filter((o) => o.titre.trim() !== "");
  const label = (o) => o.titre + (o.auteur ? " — " + o.auteur : "");
  const vocabOk = st.vocab.filter((v) => v.mot.trim() !== "");
  const VOC_MAX = 12;

  const branches = [
    { nom: "Séances", col: MM_COULEURS.seances,
      kids: st.seances.map((s) => ({ t: `S${s.numero} · ${s.titre}`, col: MM_TYPE_SEANCE[s.type] || MM_COULEURS.seances })) },
    { nom: "Vocabulaire", col: MM_COULEURS.vocab,
      kids: vocabOk.slice(0, VOC_MAX).map((v) => ({ t: `${v.mot} (S${v.seance})` }))
        .concat(vocabOk.length > VOC_MAX ? [{ t: `+ ${vocabOk.length - VOC_MAX} autres mots` }] : []) },
    { nom: "Problématique", col: MM_COULEURS.probl, kids: [{ t: st.problematique }] },
    { nom: "Compétences", col: MM_COULEURS.comp,
      kids: g.competences.map((c, i) => ({ t: (i === st.competence ? "★ " : "") + c })) },
    { nom: "Attendus de fin de cycle", col: MM_COULEURS.attendus, kids: st.notion.attendus.map((a) => ({ t: a })) },
    { nom: "Œuvres à analyser", col: MM_COULEURS.analyser,
      kids: oeuvres.filter((o) => o.usage !== "chanter").map((o) => ({ t: label(o) })) },
    { nom: "Œuvres à chanter", col: MM_COULEURS.chanter,
      kids: oeuvres.filter((o) => o.usage === "chanter" || o.usage === "ac").map((o) => ({ t: label(o) })) },
  ].filter((b) => b.kids.length > 0);

  // mesure des blocs
  branches.forEach((b) => {
    b.kids.forEach((k) => {
      k.lines = mmWrap(k.t, KID_CHARS);
      k.h = k.lines.length * LH + 14;
    });
    b.labLines = mmWrap(b.nom, 20);
    b.kidsH = b.kids.reduce((s, k) => s + k.h, 0) + KID_GAP * (b.kids.length - 1);
    b.h = Math.max(b.kidsH, LAB_H);
  });

  // répartition équilibrée gauche / droite (ordre conservé dans chaque côté)
  const sides = { left: [], right: [] };
  const tot = { left: 0, right: 0 };
  branches.forEach((b) => {
    const side = tot.right <= tot.left ? "right" : "left";
    sides[side].push(b);
    tot[side] += b.h + BLOCK_GAP;
  });
  Object.keys(tot).forEach((k) => { tot[k] -= BLOCK_GAP; });
  const TOP = 78;
  const colH = Math.max(tot.left, tot.right, ELL_RY * 2 + 20);
  const H = TOP + colH + 40;
  const CY = TOP + colH / 2;

  let svg = "";
  const parts = [];

  const placeSide = (side, geo, dir) => {
    const list = sides[side];
    if (!list.length) return;
    let y = TOP + (colH - tot[side]) / 2;
    list.forEach((b) => {
      const labY = y + b.h / 2;
      const labX = geo.labX;
      const edgeCentre = dir > 0 ? CX + ELL_RX : CX - ELL_RX;
      const edgeLab = dir > 0 ? labX : labX + LAB_W;
      const xm = (edgeCentre + edgeLab) / 2;
      parts.push(`<path d="M${edgeCentre},${CY} C${xm},${CY} ${xm},${labY} ${edgeLab},${labY}" fill="none" stroke="${b.col.c}" stroke-width="5" stroke-linecap="round"/>`);
      // étiquette de branche
      parts.push(`<rect x="${labX}" y="${labY - LAB_H / 2}" width="${LAB_W}" height="${LAB_H}" rx="23" fill="${b.col.c}"/>`);
      const ly0 = labY - ((b.labLines.length - 1) * 18) / 2 + 6;
      b.labLines.forEach((ln, i) => {
        parts.push(`<text x="${labX + LAB_W / 2}" y="${ly0 + i * 18}" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${mmEsc(ln)}</text>`);
      });
      // enfants
      let ky = labY - b.kidsH / 2;
      const kidsX = geo.kidX;
      b.kids.forEach((k) => {
        const kc = k.col || b.col;
        const edgeFrom = dir > 0 ? labX + LAB_W : labX;
        const edgeTo = dir > 0 ? kidsX : kidsX + KID_W;
        const km = (edgeFrom + edgeTo) / 2;
        const kcy = ky + k.h / 2;
        parts.push(`<path d="M${edgeFrom},${labY} C${km},${labY} ${km},${kcy} ${edgeTo},${kcy}" fill="none" stroke="${kc.c}" stroke-width="2.5"/>`);
        parts.push(`<rect x="${kidsX}" y="${ky}" width="${KID_W}" height="${k.h}" rx="10" fill="${kc.soft}" stroke="${kc.c}" stroke-width="2"/>`);
        k.lines.forEach((ln, i) => {
          parts.push(`<text x="${kidsX + 10}" y="${ky + 7 + (i + 1) * LH - 4}" font-size="14" fill="#1D1A4A">${mmEsc(ln)}</text>`);
        });
        ky += k.h + KID_GAP;
      });
      y += b.h + BLOCK_GAP;
    });
  };
  placeSide("left", L, -1);
  placeSide("right", R, +1);

  // titre et nœud central
  const sousTitre = `Classe de ${st.niveau}${st.classe ? " · " + st.classe : ""}`;
  const centreLignes = mmWrap(st.notion.titre, 24).slice(0, 4);
  const cy0 = CY - ((centreLignes.length - 1) * 23) / 2 + 2;
  parts.push(`<ellipse cx="${CX}" cy="${CY}" rx="${ELL_RX}" ry="${ELL_RY}" fill="#5B34D6" stroke="#1D1A4A" stroke-width="4"/>`);
  centreLignes.forEach((ln, i) => {
    parts.push(`<text x="${CX}" y="${cy0 + i * 23}" text-anchor="middle" font-size="19" font-weight="800" fill="#fff">${mmEsc(ln)}</text>`);
  });
  parts.push(`<text x="${CX}" y="${CY + ELL_RY - 12}" text-anchor="middle" font-size="13" fill="#E9E2FF">${mmEsc(sousTitre)}</text>`);

  svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="'Atkinson Hyperlegible', Arial, Helvetica, sans-serif" role="img" aria-label="Carte mentale de la séquence ${mmEsc(st.notion.titre)}">
<rect width="${W}" height="${H}" fill="#ffffff"/>
<text x="20" y="40" font-size="24" font-weight="800" fill="#1D1A4A">Carte mentale — ${mmEsc(st.notion.titre)}</text>
${parts.join("\n")}
</svg>`;
  return { svg, width: W, height: H };
}

// Conversion du SVG en image PNG (pour le téléchargement et l'export Word)
function svgToPngBytes(svg, width, height, scale) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = width * scale; c.height = height * scale;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((blob) => {
          if (!blob) return reject(new Error("Conversion PNG impossible"));
          blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)), reject);
        }, "image/png");
      } catch (e) { reject(e); }
    };
    img.onerror = () => reject(new Error("Image SVG illisible"));
    img.src = url;
  });
}
