/* Base do gerador: lê o config, helpers, ícones e o layout comum
   (cabeçalho, menu, rodapé, barra do celular). */
import { readFileSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
export const SITE = path.resolve(aqui, "..", "..");

/* o mesmo config.js do navegador */
const ctx = { window: {} };
vm.runInNewContext(readFileSync(path.join(SITE, "data", "config.js"), "utf8"), ctx);
export const C = ctx.window.GRAJAU;
export const URL_SITE = C.siteUrl.replace(/\/$/, "");
export const WA = "https://wa.me/" + C.whatsapp.numero;

export function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export function brl(v) {
  if (typeof v !== "number") return "Sob consulta";
  const inteiro = Math.round(v * 100) % 100 === 0;
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: inteiro ? 0 : 2, maximumFractionDigits: 2 });
}
export const item = (id) => C.planos.itens.find((i) => i.id === id);
export const precoDe = (id) => brl(item(id).preco);

/* ---------- Ícones (SVG inline) ---------- */
const s = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
export const I = {
  whats: `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 3C8.86 3 3.03 8.82 3.03 15.99c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75a13 13 0 0 0 6.36 1.62h.01c7.17 0 13-5.83 13-13S23.21 3 16.04 3zm0 23.68h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.76 10.76 0 0 1-1.65-5.73c0-5.96 4.85-10.8 10.82-10.8 2.89 0 5.6 1.13 7.64 3.17a10.73 10.73 0 0 1 3.16 7.64c0 5.96-4.85 10.8-10.8 10.8zm5.93-8.09c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.36c.16.22 2.3 3.5 5.56 4.91.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.62-.38z"/></svg>`,
  tel: s('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  pin: s('<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>'),
  insta: s('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>'),
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15.1V8.9l5.8 3.1-5.8 3.1z"/></svg>`,
  threads: s('<path d="M16.8 11.2c-.6-2.6-2.5-3.8-4.8-3.8-2.9 0-4.6 2-4.6 4.6s1.7 4.7 4.6 4.7c2.4 0 4-1.3 4-3.2 0-1.6-1.3-2.6-3.3-2.6-1.6 0-2.7.8-2.7 1.9 0 1 .9 1.6 2 1.6"/><path d="M12 21c5 0 8.5-3.5 8.5-9S17 3 12 3 3.5 6.5 3.5 12 7 21 12 21z"/>'),
  chave: s('<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2M17 6l3 3M14.5 8.5l2 2"/>'),
  volante: s('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.2"/><path d="M3.5 10.5c3 .8 5.6.9 8.5.9s5.5-.1 8.5-.9M10.3 13.8 8 20.3M13.7 13.8l2.3 6.5"/>'),
  calendario: s('<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M8 14l2.5 2.5L16 12"/>'),
  repetir: s('<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>'),
  escudo: s('<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
  mais: s('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  carro: s('<path d="M3 16.5V12l2.2-5.2A2 2 0 0 1 7 5.5h10a2 2 0 0 1 1.8 1.3L21 12v4.5"/><path d="M3 12h18M3 16.5h18v2H3z"/><circle cx="7" cy="16.5" r="1.6"/><circle cx="17" cy="16.5" r="1.6"/>'),
  moto: s('<circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M5.5 16.5 9 10h5l4.5 6.5M9 10 7.5 7H5.5M14 10l-1-3h2.5"/>'),
  relogio: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  sorriso: s('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>'),
  trofeu: s('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
  presente: s('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.2C6 4.8 7 8 12 8zM12 8s1.5-4.5 4-3.8C18 4.8 17 8 12 8z"/>'),
  rota: s('<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/>'),
  coracao: s('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>'),
  alerta: s('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>', ' stroke-width="2"'),
  play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>`,
  olho: s('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  cafe: s('<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5c-.6.8-.6 1.7 0 2.5M12 2.5c-.6.8-.6 1.7 0 2.5"/>')
};

/* escudo com volante (logo pequeno do topo) */
export const ESCUDO = `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE29A"/><stop offset=".5" stop-color="#D9A93A"/><stop offset="1" stop-color="#9C6B17"/></linearGradient></defs><path d="M32 5 52 11.5v18C52 43 43 52.5 32 58 21 52.5 12 43 12 29.5v-18z" fill="#141416" stroke="url(#og)" stroke-width="3.5" stroke-linejoin="round"/><circle cx="32" cy="29" r="11" fill="none" stroke="url(#og)" stroke-width="3.4"/><circle cx="32" cy="29" r="2.9" fill="url(#og)"/><path d="M21.6 27.4c3.5-1.4 6.9-2 10.4-2s6.9.6 10.4 2M30 31.8 28 39.8M34 31.8 36 39.8" stroke="url(#og)" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`;

export const BANDEIRA = `<svg class="placa__bandeira" viewBox="0 0 30 21" aria-hidden="true"><rect width="30" height="21" fill="#1C9A4B"/><path d="M15 2.5 27 10.5 15 18.5 3 10.5z" fill="#FFD200"/><circle cx="15" cy="10.5" r="4.6" fill="#123E8C"/></svg>`;
export const placa = (txt, cls = "") => `<div class="placa ${cls}" aria-hidden="true"><span class="placa__faixa"><span class="placa__br">BR</span>BRASIL${BANDEIRA}</span><span class="placa__corpo"><span class="placa__texto">${esc(txt)}</span></span></div>`;

/* imagem responsiva gerada pelo preparar-imagens.mjs */
const DIM = {
  "moto-frente": [720, 720], "moto-lado": [720, 600], "moto-instrutor": [720, 900], "carro-aula": [480, 600],
  "mascote": [900, 645], "gibi": [738, 900], "logo-grajau": [580, 490]
};
export function foto(base, nome, alt, { eager = false, png = false, sizes = "(min-width: 900px) 45vw, 100vw" } = {}) {
  const [w, h] = DIM[nome];
  const dir = base + "assets/img/";
  return `<picture><source srcset="${dir}${nome}.webp" type="image/webp"><img src="${dir}${nome}.${png ? "png" : "jpg"}" width="${w}" height="${h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async" sizes="${sizes}"></picture>`;
}

export const wa = (msg, cls = "btn btn--whats", rotulo = "Chamar no WhatsApp") =>
  `<a class="${cls}" data-wa="${esc(msg || "")}" href="${WA}">${I.whats} ${rotulo}</a>`;

/* ---------- Layout ---------- */
const NAV = [
  ["precos", "Preços", "#precos"],
  ["local-prova", "Local da prova", "aula-no-local-da-prova/"],
  ["b", "Carro", "categoria-b/"],
  ["a", "Moto", "categoria-a/"],
  ["habilitados", "Habilitados", "habilitados/"],
  ["videos", "Vídeos", "videos/"]
];
const MENU = [
  ["orcamento", "Montar meu orçamento", "orcamento/", "1 minuto"],
  ["precos", "Preços", "#precos", ""],
  ["local-prova", "Aula no local da prova", "aula-no-local-da-prova/", ""],
  ["b", "Categoria B · Carro", "categoria-b/", ""],
  ["a", "Categoria A · Moto", "categoria-a/", ""],
  ["habilitados", "Habilitados e adição", "habilitados/", ""],
  ["autonomo", "Instrutor autônomo", "instrutor-autonomo/", "Nova CNH"],
  ["videos", "Vídeos", "videos/", ""],
  ["onde", "Onde estamos", "#onde-estamos", ""]
];
function href(base, alvo) { return alvo.startsWith("#") ? base + alvo : base + alvo; }

export function cabecalho(base, atual) {
  const nav = NAV.map(([id, r, a]) => `<li><a href="${href(base, a)}"${id === atual ? ' aria-current="page"' : ""}>${r}</a></li>`).join("");
  const menu = MENU.map(([id, r, a, sub]) => `<li><a href="${href(base, a)}"${id === atual ? ' aria-current="page"' : ""}>${r}${sub ? `<small>${sub}</small>` : ""}</a></li>`).join("");
  return `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<div class="faixa-rascunho" role="note">Prévia para aprovação: os itens marcados em amarelo aguardam informações da Auto Escola Grajaú.</div>
<header class="topo">
  <div class="container topo__linha">
    <a class="logo" href="${base}" aria-label="Auto Escola Grajaú, página inicial">${ESCUDO}<span class="logo__texto"><span class="logo__nome">GRAJAÚ</span><span class="logo__sub">Instrutor autônomo · A e B</span></span></a>
    <nav class="nav" aria-label="Principal"><ul>${nav}</ul></nav>
    <a class="btn btn--ouro btn--p topo__cta" href="${base}orcamento/">Montar orçamento</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-mobile"><span class="menu-btn__icone" aria-hidden="true"><span></span><span></span><span></span></span><span class="menu-btn__rotulo">Menu</span></button>
  </div>
</header>
<nav class="menu-mobile" id="menu-mobile" aria-label="Menu" hidden>
  <ul>${menu}</ul>
  ${wa("", "btn btn--whats", "Chamar no WhatsApp")}
  <a class="btn btn--contorno" data-tel="0" data-tel-fixo href="tel:${C.telefones[0].numero}">${I.tel} Ligar ${esc(C.telefones[0].rotulo)}</a>
</nav>`;
}

export function rodape(base) {
  return `<footer class="rodape">
  <div class="container">
    <div class="rodape__grade">
      <div>
        <img class="rodape__logo" src="${base}assets/img/logo-grajau.png" width="580" height="490" alt="Auto Escola Grajaú" loading="lazy" decoding="async">
        <p>Aulas práticas de carro e moto com instrutor autônomo no Grajaú e região, Zona Sul de São Paulo.</p>
        <p data-endereco>${esc(C.endereco.rua)}<br>${esc(C.endereco.bairro)}, ${esc(C.endereco.cidade)} - ${esc(C.endereco.uf)}</p>
        <p class="nota" data-cnpj></p>
      </div>
      <div>
        <h2>Contato</h2>
        <ul>
          <li><a data-wa href="${WA}">WhatsApp <span data-whats-rotulo>${esc(C.whatsapp.rotulo)}</span></a></li>
          <li><a data-tel="0" href="tel:${C.telefones[0].numero}">${esc(C.telefones[0].rotulo)}</a></li>
          <li><a data-maps href="#">Como chegar (Google Maps)</a></li>
        </ul>
        <div class="redes">
          <a data-instagram href="${C.instagram.url}" aria-label="Instagram @${C.instagram.usuario}">${I.insta}</a>
          <a data-youtube href="${C.youtube.url}" aria-label="Canal no YouTube">${I.youtube}</a>
          <a href="${C.threads.url}" target="_blank" rel="noopener" aria-label="Threads @${C.instagram.usuario}">${I.threads}</a>
        </div>
      </div>
      <div>
        <h2>Páginas</h2>
        <ul>
          <li><a href="${base}orcamento/">Montar meu orçamento</a></li>
          <li><a href="${base}aula-no-local-da-prova/">Aula no local da prova</a></li>
          <li><a href="${base}categoria-b/">Categoria B · Carro</a></li>
          <li><a href="${base}categoria-a/">Categoria A · Moto</a></li>
          <li><a href="${base}habilitados/">Habilitados e adição de categoria</a></li>
          <li><a href="${base}instrutor-autonomo/">Instrutor autônomo e Nova CNH</a></li>
          <li><a href="${base}videos/">Vídeos das aulas</a></li>
        </ul>
      </div>
    </div>
    <div class="rodape__base">
      <span>© <span data-ano>2026</span> Auto Escola Grajaú · Instrutor Autônomo Grajaú.</span>
      <span>Regras de trânsito conferidas em <span data-regras-data>${esc(C.regrasAtualizadasEm)}</span>. Confirme sempre no Detran-SP.</span>
    </div>
  </div>
  <a class="whats-flutuante" data-wa href="${WA}" aria-label="Conversar com a Auto Escola Grajaú no WhatsApp">${I.whats}</a>
</footer>
<nav class="barra-mobile" aria-label="Contato rápido">
  <a class="btn btn--contorno" href="${base}orcamento/">Orçamento</a>
  ${wa("", "btn btn--whats", "WhatsApp")}
</nav>`;
}

/* JSON-LD da escola (vai em todas as páginas) */
export function ldEscola() {
  return {
    "@context": "https://schema.org", "@type": "DrivingSchool",
    name: C.nome, alternateName: C.marca,
    description: "Aulas práticas de carro (categoria B) e moto (categoria A) com instrutor autônomo no Grajaú e região, Zona Sul de São Paulo. Aula no local da prova, aluguel do veículo para o exame e aulas para habilitados.",
    url: URL_SITE + "/", image: URL_SITE + "/assets/img/og-grajau.png", logo: URL_SITE + "/assets/img/logo-grajau.png",
    telephone: "+55 11 92632-4474",
    address: { "@type": "PostalAddress", streetAddress: C.endereco.rua, addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR", ...(C.endereco.cep ? { postalCode: C.endereco.cep } : {}) },
    areaServed: [{ "@type": "Place", name: "Grajaú, São Paulo" }, { "@type": "Place", name: "Zona Sul de São Paulo" }],
    sameAs: [C.instagram.url, C.youtube.url, C.threads.url],
    priceRange: "R$ 100 a R$ 1.600",
    makesOffer: C.planos.itens.filter((i) => typeof i.preco === "number").map((i) => ({ "@type": "Offer", name: i.nome + (i.detalhe ? " (" + i.detalhe + ")" : ""), price: i.preco.toFixed(2), priceCurrency: "BRL" }))
  };
}

export function pagina({ base, url, titulo, descricao, atual = "", corpo, scripts = [], ld = [], classe = "", ogImagem = "assets/img/og-grajau.png" }) {
  const canon = URL_SITE + "/" + url;
  const js = ["data/config.js", ...(scripts.includes("mural") ? ["data/aprovados.js"] : []), "assets/js/main.js", ...scripts.filter((s) => s !== "mural").map((s) => `assets/js/${s}.js`)];
  const lds = [ldEscola(), ...ld].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${canon}">
<meta name="theme-color" content="#0B0B0C">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(C.nome)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${URL_SITE}/${ogImagem}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Logo dourado da Auto Escola Grajaú com o texto: aulas de carro e moto no Grajaú e região">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${base}favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
<link rel="preload" href="${base}assets/fonts/barlow-condensed-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/fonts/cinzel-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${base}assets/fonts/fonts.css">
<link rel="stylesheet" href="${base}assets/css/style.css">
${js.map((s) => `<script src="${base}${s}" defer></script>`).join("\n")}
${lds}
</head>
<body data-base="${base}"${classe ? ` class="${classe}"` : ""}>
${cabecalho(base, atual)}
<main id="conteudo">
${corpo.trim()}
</main>
${rodape(base)}
</body>
</html>
`;
}

export function ldFaq(lista) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: lista.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
}
export function ldMigalhas(itens) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Início", ""], ...itens].map(([n, u], k) => ({ "@type": "ListItem", position: k + 1, name: n, item: URL_SITE + "/" + u })) };
}
