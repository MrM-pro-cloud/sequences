/*
 * Export des fiches au format Word (.docx), sans bibliothèque externe.
 * Le fichier s'ouvre dans Pages (Fichier > Ouvrir), Word, LibreOffice et Google Docs.
 * (Le format natif .pages n'est pas documenté publiquement : .docx est le format d'échange.)
 *
 * Principe : on parcourt le HTML des fiches déjà affichées et on le traduit en
 * paragraphes et tableaux Word ; le tout est placé dans une archive ZIP (méthode « stockée »).
 */

// ---------- ZIP minimal ----------------------------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function zipStore(files) { // files : [{ name, data: Uint8Array }]
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const u16 = (v) => [v & 255, (v >>> 8) & 255];
  const u32 = (v) => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
  files.forEach((f) => {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;
    const local = new Uint8Array([
      ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21),
      ...u32(crc), ...u32(size), ...u32(size), ...u16(name.length), ...u16(0),
    ]);
    chunks.push(local, name, f.data);
    central.push({ name, crc, size, offset });
    offset += local.length + name.length + size;
  });
  const cdStart = offset;
  central.forEach((c) => {
    const rec = new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21),
      ...u32(c.crc), ...u32(c.size), ...u32(c.size), ...u16(c.name.length), ...u16(0), ...u16(0),
      ...u16(0), ...u16(0), ...u32(0), ...u32(c.offset),
    ]);
    chunks.push(rec, c.name);
    offset += rec.length + c.name.length;
  });
  const cdSize = offset - cdStart;
  chunks.push(new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(central.length), ...u16(central.length),
    ...u32(cdSize), ...u32(cdStart), ...u16(0),
  ]));
  return new Blob(chunks, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

// ---------- Utilitaires XML -----------------------------------------------------
const xe = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const PAGE = {
  portrait:  { w: 11906, h: 16838, m: 850, orient: "portrait" },
  landscape: { w: 16838, h: 11906, m: 850, orient: "landscape" },
};
const contentWidth = (p) => p.w - 2 * p.m;

function sectPr(p) {
  return `<w:sectPr><w:pgSz w:w="${p.w}" w:h="${p.h}"${p.orient === "landscape" ? ' w:orient="landscape"' : ""}/>` +
    `<w:pgMar w:top="${p.m}" w:right="${p.m}" w:bottom="${p.m}" w:left="${p.m}" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>`;
}

// ---------- Traduction du HTML en Word ------------------------------------------
function runXml(text, f) {
  if (!text) return "";
  const rpr = `${f.b ? "<w:b/>" : ""}${f.i ? "<w:i/>" : ""}` +
    `${f.color ? `<w:color w:val="${f.color}"/>` : ""}` +
    `${f.size ? `<w:sz w:val="${f.size}"/><w:szCs w:val="${f.size}"/>` : ""}`;
  return `<w:r>${rpr ? `<w:rPr>${rpr}</w:rPr>` : ""}<w:t xml:space="preserve">${xe(text)}</w:t></w:r>`;
}

function inlineRuns(node, f) {
  let out = "";
  node.childNodes.forEach((n) => {
    if (n.nodeType === 3) {
      out += runXml(n.nodeValue.replace(/\s+/g, " "), f);
    } else if (n.nodeType === 1) {
      const tag = n.tagName.toLowerCase();
      if (tag === "br") { out += "<w:r><w:br/></w:r>"; return; }
      const nf = { ...f };
      if (tag === "em" || tag === "i" || n.classList.contains("corrige")) nf.i = true;
      if (tag === "strong" || tag === "b") nf.b = true;
      if (n.classList.contains("hint")) { nf.color = "555555"; nf.size = nf.size || 18; }
      out += inlineRuns(n, nf);
    }
  });
  return out;
}

function para(runs, o = {}) {
  const ppr = [];
  if (o.keepNext) ppr.push("<w:keepNext/>");
  if (o.border || o.shade) {
    ppr.push(`<w:pBdr>${o.borderLeft ? '<w:left w:val="single" w:sz="36" w:space="6" w:color="000000"/>' : ""}` +
      `${o.border ? `<w:bottom w:val="single" w:sz="${o.border}" w:space="1" w:color="000000"/>` : ""}</w:pBdr>`);
  }
  if (o.shade) ppr.push(`<w:shd w:val="clear" w:color="auto" w:fill="${o.shade}"/>`);
  ppr.push(`<w:spacing w:before="${o.before ?? 0}" w:after="${o.after ?? 100}"${o.line ? ` w:line="${o.line}" w:lineRule="auto"` : ""}/>`);
  if (o.indent) ppr.push(`<w:ind w:left="${o.indent}" w:hanging="${o.hanging || 0}"/>`);
  if (o.jc) ppr.push(`<w:jc w:val="${o.jc}"/>`);
  return `<w:p><w:pPr>${ppr.join("")}</w:pPr>${runs || ""}</w:p>`;
}

const RULE = () => para("", { border: 6, after: 160, line: 480 });   // ligne à remplir

// Contenu d'une cellule ou d'un bloc : renvoie une suite de paragraphes
function blocks(el, f) {
  let out = "";
  let buf = document.createElement("div"); // tampon de contenu « en ligne »
  const flush = () => {
    const runs = inlineRuns(buf, f);
    if (runs.replace(/<[^>]+>/g, "").trim() !== "") out += para(runs, { after: 60 });
    buf = document.createElement("div");
  };
  el.childNodes.forEach((n) => {
    if (n.nodeType === 1 && /^(div|p|ul|ol|li|table)$/i.test(n.tagName)) {
      flush();
      if (n.classList.contains("blank-lines")) out += RULE();
      else if (/^(ul|ol)$/i.test(n.tagName)) out += listXml(n, f);
      else out += blocks(n, f);
    } else buf.appendChild(n.cloneNode(true));
  });
  flush();
  return out;
}

function listXml(ul, f) {
  let out = "";
  if (ul.classList.contains("opts")) {          // cases à cocher : pas de puce
    ul.querySelectorAll(":scope > li").forEach((li) => {
      out += para(inlineRuns(li, f), { indent: 560, hanging: 0, after: 40 });
    });
    return out + para("", { after: 80 });
  }
  ul.querySelectorAll(":scope > li").forEach((li) => {
    out += para(runXml("•\t", f) + inlineRuns(li, f), { indent: 360, hanging: 260, after: 60 });
  });
  return out;
}

function tableXml(table, widthTwips) {
  const rows = [...table.querySelectorAll("tr")];
  if (!rows.length) return "";
  // nombre de colonnes (en tenant compte des colspan)
  const cols = Math.max(...rows.map((r) => [...r.children].reduce((s, c) => s + (c.colSpan || 1), 0)));
  const first = rows[0].children;
  // largeurs : style="width:NN%" quand il existe, le reste est réparti
  const pct = new Array(cols).fill(null);
  let ci = 0;
  [...first].forEach((c) => {
    const m = /width:\s*(\d+(?:\.\d+)?)%/.exec(c.getAttribute("style") || "");
    if (m && (c.colSpan || 1) === 1) pct[ci] = parseFloat(m[1]);
    ci += c.colSpan || 1;
  });
  const fixed = pct.reduce((s, v) => s + (v || 0), 0);
  const libres = pct.filter((v) => v === null).length || 1;
  const part = (100 - fixed) / libres;
  const widths = pct.map((v) => Math.round(((v === null ? part : v) / 100) * widthTwips));

  let xml = `<w:tbl><w:tblPr><w:tblW w:w="${widthTwips}" w:type="dxa"/><w:tblLayout w:type="fixed"/>` +
    `<w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map((b) => `<w:${b} w:val="single" w:sz="6" w:space="0" w:color="000000"/>`).join("")}</w:tblBorders>` +
    `<w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr>` +
    `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>`;

  rows.forEach((r) => {
    const isHead = r.closest("thead") !== null;
    const cells = [...r.children];
    const hasLines = r.querySelector(".blank-lines") !== null;
    const allEmpty = cells.every((c) => c.textContent.trim() === "");
    const trpr = `<w:trPr><w:cantSplit/>${isHead ? "<w:tblHeader/>" : ""}${hasLines ? '<w:trHeight w:val="620" w:hRule="atLeast"/>' : allEmpty ? '<w:trHeight w:val="720" w:hRule="atLeast"/>' : ""}</w:trPr>`;
    let col = 0;
    xml += `<w:tr>${trpr}`;
    cells.forEach((c) => {
      const span = c.colSpan || 1;
      const w = widths.slice(col, col + span).reduce((s, v) => s + v, 0);
      col += span;
      const f = { b: isHead || c.tagName === "TH", size: 20 };
      let inner = blocks(c, f);
      if (!inner) inner = para("", { after: 0 });
      xml += `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ""}` +
        `${isHead ? '<w:shd w:val="clear" w:color="auto" w:fill="D9D9D9"/>' : ""}<w:vAlign w:val="top"/></w:tcPr>${inner}</w:tc>`;
    });
    xml += "</w:tr>";
  });
  return xml + "</w:tbl>" + para("", { after: 80 });
}

function ficheToXml(fiche, page) {
  const W = contentWidth(page);
  let out = "";
  fiche.childNodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    const cls = n.classList;
    const tag = n.tagName.toLowerCase();
    if (cls.contains("fiche-header")) {
      const titre = n.querySelector(".titre-fiche");
      const sous = n.querySelector(".hint");
      const type = n.querySelector(".type-fiche");
      if (type) out += para(runXml(type.textContent.trim(), { b: true, size: 20, color: "444444" }), { after: 40 });
      if (titre) out += para(runXml(titre.textContent.trim(), { b: true, size: 36 }), { after: 40 });
      if (sous) out += para(runXml(sous.textContent.replace(/\s+/g, " ").trim(), { color: "555555", size: 20 }), { after: 160, border: 18 });
    } else if (cls.contains("identite-eleve")) {
      const items = [...n.children].map((d) => d.querySelector("span").textContent.trim());
      const classeVal = n.children[2] ? n.children[2].querySelector(".blank-line")?.textContent.trim() : "";
      const w = Math.floor(W / items.length);
      out += `<w:tbl><w:tblPr><w:tblW w:w="${W}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/></w:tblBorders></w:tblPr>` +
        `<w:tblGrid>${items.map(() => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid><w:tr><w:trPr><w:trHeight w:val="700" w:hRule="atLeast"/></w:trPr>` +
        items.map((it, i) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/></w:tcPr>${para(runXml(it + " : ", { b: true, size: 20 }) + (i === 2 ? runXml(classeVal, { size: 20 }) : ""), { after: 0 })}</w:tc>`).join("") +
        `</w:tr></w:tbl>` + para("", { after: 120 });
    } else if (tag === "h4") {
      out += para(runXml(n.textContent.trim(), { b: true, size: 24 }), { shade: "EDEDED", borderLeft: true, before: 260, after: 100, keepNext: true });
    } else if (tag === "p") {
      out += para(inlineRuns(n, { size: cls.contains("hint") ? 18 : 22, color: cls.contains("hint") ? "555555" : undefined }), { after: 100 });
    } else if (tag === "ul" || tag === "ol") {
      out += listXml(n, { size: 22 });
    } else if (tag === "table") {
      out += tableXml(n, W);
    } else if (cls.contains("blank-lines")) {
      out += RULE();
    }
  });
  return out;
}

// ---------- Assemblage du document ---------------------------------------------
function imageXml(rid, cx, cy) {
  return `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
    `<wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="1" name="Carte mentale" descr="Carte mentale de la séquence"/>` +
    `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
    `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="carte-mentale.png"/><pic:cNvPicPr/></pic:nvPicPr>` +
    `<pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>` +
    `</a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
}

/**
 * sections : [{ type: "fiche", el, landscape } | { type: "image", png, width, height, titre }]
 * Renvoie un Blob .docx
 */
function buildDocx(sections, titreDoc) {
  const enc = new TextEncoder();
  let body = "";
  let png = null;
  sections.forEach((s, idx) => {
    const page = s.landscape ? PAGE.landscape : PAGE.portrait;
    let xml = "";
    if (s.type === "fiche") {
      xml = ficheToXml(s.el, page);
    } else if (s.type === "image") {
      png = s.png;
      const maxW = (contentWidth(page) / 1440) * 914400;      // twips → EMU
      const maxH = ((page.h - 2 * page.m - 1500) / 1440) * 914400;
      let cx = maxW, cy = (maxW * s.height) / s.width;
      if (cy > maxH) { cy = maxH; cx = (maxH * s.width) / s.height; }
      xml = imageXml("rId2", Math.round(cx), Math.round(cy));
    }
    // le saut de section (avec la mise en page) est porté par le dernier paragraphe de la section
    body += xml + `<w:p><w:pPr>${sectPr(page).replace("<w:sectPr>", idx === sections.length - 1 ? "<w:sectPr>" : '<w:sectPr><w:type w:val="nextPage"/>')}</w:pPr></w:p>`;
  });

  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"';
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}</w:body></w:document>`;
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
    `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="fr-FR"/></w:rPr></w:rPrDefault>` +
    `<w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>` +
    `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/>` +
    `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
    `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
    `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
    `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`;
  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    (png ? `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/carte-mentale.png"/>` : "") + `</Relationships>`;
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
    `<dc:title>${xe(titreDoc)}</dc:title><dc:creator>Séquences EM</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</dcterms:created></cp:coreProperties>`;

  const files = [
    { name: "[Content_Types].xml", data: enc.encode(contentTypes) },
    { name: "_rels/.rels", data: enc.encode(rels) },
    { name: "docProps/core.xml", data: enc.encode(core) },
    { name: "word/document.xml", data: enc.encode(documentXml) },
    { name: "word/styles.xml", data: enc.encode(stylesXml) },
    { name: "word/_rels/document.xml.rels", data: enc.encode(docRels) },
  ];
  if (png) files.push({ name: "word/media/carte-mentale.png", data: png });
  return zipStore(files);
}

function slugFichier(s) {
  return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "sequence";
}

// Téléchargement : dans un aperçu intégré qui fournit la capacité « downloads », on l'utilise ;
// sur le site publié (navigateur normal), on déclenche un téléchargement classique.
async function telecharger(blob, nom) {
  try {
    if (window.claude && typeof window.claude.use === "function") {
      const dl = await window.claude.use("downloads");
      if (dl) { await dl.save({ filename: nom, data: blob }); return; }
    }
  } catch (err) {
    if (err && err.code === "declined") return;      // l'utilisateur a refusé : rien à faire
    /* sinon, on tente le téléchargement classique */
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nom;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
