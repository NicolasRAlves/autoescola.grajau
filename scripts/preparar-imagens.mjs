/* Prepara as imagens do site a partir de fotos-para-o-site/fotos.
   Gera WebP + JPG (ou PNG com transparência) em assets/img/.
   Uso: cd site/scripts && npm run imagens

   Para trocar uma foto: substitua o arquivo de origem com o MESMO nome
   e rode de novo. Para uma foto nova, acrescente uma linha em RECORTES. */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(aqui, "..");
const ORIGEM = path.resolve(SITE, "..", "fotos-para-o-site", "fotos");
const DESTINO = path.join(SITE, "assets", "img");

/* nome de saída: { arquivo de origem, recorte (left, top, width, height), largura final } */
const RECORTES = [
  { nome: "moto-frente", origem: "moto-t4.jpg", recorte: [0, 150, 720, 720], largura: 720 },
  { nome: "moto-lado", origem: "moto-t2.jpg", recorte: [0, 300, 720, 600], largura: 720 },
  { nome: "moto-instrutor", origem: "moto-t18.jpg", recorte: [0, 0, 720, 900], largura: 720 },
  { nome: "carro-aula", origem: "carro-t1.jpg", recorte: [0, 120, 480, 600], largura: 480 },
  { nome: "mascote", origem: "flyer-2.png", recorte: [60, 20, 1060, 760], largura: 900 },
  { nome: "gibi", origem: "flyer-1.png", recorte: [0, 316, 738, 900], largura: 738 }
];

async function foto(r) {
  let img = sharp(path.join(ORIGEM, r.origem));
  if (r.tampar) {
    /* cobre ícones de interface do Instagram que vieram no print */
    const meta = await img.metadata();
    const quadros = r.tampar.map(([left, top, w, h]) => ({
      input: { create: { width: Math.min(w, meta.width - left), height: Math.min(h, meta.height - top), channels: 3, background: "#000000" } },
      left, top
    }));
    img = sharp(await img.composite(quadros).png().toBuffer());
  }
  const [left, top, width, height] = r.recorte;
  const base = img.extract({ left, top, width, height }).resize({ width: r.largura, withoutEnlargement: true });
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  await sharp(buf).webp({ quality: 78 }).toFile(path.join(DESTINO, r.nome + ".webp"));
  await sharp(buf).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(DESTINO, r.nome + ".jpg"));
  console.log("ok", r.nome, meta.width + "x" + meta.height);
}

/* Logo: o dourado sobre fundo preto vira PNG transparente
   (o brilho de cada pixel define a opacidade). */
async function logo(nome, recorte, largura) {
  const [left, top, width, height] = recorte;
  const { data, info } = await sharp(path.join(ORIGEM, "moto-t26.jpg"))
    .extract({ left, top, width, height })
    .resize({ width: largura, withoutEnlargement: true })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const a = Math.max(0, Math.min(1, (max - 34) / 70));
    data[i + 3] = Math.round(a * 255);
    if (a > 0 && a < 1) { /* desfaz o escurecimento das bordas */
      data[i] = Math.min(255, Math.round(data[i] / Math.max(a, .35)));
      data[i + 1] = Math.min(255, Math.round(data[i + 1] / Math.max(a, .35)));
      data[i + 2] = Math.min(255, Math.round(data[i + 2] / Math.max(a, .35)));
    }
  }
  const png = sharp(data, { raw: info });
  await png.clone().png({ compressionLevel: 9, palette: false }).toFile(path.join(DESTINO, nome + ".png"));
  await png.clone().webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(DESTINO, nome + ".webp"));
  console.log("ok", nome, info.width + "x" + info.height);
}

/* Ícones a partir do escudo em SVG */
const ESCUDO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE29A"/><stop offset=".5" stop-color="#D9A93A"/><stop offset="1" stop-color="#9C6B17"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="#0B0B0C"/><path d="M32 7 51 13v17c0 13-8.6 22-19 27C21.6 52 13 43 13 30V13z" fill="none" stroke="url(#o)" stroke-width="4" stroke-linejoin="round"/><circle cx="32" cy="30" r="10.5" fill="none" stroke="url(#o)" stroke-width="3.6"/><circle cx="32" cy="30" r="2.8" fill="url(#o)"/><path d="M21.8 28.5c3.4-1.4 6.8-2 10.2-2s6.8.6 10.2 2M30 32.6 28 40M34 32.6 36 40" stroke="url(#o)" stroke-width="3.2" stroke-linecap="round" fill="none"/></svg>`;

async function icones() {
  const svg = Buffer.from(ESCUDO);
  await sharp(svg, { density: 300 }).resize(32, 32).png().toFile(path.join(SITE, "favicon-32.png"));
  await sharp(svg, { density: 600 }).resize(180, 180).flatten({ background: "#0B0B0C" }).png().toFile(path.join(SITE, "apple-touch-icon.png"));
  console.log("ok favicons");
}

/* Imagem de compartilhamento (WhatsApp, Facebook): 1200x630 */
async function og() {
  const logoBuf = await sharp(path.join(DESTINO, "logo-grajau.png")).resize({ width: 470 }).toBuffer();
  const fundo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE29A"/><stop offset=".55" stop-color="#D9A93A"/><stop offset="1" stop-color="#A8771C"/></linearGradient>
    <radialGradient id="r" cx=".25" cy=".5" r=".6"><stop offset="0" stop-color="#2A2112"/><stop offset="1" stop-color="#0B0B0C"/></radialGradient></defs>
    <rect width="1200" height="630" fill="url(#r)"/>
    <rect x="0" y="600" width="1200" height="30" fill="#141414"/>
    ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 80}" y="610" width="48" height="8" fill="#D9A93A"/>`).join("")}
    <text x="600" y="190" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="40" fill="#D9A93A" letter-spacing="5">INSTRUTOR AUTÔNOMO</text>
    <text x="600" y="270" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="66" fill="#FFFFFF">Aulas de carro e moto</text>
    <text x="600" y="345" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="66" fill="url(#o)">no Grajaú e região</text>
    <text x="600" y="420" font-family="Arial, sans-serif" font-size="30" fill="#D6D2C8">Horário flexível · Aula no local da prova</text>
    <text x="600" y="520" font-family="Arial, sans-serif" font-weight="700" font-size="38" fill="#FFFFFF">WhatsApp (11) 92632-4474</text>
  </svg>`);
  await sharp(fundo).composite([{ input: logoBuf, left: 70, top: 120 }]).png({ compressionLevel: 9 }).toFile(path.join(DESTINO, "og-grajau.png"));
  console.log("ok og");
}

/* Fotos de aprovados: fotos-para-o-site/aprovados/moto e /carro
   -> assets/img/aprovados/ e data/aprovados.js (as mais novas primeiro,
   pela data no nome: 2026-11-03-ana.jpg). Mantém os "alt" já escritos. */
async function aprovados() {
  const raiz = path.resolve(SITE, "..", "fotos-para-o-site", "aprovados");
  const dest = path.join(DESTINO, "aprovados");
  await mkdir(dest, { recursive: true });
  const arqData = path.join(SITE, "data", "aprovados.js");
  const antigos = {};
  try {
    const txt = readFileSync(arqData, "utf8");
    for (const m of txt.matchAll(/\{[^}]*"id":"([^"]+)"[^}]*\}/g)) { const o = JSON.parse(m[0]); if (o.alt) antigos[o.id] = o.alt; }
  } catch { /* primeira vez */ }
  const lista = [];
  for (const [pasta, cat] of [["moto", "A"], ["carro", "B"]]) {
    let arquivos = [];
    try { arquivos = readdirSync(path.join(raiz, pasta)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort().reverse(); } catch { continue; }
    for (const f of arquivos) {
      const id = (cat === "A" ? "a-" : "b-") + f.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").toLowerCase();
      const buf = await sharp(path.join(raiz, pasta, f)).rotate().resize({ width: 600, height: 750, fit: "cover", position: "attention" }).toBuffer();
      await sharp(buf).webp({ quality: 76 }).toFile(path.join(dest, id + ".webp"));
      await sharp(buf).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(dest, id + ".jpg"));
      lista.push({ id, categoria: cat, w: 600, h: 750, ...(antigos[id] ? { alt: antigos[id] } : {}) });
    }
  }
  const cab = readFileSync(arqData, "utf8").split("window.GRAJAU_APROVADOS")[0];
  const corpo = lista.length ? "\n" + lista.map((o) => "  " + JSON.stringify(o)).join(",\n") + "\n" : "";
  writeFileSync(arqData, cab + "window.GRAJAU_APROVADOS = [" + corpo + "];\n");
  console.log("ok aprovados:", lista.length, "fotos");
}

await mkdir(DESTINO, { recursive: true });
await aprovados();
await logo("logo-grajau", [70, 395, 580, 490], 580);
for (const r of RECORTES) await foto(r);
await icones();
await og();
