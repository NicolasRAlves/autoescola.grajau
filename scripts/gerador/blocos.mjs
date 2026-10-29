/* Blocos de conteúdo reaproveitados em várias páginas. */
import { C, WA, esc, brl, item, precoDe, I, placa, foto, wa } from "./base.mjs";

/* ---------- Casos ---------- */
const ICONE_CASO = { chave: I.chave, volante: I.volante, calendario: I.calendario, repetir: I.repetir, escudo: I.escudo, mais: I.mais, carro: I.carro };

export function aPartirDe(caso) {
  const v = caso.sugestoes.map(item).filter((i) => i && typeof i.preco === "number" && (!i.servico || C.servicos[i.servico] === true)).map((i) => i.preco);
  return v.length ? Math.min(...v) : null;
}

export function casosGrade(base) {
  const cards = C.casos.map((c) => {
    return `<a class="caso revelar" href="${base}orcamento/?caso=${c.id}"${c.servico ? ` data-servico="${c.servico}" data-sem-marca` : ""}>
        <span class="caso__icone">${ICONE_CASO[c.icone] || I.mais}</span>
        <h3>${esc(c.titulo)}</h3>
        <p class="caso__sub">${esc(c.subtitulo)}</p>
        <span class="caso__ir">Ver meu orçamento →</span>
      </a>`;
  }).join("\n      ");
  return `<div class="casos">
      ${cards}
      <a class="caso caso--destaque revelar" data-wa="Olá! Vim pelo site da Auto Escola Grajaú. Não sei qual opção é a melhor para mim, pode me ajudar?" href="${WA}">
        <span class="caso__icone">${I.whats}</span>
        <h3>Não sei ainda</h3>
        <p class="caso__sub">Quero conversar antes</p>
        <span class="caso__ir" style="margin-top:auto;padding-top:12px">Chamar no WhatsApp →</span>
      </a>
    </div>`;
}

export function secCasos(base) {
  return `<section class="secao secao--creme" id="casos" aria-labelledby="casos-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Monte do seu jeito</span>
      <h2 class="titulo" id="casos-titulo">Qual é <em>o seu caso?</em></h2>
      <p class="lead">Toque no seu e veja o orçamento em 1 minuto.</p>
    </div>
    ${casosGrade(base)}
  </div>
</section>`;
}

/* ---------- Preços ---------- */
export function precoCard(i, { mini = false } = {}) {
  const msg = `Olá! Vim pelo site da Auto Escola Grajaú e quero saber do ${i.nome}${i.detalhe ? " (" + i.detalhe + ")" : ""}.`;
  const valor = typeof i.preco === "number"
    ? `<p class="preco__valor"><strong data-preco="${i.id}">${brl(i.preco)}</strong>${i.unidade ? `<span>${esc(i.unidade)}</span>` : ""}</p>`
    : `<p class="preco__valor"><strong>Sob consulta</strong></p>`;
  const cortesia = (i.inclui || []).filter((t) => /cortesia/i.test(t));
  const lista = (i.inclui || []).filter((t) => !/cortesia/i.test(t));
  const pendente = i.servico && C.servicos[i.servico] !== true;
  return `<article class="preco${i.destaque ? " preco--destaque" : ""}${mini ? " preco--mini" : ""} revelar"${i.servico ? ` data-servico="${i.servico}" data-sem-marca` : ""}>
        ${i.destaque ? '<span class="preco__fita">Mais pedido</span>' : ""}
        ${i.selo ? `<span class="selo${i.destaque ? " selo--cheio" : ""}">${esc(i.selo)}</span>` : ""}
        <h3>${esc(i.nome)}</h3>
        ${pendente ? '<span class="pendente">[CLIENTE CONFIRMAR se oferece e o preço]</span>' : ""}
        ${i.detalhe ? `<span class="preco__detalhe">${esc(i.detalhe)}</span>` : ""}
        ${valor}
        ${i.resumo ? `<p class="preco__resumo">${esc(i.resumo)}</p>` : ""}
        ${lista.length ? `<ul class="lista-check">${lista.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        ${cortesia.map((t) => `<p class="cortesia">${I.presente}<span>${esc(t)}</span></p>`).join("")}
        ${wa(msg, `btn ${i.destaque ? "btn--ouro" : "btn--contorno"} btn--bloco`, "Quero esse")}
      </article>`;
}

const filtraCat = (cat) => (i) => !cat || i.categorias.includes(cat);
export function gradePrecos(cat) {
  const g = (grupo) => C.planos.itens.filter((i) => i.grupo === grupo).filter(filtraCat(cat));
  const pac = g("pacotes"), rap = g("rapidos"), avu = g("avulsos");
  return `${pac.length ? `<h3 class="precos__grupo">Pacotes · do zero à prova</h3>
    <div class="precos precos--pacotes">
      ${pac.map((i) => precoCard(i)).join("\n      ")}
    </div>` : ""}
    ${rap.length ? `<h3 class="precos__grupo">Já sei dirigir · aulas + veículo da prova</h3>
    <div class="precos precos--rapidos">
      ${rap.map((i) => precoCard(i, { mini: true })).join("\n      ")}
    </div>` : ""}
    ${avu.length ? `<h3 class="precos__grupo">Avulsos · aula, local da prova e aluguel</h3>
    <div class="precos precos--avulsos">
      ${avu.map((i) => precoCard(i, { mini: true })).join("\n      ")}
    </div>` : ""}
    ${cardTaxas()}
    <div class="precos__rodape">
      <p class="fonte" style="margin:0">${esc(C.planos.aviso)} Valores dos cartazes da escola, conferidos em ${esc(C.planos.atualizadoEm)}. As taxas do Detran-SP e o preço dos exames na clínica podem mudar.</p>
    </div>`;
}

/* ---------- Pagos à parte (exames e taxas) ---------- */
export const taxas = () => C.planos.taxasAParte || [];
export const taxasTotal = () => taxas().reduce((s, t) => s + (typeof t.valor === "number" ? t.valor : 0), 0);
export function cardTaxas() {
  if (!taxas().length) return "";
  return `<h3 class="precos__grupo">À parte · exames e taxas</h3>
    <article class="taxas revelar" id="taxas">
      <div class="taxas__texto">
        <span class="selo">Pagos à parte</span>
        <h3>Exames e taxas da CNH</h3>
        <p>Não entram no preço das aulas: são pagos à clínica e ao Detran-SP na primeira habilitação.</p>
      </div>
      <ul class="taxas__lista">
        ${taxas().map((t) => `<li><span>${esc(t.nome)}</span><strong data-taxa="${t.id}">${brl(t.valor)}</strong></li>`).join("\n        ")}
        <li class="taxas__total"><span>Total</span><strong data-taxa="total">${brl(taxasTotal())}</strong></li>
      </ul>
    </article>`;
}

export function secPrecosResumo(base) {
  const card = (id, destaque) => {
    const i = item(id);
    return `<article class="mini-preco${destaque ? " mini-preco--destaque" : ""} revelar">
        <span class="selo${destaque ? " selo--cheio" : ""}">${esc(i.selo)}</span>
        <h3>${esc(i.nome)}</h3>
        <p class="mini-preco__valor" data-preco="${i.id}">${brl(i.preco)}</p>
        ${wa(`Olá! Vim pelo site da Auto Escola Grajaú e quero saber do ${i.nome}.`, `btn ${destaque ? "btn--ouro" : "btn--contorno"} btn--bloco btn--p`, "Quero esse")}
      </article>`;
  };
  return `<section class="secao" id="precos" aria-labelledby="precos-titulo">
  <div class="container">
    <div class="secao__topo secao__topo--linha revelar">
      <div>
        <span class="eyebrow">Preços</span>
        <h2 class="titulo" id="precos-titulo">Preço claro, <em>sem surpresa</em></h2>
      </div>
      <a class="link-seta" href="${base}precos/">Ver todos os preços →</a>
    </div>
    <div class="mini-precos">
      ${card("pacote-20", true)}
      ${card("pacote-10")}
      ${card("duas-aulas-carro")}
    </div>
    ${taxas().length ? `<a class="aviso-taxas revelar" href="${base}precos/#taxas">${I.alerta}<span>Exames e taxas da CNH são pagos à parte: <strong data-taxa="total">${brl(taxasTotal())}</strong> no total.</span><span class="aviso-taxas__ver">Ver valores →</span></a>` : ""}
  </div>
</section>`;
}

export function secPrecos(base, { cat = null, titulo = 'Preço claro, <em>sem surpresa</em>', classe = "secao" } = {}) {
  return `<section class="${classe}" id="precos" aria-labelledby="precos-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Preços</span>
      <h2 class="titulo" id="precos-titulo">${titulo}</h2>
      <p class="lead">Você escolhe: pacote completo, só as aulas que faltam ou só o veículo para a prova. Nos pacotes de 10 e 20 aulas, o aluguel do veículo na 1ª prova sai de cortesia.</p>
    </div>
    ${gradePrecos(cat)}
    <div class="btns" style="margin-top:22px">
      <a class="btn btn--ouro" href="${base}orcamento/${cat ? "?cat=" + cat : ""}">Montar meu orçamento</a>
      ${wa("Olá! Vim pelo site da Auto Escola Grajaú e quero tirar uma dúvida sobre os preços.", "btn btn--contorno", "Tirar dúvida")}
    </div>
  </div>
</section>`;
}

/* ---------- Local da prova ---------- */
export const ROTA_SVG = `<svg viewBox="0 0 420 315" role="img" aria-label="Ilustração: carro fazendo o percurso da prova, passando por conversão, faixa de pedestres e semáforo">
  <rect width="420" height="315" fill="#141416"/>
  <g stroke="#26262B" stroke-width="26" fill="none" stroke-linecap="round"><path d="M-10 250H430M200 -10V330M-10 120H430M360 -10V330M70 -10V330"/></g>
  <g stroke="#3A3A40" stroke-width="2" stroke-dasharray="10 10" fill="none"><path d="M-10 250H430M200 -10V330M-10 120H430M360 -10V330M70 -10V330"/></g>
  <g fill="#E9E4D8"><rect x="176" y="232" width="6" height="36"/><rect x="188" y="232" width="6" height="36"/><rect x="206" y="232" width="6" height="36"/><rect x="218" y="232" width="6" height="36"/></g>
  <path id="rota-prova" d="M30 250 H190 Q200 250 200 240 V130 Q200 120 210 120 H350 Q360 120 360 110 V30" fill="none" stroke="#D9A93A" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 12"/>
  <g font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="700" font-size="15" fill="#F6D98A" letter-spacing="1">
    <circle cx="30" cy="250" r="9" fill="#D9A93A"/><text x="16" y="282">SAÍDA</text>
    <circle cx="200" cy="185" r="7" fill="#141416" stroke="#D9A93A" stroke-width="3"/><text x="212" y="190">CONVERSÃO</text>
    <text x="232" y="230" fill="#E9E4D8">FAIXA</text>
    <circle cx="360" cy="30" r="9" fill="#D9A93A"/><text x="300" y="22">CHEGADA</text>
  </g>
  <g transform="translate(372 150)"><rect x="-7" y="-20" width="14" height="40" rx="4" fill="#0B0B0C" stroke="#555" stroke-width="2"/><circle cy="-10" r="4" fill="#D7262E"/><circle cy="0" r="4" fill="#5a4a10"/><circle cy="10" r="4" fill="#1d4d26"/></g>
  <g>
    <g transform="translate(-9 -15)"><rect width="18" height="30" rx="5" fill="#F6D98A"/><rect x="3" y="6" width="12" height="6" rx="2" fill="#141416"/><rect x="3" y="19" width="12" height="5" rx="2" fill="#141416"/></g>
    <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;.85;1" calcMode="linear"><mpath href="#rota-prova"/></animateMotion>
  </g>
</svg>`;

export function secLocalProva(base) {
  return `<section class="secao secao--grafite" id="local-da-prova" aria-labelledby="local-prova-titulo">
  <div class="container duas-col">
    <div class="revelar">
      <span class="eyebrow">O diferencial</span>
      <h2 class="titulo" id="local-prova-titulo">Aula <em>no local da prova</em></h2>
      <p class="lead">Treine nas mesmas ruas onde o examinador vai te avaliar.</p>
      <ul class="lista-check">
        <li>Conhece o percurso antes do dia</li>
        <li>Chega no exame sem nervoso</li>
        <li>Prova com o veículo da escola</li>
      </ul>
      <div class="btns">
        ${wa("Olá! Vim pelo site da Auto Escola Grajaú e quero uma aula no local da prova.", "btn btn--ouro", "Quero aula no local")}
        <a class="btn btn--contorno" href="${base}aula-no-local-da-prova/">Como funciona</a>
      </div>
    </div>
    <div class="revelar">${youtubeDestaque()}</div>
  </div>
</section>`;
}

/* ---------- Vídeos ---------- */
export function reel(base, v) {
  return `<figure class="reel">
        <div class="reel-tela">
          <video preload="none" playsinline poster="${base}assets/video/${esc(v.poster)}" src="${base}assets/video/${esc(v.arquivo)}" aria-label="${esc(v.titulo)}"></video>
          <button class="reel__play" type="button" aria-label="Assistir: ${esc(v.titulo)}"><span>${I.play}</span></button>
        </div>
        <figcaption><span class="tag tag--ouro">${v.categoria === "A" ? "Moto" : "Carro"}</span> ${esc(v.titulo)}</figcaption>
      </figure>`;
}
export function reels(base, cat) {
  const lista = C.videos.filter((v) => !cat || v.categoria === cat);
  return `<div class="reels">
      ${lista.map((v) => reel(base, v)).join("\n      ")}
    </div>`;
}
export function botoesRedes() {
  return `<a class="btn btn--contorno" data-instagram href="${C.instagram.url}">${I.insta} @${esc(C.instagram.usuario)}</a>
      <a class="btn btn--contorno" data-youtube href="${C.youtube.url}">${I.youtube} Canal no YouTube</a>`;
}
export function secVideos(base, { cat = null, titulo = 'Veja como são <em>as aulas</em>' } = {}) {
  return `<section class="secao" id="videos" aria-labelledby="videos-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Em vídeo</span>
      <h2 class="titulo" id="videos-titulo">${titulo}</h2>
      <p class="lead">Aula de verdade, aqui na região. Toque para assistir.</p>
    </div>
    ${reels(base, cat)}
    <div class="btns" style="margin-top:20px">
      ${botoesRedes()}
      <a class="btn btn--contorno" href="${base}videos/">Mais vídeos</a>
    </div>
  </div>
</section>`;
}

export function youtubeDestaque() {
  const id = C.youtube.videoDestaque;
  return `<div class="yt" data-yt="${esc(id)}" data-yt-titulo="${esc(C.youtube.tituloDestaque)}">
      <button class="yt__capa" type="button" aria-label="Assistir no site: ${esc(C.youtube.tituloDestaque)}">
        <img src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" width="480" height="360" alt="" loading="lazy" decoding="async">
        <span>${I.youtube} Assistir</span>
      </button>
      <p class="yt__aviso">O vídeo do YouTube só carrega quando você toca.</p>
    </div>`;
}

/* ---------- Estrada (passo a passo) ---------- */
export function secEstrada(base) {
  return `<section class="secao secao--grafite" id="como-tirar" aria-labelledby="estrada-titulo">
  <div class="container container--estreito">
    <div class="secao__topo revelar">
      <span class="eyebrow">Passo a passo</span>
      <h2 class="titulo" id="estrada-titulo">Do zero à CNH <em>em 6 paradas</em></h2>
      <p class="lead">Como funciona a primeira habilitação em SP depois da Nova CNH, e onde a Grajaú entra. Role a página e acompanhe a estrada.</p>
    </div>
    <div class="estrada" data-estrada>
      <div class="estrada__pista" aria-hidden="true">
        <div class="veiculo veiculo--carro"><svg viewBox="0 0 40 72" aria-hidden="true"><rect x="3" y="2" width="34" height="68" rx="11" fill="#E2B24C"/><rect x="7" y="17" width="26" height="13" rx="3" fill="#141416"/><rect x="7.5" y="47" width="25" height="9" rx="3" fill="#141416"/><rect x="8" y="32" width="24" height="13" rx="2" fill="#F6D98A"/><rect x="6" y="64" width="7" height="3" rx="1.5" fill="#FFF3C4"/><rect x="27" y="64" width="7" height="3" rx="1.5" fill="#FFF3C4"/></svg></div>
        <div class="veiculo veiculo--moto"><svg viewBox="0 0 22 60" aria-hidden="true"><rect x="8" y="1" width="6" height="12" rx="3" fill="#111"/><rect x="8" y="47" width="6" height="12" rx="3" fill="#111"/><rect x="5" y="12" width="12" height="36" rx="6" fill="#F4F0E8"/><rect x="1" y="38" width="20" height="3" rx="1.5" fill="#444"/><circle cx="11" cy="24" r="5" fill="#141416"/><rect x="9" y="56" width="4" height="3" rx="1" fill="#FFF3C4"/></svg></div>
      </div>
      <ol class="estrada__etapas">
        <li class="etapa"><span class="etapa__num">1</span><h3>Exames médico e psicotécnico</h3><p>Primeiro passo, presencial, numa clínica credenciada. Na primeira habilitação também entra o exame toxicológico.</p><div class="etapa__tags"><span class="tag">Presencial</span></div></li>
        <li class="etapa"><span class="etapa__num">2</span><h3>Curso teórico no app</h3><p>Baixe o app <strong>CNH do Brasil</strong> e faça o curso teórico, on-line e gratuito, no seu ritmo.</p><div class="etapa__tags"><span class="tag">On-line e gratuito</span></div></li>
        <li class="etapa"><span class="etapa__num">3</span><h3>Prova teórica</h3><p>Aplicada pelo Detran-SP. Passou? Agora é a parte prática.</p><div class="etapa__tags"><span class="tag tag--detran">Detran-SP</span></div></li>
        <li class="etapa"><span class="etapa__num">4</span><h3>Aulas práticas com a Grajaú</h3><p>A lei pede no mínimo 2 horas de aula. Você escolhe: 2 aulas, 4, 10, 20 ou avulsas, no horário que encaixa na sua rotina.</p><div class="etapa__tags"><span class="tag tag--ouro">Com a Grajaú</span><span class="tag tag--ouro">Horário flexível</span></div></li>
        <li class="etapa"><span class="etapa__num">5</span><h3>Aula no local + prova prática</h3><p>Treine no local do exame e faça a prova com o carro ou a moto da escola. Cada erro soma pontos: até 10, aprovado.</p><div class="etapa__tags"><span class="tag tag--ouro">Aula no local da prova</span><span class="tag tag--ouro">Veículo da escola</span><span class="tag tag--detran">Detran-SP</span></div></li>
        <li class="etapa etapa--final"><span class="etapa__num">6</span><h3>Aprovado!</h3><p>Paga a taxa de emissão e a CNH aparece no app. Mais que habilitação: é liberdade.</p>${placa("APROVADO")}</li>
      </ol>
    </div>
    <p class="fonte">Regras: Agência Brasil (01/12/2025), Detran-SP (jan/2026), Autoo (16/03/2026). Conferido em ${esc(C.regrasAtualizadasEm)}. <a href="${base}instrutor-autonomo/">Entenda a Nova CNH</a>.</p>
  </div>
</section>`;
}

/* ---------- Gerador de placa ---------- */
export function secGerador(base) {
  return `<section class="secao secao--creme" id="sua-placa" aria-labelledby="placa-titulo">
  <div class="container">
    <form class="gerador" data-gerador novalidate>
      <div class="revelar">
        <span class="eyebrow">Monte sua placa</span>
        <h2 class="titulo" id="placa-titulo">Já imaginou <em>a sua?</em></h2>
        <p class="lead">Digite seu primeiro nome e veja sua placa de APROVADO. Baixe a imagem, poste nos stories e marque a @${esc(C.instagram.usuario)}.</p>
        <div class="campo">
          <label for="nome-placa">Seu primeiro nome</label>
          <input class="input-placa" type="text" id="nome-placa" name="nome" maxlength="14" autocomplete="given-name" placeholder="SEU NOME" aria-describedby="nome-placa-ajuda nome-placa-erro" spellcheck="false">
          <span class="campo__ajuda" id="nome-placa-ajuda">Até 14 letras. Pode usar acento.</span>
          <span class="campo__erro" id="nome-placa-erro" data-gerador-erro role="alert"></span>
        </div>
        <fieldset class="campo">
          <legend>Na placa vai escrito</legend>
          <div class="opcoes">
            <label class="opcao"><input type="radio" name="genero" value="APROVADO" checked><span>APROVADO</span></label>
            <label class="opcao"><input type="radio" name="genero" value="APROVADA"><span>APROVADA</span></label>
          </div>
        </fieldset>
        <div class="btns">
          <button class="btn btn--preto" type="button" data-baixar disabled>Baixar imagem</button>
          <button class="btn btn--contorno" type="button" data-compartilhar disabled>Compartilhar</button>
          <a class="btn btn--ouro" data-gerador-whats data-wa="Olá! Fiz minha placa de APROVADO no site e quero começar minhas aulas." href="${WA}">Quero a minha de verdade</a>
        </div>
        <p class="nota" style="margin-top:14px">A imagem é feita no seu celular e não vai para lugar nenhum. A placa é uma arte, não um documento.</p>
      </div>
      <div class="gerador__preview revelar">
        <canvas width="1080" height="1350" role="img" aria-label="Prévia da sua placa de APROVADO"></canvas>
      </div>
    </form>
  </div>
</section>`;
}

/* ---------- Orçamento rápido ---------- */
export function secOrcRapido(base) {
  const casos = C.casos.map((c, k) => `<label class="opcao"${c.servico ? ` data-servico="${c.servico}" data-sem-marca` : ""}><input type="radio" name="r-caso" value="${c.id}" data-rotulo="${esc(c.titulo + " (" + c.subtitulo.charAt(0).toLowerCase() + c.subtitulo.slice(1) + ")")}"${k === 0 ? " checked" : ""}><span>${esc(c.titulo)}</span></label>`).join("");
  return `<section class="secao secao--ouro" id="orcamento-rapido" aria-labelledby="orc-titulo">
  <div class="container orc">
    <div class="revelar">
      <span class="eyebrow">Orçamento rápido</span>
      <h2 class="titulo" id="orc-titulo">2 toques e <em>pronto</em></h2>
      <p class="lead">Escolha o caso e a categoria. O WhatsApp abre com a mensagem escrita.</p>
    </div>
    <form class="orc__form claro revelar" data-orc-rapido>
      <fieldset class="campo"><legend>Qual é o seu caso?</legend><div class="opcoes">${casos}</div></fieldset>
      <fieldset class="campo"><legend>Categoria</legend><div class="opcoes">
        <label class="opcao"><input type="radio" name="r-cat" value="B" checked><span>Carro · B</span></label>
        <label class="opcao"><input type="radio" name="r-cat" value="A"><span>Moto · A</span></label>
        <label class="opcao"><input type="radio" name="r-cat" value="AB"><span>Os dois · A + B</span></label>
      </div></fieldset>
      <div class="orc__previa" aria-live="polite"><strong>Sua mensagem</strong><span data-orc-previa></span></div>
      <a class="btn btn--whats btn--bloco" data-orc-enviar href="${WA}" target="_blank" rel="noopener">${I.whats} Enviar no WhatsApp</a>
      <p style="margin:12px 0 0;text-align:center"><a data-orc-mais data-base-href="${base}orcamento/" href="${base}orcamento/">Ver o valor no orçamento completo →</a></p>
    </form>
  </div>
</section>`;
}

/* ---------- FAQ ---------- */
const F = (q, a, fonte) => ({ q, a, fonte });
const FONTE_AB = "Fonte: Agência Brasil, 01/12/2025.";
export const FAQ = {
  geral: [
    F("Quanto custa uma aula?", `A aula avulsa custa ${precoDe("avulsa")}, de carro ou de moto. O pacote de 10 aulas sai ${precoDe("pacote-10")} e o de 20 aulas, ${precoDe("pacote-20")}, que pode ser dividido em 10 de carro e 10 de moto.`),
    F("O que é o aluguel do veículo?", `É o carro ou a moto da escola no dia da prova prática. Só o aluguel do carro ou da moto custa ${precoDe("aluguel")}. Nos pacotes de 10 e 20 aulas, o aluguel na 1ª prova de cada categoria é cortesia.`),
    F("Já sei dirigir. Preciso fazer muitas aulas?", `Não. A lei exige no mínimo 2 horas de aula prática. Para quem já dirige, tem 2 aulas + aluguel do veículo por ${precoDe("duas-aulas-carro")} ou 4 aulas + aluguel por ${precoDe("quatro-aulas")}.`),
    F("Posso tirar carro e moto juntos?", `Pode. O pacote de 20 aulas (${precoDe("pacote-20")}) pode ser dividido em 10 aulas de carro e 10 de moto, com o aluguel do veículo na 1ª prova de cada categoria de cortesia.`),
    F("Vocês dão aula para quem já tem CNH?", "Sim. Tem aula para habilitados que perderam a prática ou têm medo de dirigir, e também para quem quer adicionar a categoria A ou B."),
    F("Quais são os horários?", "Os horários e os dias são flexíveis: você combina com o instrutor pelo WhatsApp o que encaixa na sua rotina."),
    F("Quanto custam os exames e as taxas da CNH?", `São pagos à parte, fora das aulas: ${(C.planos.taxasAParte || []).map((t) => t.nome.toLowerCase() + " " + brl(t.valor)).join(", ")}. Total: ${brl((C.planos.taxasAParte || []).reduce((s, t) => s + t.valor, 0))}. As taxas do Detran-SP podem mudar.`),
    F("Vocês atendem quais bairros?","O Grajaú e a região, na Zona Sul de São Paulo. O ponto de referência é a Av. Dona Belmira Marin, 4772.")
  ],
  cnh: [
    F("Ainda preciso de autoescola para tirar a CNH?", "Não é mais obrigatório. Em 1º de dezembro de 2025, o Contran aprovou a resolução (citada como Resolução Contran nº 1.020/2025) que acabou com a obrigatoriedade da autoescola para a primeira habilitação. Você pode fazer o curso teórico on-line e gratuito e as aulas práticas com uma autoescola ou com um instrutor autônomo credenciado pelo Detran. As provas teórica e prática continuam obrigatórias.", FONTE_AB),
    F("Quantas aulas práticas são obrigatórias?", "O mínimo caiu de 20 horas para 2 horas de aula prática. É o mínimo da lei, não uma recomendação: quem nunca dirigiu costuma precisar de mais tempo para chegar seguro à prova.", FONTE_AB),
    F("O curso teórico é gratuito?", "Existe uma opção digital e gratuita, oferecida pelo Ministério dos Transportes no aplicativo CNH do Brasil (a antiga Carteira Digital de Trânsito). Quem preferir ainda pode estudar presencialmente em autoescolas ou instituições credenciadas.", FONTE_AB),
    F("Ainda tem baliza na prova em São Paulo?", "Não. O Detran-SP retirou a baliza do exame prático de carro, com as novas regras valendo a partir de 26 de janeiro de 2026. A prova passou a avaliar a condução no percurso. Confirme a regra atual no Detran-SP antes da sua prova.", "Fonte: Detran-SP, jan/2026."),
    F("Quantos pontos reprovam na prova prática?", "Na regra nova, não existe mais falta que elimina na hora. Cada erro soma pontos conforme a gravidade (leve 1, média 2, grave 4, gravíssima 6) e o candidato é aprovado se terminar com até 10 pontos. Acima disso, reprova. Confirme os critérios no Detran-SP.", "Fonte: Autoo, 16/03/2026; Portal do Trânsito, 18/03/2026.")
  ],
  localProva: [
    F("Quanto custa a aula no local da prova?", `${precoDe("aula-local-prova")} a aula, de carro.`),
    F("Posso alugar só o veículo para a prova?", `Pode. Somente o aluguel do carro ou da moto para o dia da prova custa ${precoDe("aluguel")}.`),
    F("Tem aula no local da prova para moto?", `Não. A prova prática de moto é feita em área fechada, então o treino de moto acontece nas aulas normais. O aluguel da moto para o dia da prova custa ${precoDe("aluguel")}.`),
    F("Os pacotes incluem o veículo da prova?", "Nos pacotes de 10 e 20 aulas, o aluguel do veículo na 1ª prova de cada categoria é cortesia. Nos de 2 e 4 aulas, o veículo da prova já está no preço.")
  ]
};

export function faqHtml(lista, { escola = "", aberta = false } = {}) {
  const C2 = lista.map((f, k) => `<details${aberta && k === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><div class="faq__resp"><p>${esc(f.a)}</p>${f.fonte ? `<span class="fonte">${esc(f.fonte)} Conferido em ${esc(C.regrasAtualizadasEm)}.</span>` : ""}</div></details>`).join("\n      ");
  return `<div class="faq"${escola ? ` data-faq-escola="${escola}"` : ""}>
      ${C2}
    </div>`;
}
export const faqLd = (lista) => lista.map((f) => [f.q, f.a]);

export function secFaq(lista, { escola = "geral", titulo = 'Dúvidas de <em>quem vai começar</em>', classe = "secao secao--creme" } = {}) {
  return `<section class="${classe}" id="faq" aria-labelledby="faq-titulo">
  <div class="container container--estreito">
    <div class="secao__topo revelar centro">
      <span class="eyebrow">Perguntas frequentes</span>
      <h2 class="titulo" id="faq-titulo">${titulo}</h2>
    </div>
    ${faqHtml(lista, { escola })}
  </div>
</section>`;
}

/* ---------- Onde estamos ---------- */
export function secOnde(base) {
  return `<section class="secao secao--grafite" id="onde-estamos" aria-labelledby="local-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Onde estamos</span>
      <h2 class="titulo" id="local-titulo">No Grajaú, <em>perto de você</em></h2>
    </div>
    <div class="local">
      <div class="local__info revelar">
        <dl>
          <div><dt>Endereço</dt><dd data-endereco>${esc(C.endereco.rua)}<br>${esc(C.endereco.bairro)}, São Paulo - SP</dd></div>
          <div><dt>Atendimento</dt><dd>Grajaú e região<div data-regioes></div></dd></div>
          <div><dt>Horário</dt><dd data-horarios>Horários e dias flexíveis: combine pelo WhatsApp.</dd></div>
          <div><dt>WhatsApp</dt><dd><a data-wa href="${WA}"><span data-whats-rotulo>${esc(C.whatsapp.rotulo)}</span></a></dd></div>
        </dl>
        <div class="btns">
          <a class="btn btn--ouro btn--p" data-maps href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(C.endereco.busca)}">${I.pin} Google Maps</a>
          <a class="btn btn--contorno btn--p" data-waze href="https://waze.com/ul?q=${encodeURIComponent(C.endereco.busca)}&amp;navigate=yes">Abrir no Waze</a>
        </div>
      </div>
      <div class="mapa revelar" data-mapa>
        <div class="mapa__capa">
          <div>
            <div class="pino">${I.pin}</div>
            <p style="margin-bottom:14px">O mapa só carrega se você pedir, para a página abrir mais rápido.</p>
            <button class="btn btn--ouro" type="button">Ver no mapa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function cta(base, { titulo = "Seu sonho de dirigir começa aqui.", texto = "Conta o seu caso e o instrutor responde pelo WhatsApp.", caso = "", msg = "" } = {}) {
  return `<section class="cta-faixa">
  <div class="container">
    <div>
      <h2>${esc(titulo)}</h2>
      <p>${esc(texto)}</p>
    </div>
    <div class="btns">
      <a class="btn btn--preto" href="${base}orcamento/${caso ? "?caso=" + caso : ""}">Montar meu orçamento</a>
      ${wa(msg, "btn btn--contorno", "WhatsApp")}
    </div>
  </div>
</section>`;
}

/* mural de aprovados (some se não houver fotos e o site estiver publicado) */
export function muralBloco(cat) {
  return `<div data-mural-bloco style="margin-top:40px">
      <h3 class="precos__grupo">Aprovados${cat ? (cat === "A" ? " na moto" : " no carro") : ""}</h3>
      <div class="trilho" role="region" data-mural${cat ? ` data-cat="${cat}"` : ""} tabindex="0" aria-label="Fotos de alunos aprovados"></div>
      <p class="nota" data-mural-vazio data-pendente><span class="pendente">[FOTOS: salve as fotos dos aprovados em fotos-para-o-site/aprovados/moto e /carro e rode npm run imagens. Nunca publique aluno sem autorização.]</span></p>
    </div>`;
}
