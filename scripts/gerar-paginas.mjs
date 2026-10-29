/* Gera todas as páginas do site a partir de data/config.js.
   Uso: cd site/scripts && npm run gerar
   O HTML gerado é estático: pode ser publicado direto. */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { C, SITE, URL_SITE, WA, esc, brl, item, precoDe, I, placa, foto, wa, pagina, ldFaq, ldMigalhas } from "./gerador/base.mjs";
import {
  secCasos, secPrecos, gradePrecos, precoCard, secLocalProva, ROTA_SVG, secVideos, reels, reel, botoesRedes, youtubeDestaque,
  secEstrada, secGerador, secOrcRapido, FAQ, faqHtml, faqLd, secFaq, secOnde, cta, muralBloco
} from "./gerador/blocos.mjs";

function salvar(rel, html) {
  const alvo = path.join(SITE, rel);
  mkdirSync(path.dirname(alvo), { recursive: true });
  writeFileSync(alvo, html, "utf8");
  console.log("ok", rel);
}
const migalhas = (base, nome) => `<nav class="migalhas" aria-label="Você está em"><a href="${base}">Início</a> / ${esc(nome)}</nav>`;
const ld = (lista) => ldFaq(faqLd(lista));

/* =================================================================
   HOME
   ================================================================= */
{
  const b = "./";
  const beneficios = ["Horários e dias flexíveis", "Instrutor paciente", "Aula no local da prova", "Carro e moto para a prova", "Primeira habilitação A e B", "Adição de categoria", "Aulas para habilitados", "Grajaú e região"];
  const ticker = `<ul>${beneficios.map((t) => `<li>${t}</li>`).join("")}</ul>`;
  const faqHome = [...FAQ.geral, ...FAQ.cnh.slice(0, 3)];
  const corpo = `
<section class="hero" aria-labelledby="hero-titulo">
  <div class="container hero__grade">
    <div>
      <p class="hero__selo">${I.trofeu} O primeiro instrutor autônomo da Zona Sul</p>
      <h1 id="hero-titulo">Aprenda a dirigir <span class="ouro">no Grajaú</span>, no seu horário.</h1>
      <p class="hero__sub">Aulas de <strong>carro e moto</strong> com instrutor paciente, para a primeira habilitação, a adição de categoria ou para voltar a dirigir. Tem <strong>aula no local da prova</strong> e o <strong>veículo da escola no dia do exame</strong>.</p>
      <div class="btns">
        <a class="btn btn--ouro" href="orcamento/">Montar meu orçamento</a>
        ${wa("", "btn btn--contorno", "Chamar no WhatsApp")}
      </div>
      <div class="hero__info">
        <a data-wa href="${WA}">${I.whats}<span data-whats-rotulo>${esc(C.whatsapp.rotulo)}</span></a>
        <a data-maps href="#">${I.pin}Av. Dona Belmira Marin, 4772</a>
      </div>
    </div>
    <div class="hero__reel">
      <div class="reel-tela">
        <video data-hero-video="assets/video/hero-loop.mp4" poster="assets/video/hero-loop.jpg" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
        <span class="reel-tela__rotulo"><img src="assets/img/logo-grajau.png" width="580" height="490" alt="">@${esc(C.instagram.usuario)}</span>
      </div>
      <span class="flutua flutua--1">${I.relogio} Horário flexível</span>
      <span class="flutua flutua--2">${I.pin} Aula no local da prova</span>
      <span class="flutua flutua--3">${I.escudo} Categorias A e B</span>
    </div>
  </div>
  <div class="hero__estrada" aria-hidden="true"></div>
</section>

<div class="beneficios" aria-label="Diferenciais"><div class="beneficios__trilho">${ticker}<ul aria-hidden="true">${beneficios.map((t) => `<li>${t}</li>`).join("")}</ul></div></div>

${secCasos(b)}

<section class="secao secao--grafite" aria-labelledby="porque-titulo">
  <div class="container duas-col">
    <div class="revelar">
      <span class="eyebrow">Quem vai te ensinar</span>
      <h2 class="titulo" id="porque-titulo">Paciência, foco <em>e café</em></h2>
      <p class="lead">Aulas leves, preço justo e flexibilidade de horário. No Grajaú, você não apenas tira sua habilitação: você conquista sua liberdade.</p>
      <p data-instrutor></p>
      <div class="cards cards--2">
        <article class="card"><div class="card__icone">${I.relogio}</div><h3>Horário flexível</h3><p>Dias e horários combinados com você, sem grade fixa.</p></article>
        <article class="card"><div class="card__icone">${I.sorriso}</div><h3>Instrutor paciente</h3><p>Sem grito e sem pressão: a aula vai no seu ritmo.</p></article>
        <article class="card"><div class="card__icone">${I.carro}</div><h3>Veículos revisados</h3><p>Carro e moto da escola nas aulas e no dia da prova.</p></article>
        <article class="card"><div class="card__icone">${I.coracao}</div><h3>Atendimento de perto</h3><p>Você fala direto com o instrutor pelo WhatsApp.</p></article>
      </div>
    </div>
    <div class="revelar">
      <div class="foto foto--moldura">${foto(b, "mascote", "Arte da Auto Escola Grajaú: o mascote do instrutor fazendo sinal de positivo, com o carro e a moto da escola e a frase 'No Grajaú, você não apenas tira sua habilitação, você conquista sua liberdade'")}</div>
    </div>
  </div>
</section>

${secPrecos(b)}

${secLocalProva(b)}

<section class="secao secao--creme" id="instrutor-autonomo" aria-labelledby="autonomo-titulo">
  <div class="container duas-col">
    <div class="revelar">
      <div class="foto foto--moldura" style="max-width:460px;margin:0 auto">${foto(b, "gibi", "Capa de gibi ilustrada: o instrutor da Grajaú de braços cruzados, com o carro e a moto da escola e os balões 'O primeiro instrutor autônomo da Zona Sul' e 'Aulas no local da prova'")}</div>
    </div>
    <div class="revelar">
      <span class="eyebrow">Nova CNH</span>
      <h2 class="titulo" id="autonomo-titulo">Agora dá para tirar a CNH com <em>instrutor autônomo</em></h2>
      <p class="lead">Desde dezembro de 2025, a autoescola deixou de ser obrigatória: as aulas práticas podem ser feitas com instrutor autônomo credenciado pelo Detran. A prova continua a mesma.</p>
      <ul class="lista-check">
        <li><strong>Mínimo de 2 horas</strong> de aula prática (antes eram 20)</li>
        <li>Curso teórico <strong>on-line e gratuito</strong> no app CNH do Brasil</li>
        <li>Você paga <strong>só as aulas que precisa</strong></li>
        <li>Aula <strong>só sua</strong>, no horário que você escolhe</li>
      </ul>
      <p class="nota" data-cnpj></p>
      <div class="btns"><a class="btn btn--preto" href="instrutor-autonomo/">Entenda a Nova CNH</a></div>
      <p class="fonte">${esc("Fonte: Agência Brasil, 01/12/2025.")} Conferido em ${esc(C.regrasAtualizadasEm)}.</p>
    </div>
  </div>
</section>

${secVideos(b)}

${secGerador(b)}

${secEstrada(b)}

${secOrcRapido(b)}

${secFaq(faqHome)}

${secOnde(b)}
`;
  salvar("index.html", pagina({
    base: b, url: "", atual: "",
    titulo: "Auto Escola Grajaú | Instrutor autônomo de carro e moto no Grajaú, Zona Sul de SP",
    descricao: `Aulas de carro e moto no Grajaú com instrutor autônomo: horário flexível, aula no local da prova e veículo para o exame. Aula avulsa ${precoDe("avulsa")}, 10 aulas ${precoDe("pacote-10")}. Orçamento no WhatsApp.`,
    corpo, scripts: ["orcamento", "estrada", "placa"], ld: [ld(faqHome)]
  }));
}

/* =================================================================
   ORÇAMENTO
   ================================================================= */
{
  const b = "../";
  const casos = C.casos.map((c) => `<label class="opcao"><input type="radio" name="caso" value="${c.id}"><span><strong>${esc(c.titulo)}</strong><small>${esc(c.subtitulo)}</small></span></label>`).join("\n            ");
  const regioes = C.regioes.map((r) => `<option value="${esc(r)}">`).join("");
  const corpo = `
<section class="secao" style="padding-top:clamp(28px,5vw,56px)" aria-labelledby="orc-titulo">
  <div class="container orc">
    <div class="orc__lado">
      ${migalhas(b, "Orçamento")}
      <span class="eyebrow">Orçamento por caso</span>
      <h1 class="titulo" id="orc-titulo">Seu orçamento <em>em 1 minuto</em></h1>
      <p class="lead">Escolha o seu caso, responda 2 ou 3 perguntas e veja o valor. No fim, o WhatsApp abre com a mensagem pronta: você só aperta enviar.</p>
      <ul class="lista-check">
        <li><strong>Nunca dirigiu?</strong> Pacote 10 aulas por <span data-preco="pacote-10">${precoDe("pacote-10")}</span> ou 20 aulas (carro + moto) por <span data-preco="pacote-20">${precoDe("pacote-20")}</span>.</li>
        <li><strong>Já dirige?</strong> 2 aulas + veículo da prova por <span data-preco="duas-aulas-carro">${precoDe("duas-aulas-carro")}</span>.</li>
        <li><strong>Prova marcada?</strong> Aula no local da prova por <span data-preco="aula-local-prova">${precoDe("aula-local-prova")}</span>.</li>
        <li><strong>Tem CNH e perdeu a prática?</strong> Aula avulsa por <span data-preco="avulsa">${precoDe("avulsa")}</span>.</li>
        <li>Nada é enviado para servidor: a mensagem só sai quando você aperta enviar no WhatsApp.</li>
      </ul>
      <p class="contato-rapido">Prefere falar direto? ${wa("", "btn btn--contorno btn--p", esc(C.whatsapp.rotulo))}</p>
    </div>

    <form class="orc__form claro" data-orc novalidate>
      <div class="passos" aria-hidden="true"><span class="passos__item"></span><span class="passos__item"></span><span class="passos__item"></span><span class="passos__item"></span><span class="passos__item"></span></div>
      <p class="passo__contagem">Etapa <span data-passo-num>1 de 5</span></p>

      <div class="passo ativo" data-passo="caso">
        <h2>Qual é o seu caso?</h2>
        <fieldset class="campo"><legend class="sr-only">Seu caso</legend>
          <div class="opcoes opcoes--casos">
            ${casos}
          </div>
        </fieldset>
      </div>

      <div class="passo" data-passo="perguntas" hidden>
        <p class="passo__caso">Seu caso: <strong data-caso-nome></strong> <button type="button" data-trocar-caso>trocar</button></p>
        <h2>Conta um pouco mais</h2>
        <div data-perguntas></div>
      </div>

      <div class="passo" data-passo="opcao" hidden>
        <p class="passo__caso">Seu caso: <strong data-caso-nome></strong> <button type="button" data-trocar-caso>trocar</button></p>
        <h2>Qual opção te interessa?</h2>
        <div data-opcoes-preco></div>
        <div class="campo" data-qtd-bloco hidden>
          <span class="campo__label">Quantas aulas?</span>
          <div class="qtd"><button type="button" data-delta="-1" aria-label="Menos uma aula">−</button><output aria-live="polite">2</output><button type="button" data-delta="1" aria-label="Mais uma aula">+</button></div>
          <input type="number" name="qtd" min="1" max="40" value="2" hidden aria-hidden="true" tabindex="-1">
          <span class="campo__ajuda">Pode mudar depois com o instrutor.</span>
        </div>
      </div>

      <div class="passo" data-passo="voce" hidden>
        <h2>Sobre você</h2>
        <div class="campo"><label for="nome">Seu nome</label><input type="text" id="nome" name="nome" autocomplete="name" maxlength="40" placeholder="Ex.: Ana" required></div>
        <div class="campo"><label for="bairro">Seu bairro <span class="campo__ajuda">(opcional)</span></label><input type="text" id="bairro" name="bairro" list="lista-bairros" maxlength="50" placeholder="Ex.: Grajaú"><datalist id="lista-bairros">${regioes}</datalist></div>
        <fieldset class="campo"><legend>Melhor horário para as aulas <span class="campo__ajuda">(pode marcar mais de um)</span></legend>
          <div class="opcoes">
            <label class="opcao"><input type="checkbox" name="periodo" value="manha" data-rotulo="manhã"><span>Manhã</span></label>
            <label class="opcao"><input type="checkbox" name="periodo" value="tarde" data-rotulo="tarde"><span>Tarde</span></label>
            <label class="opcao" data-servico-periodo="aulaNoite"><input type="checkbox" name="periodo" value="noite" data-rotulo="noite"><span>Noite</span></label>
            <label class="opcao" data-servico-periodo="aulaSabado"><input type="checkbox" name="periodo" value="sabado" data-rotulo="sábado"><span>Sábado</span></label>
            <label class="opcao" data-servico-periodo="aulaDomingo"><input type="checkbox" name="periodo" value="domingo" data-rotulo="domingo"><span>Domingo</span></label>
          </div>
        </fieldset>
      </div>

      <div class="passo" data-passo="enviar" hidden>
        <h2>Pronto! Confira e envie</h2>
        <div class="estimativa" data-orc-estimativa aria-live="polite"></div>
        <div class="orc__previa"><strong>Sua mensagem</strong><span data-orc-previa></span></div>
        <a class="btn btn--whats btn--bloco" data-orc-enviar href="${WA}" target="_blank" rel="noopener">${I.whats} Enviar no WhatsApp</a>
      </div>

      <p class="campo__erro" data-orc-erro role="alert"></p>
      <div class="passo__nav">
        <button class="btn btn--contorno" type="button" data-voltar>← Voltar</button>
        <button class="btn btn--ouro" type="button" data-proximo>Próximo →</button>
      </div>
    </form>
  </div>
</section>
`;
  salvar("orcamento/index.html", pagina({
    base: b, url: "orcamento/", atual: "orcamento", classe: "sem-barra",
    titulo: "Orçamento de aulas de direção no Grajaú | Auto Escola Grajaú",
    descricao: "Escolha o seu caso (nunca dirigiu, já dirige, prova marcada, reprovou, habilitado, adição de categoria) e veja o valor das aulas de carro e moto no Grajaú. Mensagem pronta no WhatsApp.",
    corpo, scripts: ["orcamento"], ld: [ldMigalhas([["Orçamento", "orcamento/"]])]
  }));
}

/* =================================================================
   AULA NO LOCAL DA PROVA
   ================================================================= */
{
  const b = "../";
  const faq = FAQ.localProva;
  const ids = ["aula-local-prova", "aluguel", "duas-aulas-carro", "quatro-aulas"];
  const corpo = `
<section class="pg-hero" aria-labelledby="pg-titulo">
  <div class="container pg-hero__grade">
    <div>
      ${migalhas(b, "Aula no local da prova")}
      <span class="eyebrow">O diferencial da Grajaú</span>
      <h1 id="pg-titulo">Aula <em>no local da prova</em></h1>
      <p class="lead">Treine no lugar onde o Detran vai te avaliar: as mesmas ruas, a mesma sinalização, as mesmas conversões. No dia do exame, nada é novidade.</p>
      <div class="numeros">
        <div class="numero"><strong data-preco="aula-local-prova">${precoDe("aula-local-prova")}</strong><span>aula no local da prova (carro)</span></div>
        <div class="numero"><strong data-preco="aluguel">${precoDe("aluguel")}</strong><span>carro ou moto da escola para a prova</span></div>
      </div>
      <div class="btns">
        ${wa("Olá! Vim pelo site da Auto Escola Grajaú e quero uma aula no local da prova.", "btn btn--ouro", "Quero aula no local")}
        <a class="btn btn--contorno" href="${b}orcamento/?caso=prova-marcada">Montar orçamento</a>
      </div>
    </div>
    <div class="rota">${ROTA_SVG}</div>
  </div>
</section>

<section class="secao secao--creme" aria-labelledby="porque-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Por que funciona</span>
      <h2 class="titulo" id="porque-titulo">Quem conhece o percurso <em>erra menos</em></h2>
      <p class="lead">Na prova prática de SP, cada erro soma pontos e acima de 10 você reprova. Boa parte dos pontos vem de coisas do lugar: uma placa que você não viu, uma preferência numa rotatória, uma faixa de pedestre logo depois da curva.</p>
    </div>
    <div class="cards cards--4">
      <article class="card card--borda revelar"><div class="card__icone">${I.rota}</div><h3>Conhece as ruas</h3><p>Você passa pelo trajeto antes, com calma e com o instrutor explicando cada ponto.</p></article>
      <article class="card card--borda revelar"><div class="card__icone">${I.olho}</div><h3>Treina o que reprova</h3><p>Conversões, preferências, sinalização e faixas daquele lugar, não de um lugar qualquer.</p></article>
      <article class="card card--borda revelar"><div class="card__icone">${I.sorriso}</div><h3>Menos nervosismo</h3><p>Lugar conhecido, cabeça tranquila. O nervoso é um dos motivos mais comuns de erro.</p></article>
      <article class="card card--borda revelar"><div class="card__icone">${I.carro}</div><h3>Mesmo veículo</h3><p>Você treina e faz a prova com o carro da escola, já acostumado com ele.</p></article>
    </div>
  </div>
</section>

<section class="secao" aria-labelledby="como-titulo">
  <div class="container duas-col duas-col--topo">
    <div class="revelar">
      <span class="eyebrow">Como funciona</span>
      <h2 class="titulo" id="como-titulo">Em <em>4 passos</em></h2>
      <ol class="passo-a-passo">
        <li><strong>Mande a data e o local da prova</strong>Pelo WhatsApp ou pelo orçamento. Se ainda não tem a data, a gente combina o melhor momento.</li>
        <li><strong>Combine o horário da aula</strong>De preferência alguns dias antes do exame, no horário que der para você.</li>
        <li><strong>Aula no local</strong>Percurso, pontos críticos e uma simulação do jeito que o examinador avalia.</li>
        <li><strong>Dia da prova</strong>Você faz o exame com o carro da escola, o mesmo da aula.</li>
      </ol>
      <p class="nota" style="margin-top:14px">A aula no local é para a prova de carro: a prova de moto é feita em área fechada. <span class="pendente" data-pendente>[CLIENTE INFORMAR: em quais locais de prova dá aula e se o instrutor acompanha no dia]</span></p>
    </div>
    <div class="revelar">
      <span class="eyebrow">Preços</span>
      <h2 class="titulo">Escolha <em>o combo</em></h2>
      <div class="precos" style="grid-template-columns:1fr">
        ${ids.map((id) => precoCard(item(id), { mini: true })).join("\n        ")}
      </div>
      <p class="fonte">${esc(C.planos.aviso)} Conferido em ${esc(C.planos.atualizadoEm)}.</p>
    </div>
  </div>
</section>

<section class="secao secao--grafite" aria-labelledby="sim-titulo">
  <div class="container container--estreito centro">
    <span class="eyebrow">Teste antes</span>
    <h2 class="titulo" id="sim-titulo">Você passaria <em>na prova prática?</em></h2>
    <p class="lead">Marque os erros no simulador de pontos e veja se ficaria abaixo dos 10 pontos.</p>
    <a class="btn btn--ouro" href="${b}instrutor-autonomo/#simulador">Abrir o simulador</a>
  </div>
</section>

${secFaq(faq, { escola: "local-prova", titulo: 'Aula no local da prova: <em>dúvidas</em>' })}

${cta(b, { titulo: "Prova marcada? Bora treinar no local.", texto: "Mande a data e o local da prova e o instrutor responde pelo WhatsApp.", caso: "prova-marcada", msg: "Olá! Vim pelo site da Auto Escola Grajaú. Minha prova está marcada e quero aula no local da prova." })}
`;
  salvar("aula-no-local-da-prova/index.html", pagina({
    base: b, url: "aula-no-local-da-prova/", atual: "local-prova",
    titulo: `Aula no local da prova no Grajaú (${precoDe("aula-local-prova")}) | Auto Escola Grajaú`,
    descricao: `Treine no local da prova prática do Detran-SP com instrutor autônomo da Grajaú. Aula no local ${precoDe("aula-local-prova")} e aluguel do carro ou da moto para o exame ${precoDe("aluguel")}.`,
    corpo, ld: [ld(faq), ldMigalhas([["Aula no local da prova", "aula-no-local-da-prova/"]])]
  }));
}

/* =================================================================
   CATEGORIAS A e B
   ================================================================= */
function paginaCategoria(cat) {
  const b = "../";
  const A = cat === "A";
  const nome = A ? "Categoria A · Moto" : "Categoria B · Carro";
  const url = A ? "categoria-a/" : "categoria-b/";
  const faq = [FAQ.geral[0], FAQ.geral[1], FAQ.geral[3], ...(A ? [] : [FAQ.cnh[3]]), FAQ.cnh[4]];
  const corpo = `
<section class="pg-hero" aria-labelledby="pg-titulo">
  <div class="container pg-hero__grade">
    <div>
      ${migalhas(b, nome)}
      <span class="eyebrow">${A ? "CNH de moto" : "CNH de carro"} no Grajaú</span>
      <h1 id="pg-titulo">Categoria ${cat}: <em>${A ? "moto" : "carro"}</em></h1>
      <p class="lead">${A
        ? "Aulas práticas de moto com instrutor, do primeiro contato com a embreagem até a prova do Detran-SP. Com a moto da escola no dia do exame."
        : `Aulas práticas de carro no ${esc(C.frota.carro)} da escola, com foco no percurso da prova (que em SP não tem mais baliza) e o carro da escola no dia do exame.`}</p>
      <div class="btns" style="margin-top:22px">
        <a class="btn btn--ouro" href="${b}orcamento/?cat=${cat}">Orçamento ${A ? "de moto" : "de carro"}</a>
        ${wa(`Olá! Vim pelo site da Auto Escola Grajaú e quero saber sobre a categoria ${cat} (${A ? "moto" : "carro"}).`, "btn btn--contorno", "WhatsApp")}
      </div>
    </div>
    <div class="pg-hero__img" style="aspect-ratio:${A ? "1/1" : "4/5"};max-width:${A ? "520px" : "420px"};justify-self:center;width:100%">${A
      ? foto(b, "moto-frente", "Aluno pilotando a moto preta da Auto Escola Grajaú numa curva, de capacete e jaqueta", { eager: true })
      : foto(b, "carro-aula", "Aluna dirigindo o carro da Auto Escola Grajaú durante uma aula prática", { eager: true })}</div>
  </div>
</section>

<section class="secao secao--creme" aria-labelledby="permite-titulo">
  <div class="container duas-col">
    <div class="revelar">
      <span class="eyebrow">O que a categoria ${cat} permite</span>
      <h2 class="titulo" id="permite-titulo">O que você vai <em>poder dirigir</em></h2>
      <blockquote class="card card--borda" style="margin:0 0 14px">
        <p>${A ? "“Categoria A: condutor de veículo motorizado de duas ou três rodas, com ou sem carro lateral.”" : "“Categoria B: condutor de veículo motorizado, não abrangido pela categoria A, cujo peso bruto total não exceda a três mil e quinhentos quilogramas e cuja lotação não exceda a oito lugares, excluído o do motorista.”"}</p>
        <span class="fonte">Código de Trânsito Brasileiro (Lei nº 9.503/1997), art. 143, inciso ${A ? "I" : "II"}. <a href="https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm" target="_blank" rel="noopener">Ler no Planalto</a></span>
      </blockquote>
      <p class="nota">Para a primeira habilitação, o CTB exige ter 18 anos, saber ler e escrever e ter documento de identidade (art. 140).</p>
    </div>
    <div class="revelar">
      <ul class="lista-check">
        ${A ? "<li>Motocicletas e motonetas</li><li>Ciclomotores (as “cinquentinhas”)</li><li>Triciclos e motos com carro lateral</li>"
            : "<li>Carros de passeio e utilitários pequenos</li><li>Veículos de até 3.500 kg</li><li>Até 8 passageiros, além do motorista</li>"}
      </ul>
      <p>Quer as duas? O <strong>pacote de 20 aulas</strong> (<span data-preco="pacote-20">${precoDe("pacote-20")}</span>) pode ser 10 de carro + 10 de moto. Veja a <a href="${b}${A ? "categoria-b/" : "categoria-a/"}">categoria ${A ? "B (carro)" : "A (moto)"}</a>.</p>
      <p>Já tem a categoria ${A ? "B" : "A"}? Então é <a href="${b}habilitados/#adicao">adição de categoria</a>.</p>
    </div>
  </div>
</section>

<section class="secao" aria-labelledby="aulas-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Na Grajaú</span>
      <h2 class="titulo" id="aulas-titulo">Como são <em>as aulas</em></h2>
      <p class="lead">A lei pede no mínimo 2 horas de prática. Você escolhe quantas aulas fazer, e o instrutor ajuda você a perceber quando está pronto para a prova.</p>
    </div>
    <div class="cards cards--4">
      <article class="card revelar"><div class="card__icone">${A ? I.moto : I.carro}</div><h3>${A ? "Moto da aula" : "Carro da aula"}</h3><p>${A ? `Moto da escola nas aulas e na prova. <span class="pendente" data-pendente>[CLIENTE INFORMAR modelo e cilindrada]</span>` : `${esc(C.frota.carro)} da escola, o mesmo das aulas e da prova. <span class="pendente" data-pendente>[confirmar se há carro automático]</span>`}</p></article>
      <article class="card revelar"><div class="card__icone">${I.relogio}</div><h3>Duração</h3><p>Cada aula: <span data-duracao>consulte</span>. Horários e dias flexíveis.</p></article>
      <article class="card revelar"><div class="card__icone">${A ? I.escudo : I.pin}</div><h3>${A ? "Equipamento" : "Local da prova"}</h3><p>${A ? 'Capacete e equipamento de proteção nas aulas. <span class="pendente" data-pendente>[CLIENTE INFORMAR se empresta capacete]</span>' : `Aula no local da prova por <span data-preco="aula-local-prova">${precoDe("aula-local-prova")}</span>.`}</p></article>
      <article class="card revelar"><div class="card__icone">${I.presente}</div><h3>Veículo na prova</h3><p>Nos pacotes de 10 e 20 aulas, o aluguel na 1ª prova é cortesia.</p></article>
    </div>
  </div>
</section>

${secPrecos(b, { cat, titulo: `Quanto custa <em>${A ? "a moto" : "o carro"}</em>`, classe: "secao secao--grafite" })}

<section class="secao secao--creme" aria-labelledby="avalia-titulo">
  <div class="container duas-col">
    <div class="revelar">
      <span class="eyebrow">Prova prática</span>
      <h2 class="titulo" id="avalia-titulo">O que o examinador <em>avalia</em></h2>
      <p class="lead">A prova em SP usa um sistema de pontos. Não existe mais falta que elimina na hora: cada erro soma pontos conforme a gravidade.</p>
      <ul class="lista-check">
        ${A ? "<li>Controle da moto: equilíbrio, embreagem, freios e marchas.</li><li>Respeito à sinalização, às preferências e à velocidade da via.</li><li>Postura, atenção ao trânsito e uso correto do equipamento.</li>"
            : "<li>Controle do carro: partida, embreagem, marchas e frenagem.</li><li>Respeito à sinalização, às preferências e à velocidade da via.</li><li>Conversões, uso das setas e atenção a pedestres.</li>"}
      </ul>
      <p class="fonte">Fontes: Detran-SP (jan/2026); Autoo (16/03/2026); Portal do Trânsito (18/03/2026). Conferido em ${esc(C.regrasAtualizadasEm)}.</p>
    </div>
    <div class="revelar">
      <div class="cards cards--2">
        <article class="card"><span class="card__tag">Leve</span><h3>1 ponto</h3></article>
        <article class="card"><span class="card__tag">Média</span><h3>2 pontos</h3></article>
        <article class="card"><span class="card__tag">Grave</span><h3>4 pontos</h3></article>
        <article class="card"><span class="card__tag">Gravíssima</span><h3>6 pontos</h3></article>
      </div>
      <p style="margin-top:16px">Até <strong>10 pontos</strong>: aprovado. <a href="${b}instrutor-autonomo/#simulador">Teste no simulador de pontos →</a></p>
    </div>
  </div>
</section>

<section class="secao" aria-labelledby="videos-cat-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Em vídeo</span>
      <h2 class="titulo" id="videos-cat-titulo">Aula de <em>${A ? "moto" : "carro"}</em> na prática</h2>
    </div>
    ${reels(b, cat)}
    ${muralBloco(cat)}
  </div>
</section>

${secFaq(faq, { escola: `geral ${cat}`, titulo: `Categoria ${cat}: <em>dúvidas</em>` })}

${cta(b, { titulo: A ? "Bora pilotar?" : "Bora dirigir?", texto: "Conta o seu caso e o instrutor responde pelo WhatsApp.", msg: `Olá! Vim pelo site da Auto Escola Grajaú e quero um orçamento para a categoria ${cat} (${A ? "moto" : "carro"}).` })}
`;
  salvar(url + "index.html", pagina({
    base: b, url, atual: A ? "a" : "b", scripts: ["mural"],
    titulo: A ? "CNH de moto (categoria A) no Grajaú | Auto Escola Grajaú" : "CNH de carro (categoria B) no Grajaú | Auto Escola Grajaú",
    descricao: A
      ? `Aulas de moto (categoria A) no Grajaú com instrutor autônomo e moto da escola na prova. 2 aulas + aluguel da moto ${precoDe("duas-aulas-moto")}, pacote 10 aulas ${precoDe("pacote-10")}.`
      : `Aulas de carro (categoria B) no Grajaú com instrutor autônomo, aula no local da prova e carro para o exame. 2 aulas + aluguel ${precoDe("duas-aulas-carro")}, pacote 10 aulas ${precoDe("pacote-10")}.`,
    corpo, ld: [ld(faq), ldMigalhas([[nome, url]])]
  }));
}
paginaCategoria("A");
paginaCategoria("B");

/* =================================================================
   HABILITADOS E ADIÇÃO
   ================================================================= */
{
  const b = "../";
  const faq = [FAQ.geral[4], FAQ.geral[5], FAQ.geral[0]];
  const corpo = `
<section class="pg-hero" aria-labelledby="pg-titulo">
  <div class="container pg-hero__grade">
    <div>
      ${migalhas(b, "Habilitados e adição de categoria")}
      <span class="eyebrow">Aulas para habilitados</span>
      <h1 id="pg-titulo">Tem CNH, mas <em>não dirige?</em></h1>
      <p class="lead">Perca o medo e volte a dirigir no trânsito de São Paulo, com um instrutor paciente do lado e no seu ritmo. Aula avulsa por <span data-preco="avulsa">${precoDe("avulsa")}</span>.</p>
      <div class="btns" style="margin-top:22px">
        <a class="btn btn--ouro" href="${b}orcamento/?caso=habilitado">Montar meu orçamento</a>
        ${wa("Olá! Vim pelo site da Auto Escola Grajaú. Tenho CNH, mas perdi a prática e quero voltar a dirigir.", "btn btn--contorno", "WhatsApp")}
      </div>
    </div>
    <div class="pg-hero__img" style="aspect-ratio:4/5;max-width:420px;justify-self:center;width:100%">${foto(b, "carro-aula", "Aluna dirigindo o carro da Auto Escola Grajaú com as duas mãos no volante, durante uma aula", { eager: true })}</div>
  </div>
</section>

<section class="secao secao--creme" aria-labelledby="pra-quem-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Pra quem é</span>
      <h2 class="titulo" id="pra-quem-titulo">Você se <em>reconhece?</em></h2>
    </div>
    <div class="cards cards--4">
      <article class="card card--borda revelar"><div class="card__icone">${I.chave}</div><h3>Tirei e nunca dirigi</h3><p>A CNH está na carteira, mas o carro nunca saiu da garagem com você no volante.</p></article>
      <article class="card card--borda revelar"><div class="card__icone">${I.relogio}</div><h3>Fiquei anos parado</h3><p>Você dirigia, parou, e agora o trânsito parece outro.</p></article>
      <article class="card card--borda revelar"><div class="card__icone">${I.coracao}</div><h3>Tenho medo</h3><p>Avenida, ladeira, moto do lado, alguém buzinando. A gente treina cada um.</p></article>
      <article class="card card--borda revelar"><div class="card__icone">${I.rota}</div><h3>Preciso de um trajeto</h3><p>Ir ao trabalho, levar o filho na escola: dá para treinar o caminho que você vai usar.</p></article>
    </div>
  </div>
</section>

<section class="secao" aria-labelledby="como-hab-titulo">
  <div class="container duas-col duas-col--topo">
    <div class="revelar">
      <span class="eyebrow">Como são as aulas</span>
      <h2 class="titulo" id="como-hab-titulo">No seu tempo, <em>sem pressão</em></h2>
      <ol class="passo-a-passo">
        <li><strong>Conversa inicial</strong>Você conta o que trava: medo de avenida, de manobrar, de ladeira…</li>
        <li><strong>Começa onde é tranquilo</strong>Ruas calmas primeiro, para pegar a mão de novo.</li>
        <li><strong>Sobe o nível aos poucos</strong>Avenida, trânsito, estacionamento, o trajeto do seu dia a dia.</li>
        <li><strong>Você decide quando parar</strong>Aula avulsa: faz quantas precisar, sem pacote fechado.</li>
      </ol>
      <p class="nota" style="margin-top:14px" data-servico="aulaNoCarroDoAluno" data-sem-marca><span class="pendente">[CLIENTE INFORMAR se dá aula no carro do próprio aluno]</span></p>
    </div>
    <div class="revelar">
      <span class="eyebrow">Preço</span>
      <h2 class="titulo">Aula <em>avulsa</em></h2>
      <div class="precos" style="grid-template-columns:1fr">${precoCard(item("avulsa"))}</div>
    </div>
  </div>
</section>

<section class="secao secao--grafite" id="adicao" aria-labelledby="adicao-titulo">
  <div class="container">
    <div class="secao__topo revelar">
      <span class="eyebrow">Adição de categoria</span>
      <h2 class="titulo" id="adicao-titulo">Tem A e quer B? <em>Ou o contrário?</em></h2>
      <p class="lead">Quem já tem CNH não precisa começar do zero: na adição de categoria você faz as aulas práticas da nova categoria e a prova prática. Escolha quantas aulas fazer.</p>
    </div>
    <div class="precos precos--rapidos">
      ${["pacote-10", "quatro-aulas", "duas-aulas-carro"].map((id) => precoCard(item(id), { mini: true })).join("\n      ")}
    </div>
    <div class="btns" style="margin-top:22px"><a class="btn btn--ouro" href="${b}orcamento/?caso=adicao">Orçamento de adição</a></div>
    <p class="fonte">${esc(C.planos.aviso)} As taxas do Detran-SP da adição são pagas à parte.</p>
  </div>
</section>

${secFaq(faq, { escola: "habilitados", titulo: 'Habilitados: <em>dúvidas</em>' })}

${cta(b, { titulo: "Bora voltar a dirigir?", texto: "Conta o que trava e o instrutor monta as aulas para você.", caso: "habilitado", msg: "Olá! Vim pelo site da Auto Escola Grajaú. Tenho CNH e quero aulas para voltar a dirigir." })}
`;
  salvar("habilitados/index.html", pagina({
    base: b, url: "habilitados/", atual: "habilitados",
    titulo: "Aulas para habilitados e adição de categoria no Grajaú | Auto Escola Grajaú",
    descricao: `Tem CNH mas não dirige? Aulas para habilitados no Grajaú: perca o medo de dirigir com instrutor paciente. Aula avulsa ${precoDe("avulsa")}. Também adição de categoria A ou B.`,
    corpo, ld: [ld(faq), ldMigalhas([["Habilitados", "habilitados/"]])]
  }));
}

/* =================================================================
   INSTRUTOR AUTÔNOMO + NOVA CNH (guia)
   ================================================================= */
{
  const b = "../";
  const faq = FAQ.cnh;
  const falta = (k, nome, pts) => `<div class="falta falta--${k}">
          <span class="falta__nome">${nome}<span class="falta__pts">${pts}</span></span>
          <span class="contagem-ctrl" role="group" aria-label="Faltas ${nome.toLowerCase()}s">
            <button type="button" data-falta="${k}" data-delta="-1" aria-label="Tirar uma falta ${nome.toLowerCase()}">−</button>
            <output data-cont="${k}" aria-live="polite">0</output>
            <button type="button" data-falta="${k}" data-delta="1" aria-label="Somar uma falta ${nome.toLowerCase()}">+</button>
          </span>
        </div>`;
  const corpo = `
<section class="pg-hero" aria-labelledby="pg-titulo">
  <div class="container pg-hero__grade">
    <div>
      ${migalhas(b, "Instrutor autônomo e Nova CNH")}
      <span class="eyebrow">Guia conferido em ${esc(C.regrasAtualizadasEm)}</span>
      <h1 id="pg-titulo">Instrutor autônomo e a <em>Nova CNH</em> em SP</h1>
      <p class="lead">A autoescola deixou de ser obrigatória. A prova, não. Este guia explica as regras novas com fonte e data, e como funciona tirar a CNH com instrutor autônomo.</p>
      <div class="btns" style="margin-top:22px"><a class="btn btn--ouro" href="${b}orcamento/">Montar meu orçamento</a><a class="btn btn--contorno" href="#simulador">Simulador de pontos</a></div>
    </div>
    <div>${placa("NOVA CNH")}</div>
  </div>
</section>

<section class="secao secao--creme" aria-labelledby="resumo-titulo">
  <div class="container container--estreito">
    <span class="eyebrow">Em 30 segundos</span>
    <h2 class="titulo" id="resumo-titulo">O resumo</h2>
    <ul class="lista-check">
      <li>Em <strong>1º/12/2025</strong>, o Contran aprovou a resolução (citada como <strong>Resolução Contran nº 1.020/2025</strong>) que tirou a obrigatoriedade da autoescola na primeira habilitação.</li>
      <li>O <strong>curso teórico</strong> ganhou uma opção <strong>digital e gratuita</strong> do Ministério dos Transportes.</li>
      <li>As <strong>aulas práticas</strong> caíram de 20 horas obrigatórias para um <strong>mínimo de 2 horas</strong>, com autoescola ou com <strong>instrutor autônomo credenciado</strong>.</li>
      <li>As <strong>provas teórica e prática continuam obrigatórias</strong>. Exame médico e biometria continuam presenciais.</li>
      <li>Em <strong>São Paulo</strong>, a prova de carro perdeu a baliza, aceita carro automático e passou a usar <strong>pontos</strong>: até 10, aprovado.</li>
    </ul>
    <div class="aviso">${I.alerta}<p>O governo estima que o custo da CNH pode cair até 80%. É uma <strong>projeção do governo</strong>, não um valor garantido: o custo real depende de quantas aulas você precisa e das taxas do Detran-SP. Na Grajaú, a aula avulsa custa <span data-preco="avulsa">${precoDe("avulsa")}</span> e o pacote de 10 aulas, <span data-preco="pacote-10">${precoDe("pacote-10")}</span>.</p></div>
    <p class="fonte">Fonte: Agência Brasil, 01/12/2025.</p>
  </div>
</section>

<section class="secao" aria-labelledby="tabela-titulo">
  <div class="container">
    <div class="secao__topo">
      <span class="eyebrow">Antes × agora</span>
      <h2 class="titulo" id="tabela-titulo">O que mudou × <em>o que continua</em></h2>
    </div>
    <div class="tabela-wrap claro" role="region" aria-label="Tabela comparativa: antes e agora" tabindex="0">
      <table>
        <thead><tr><th scope="col">Tema</th><th scope="col">Como era</th><th scope="col">Como ficou</th><th scope="col">Fonte</th></tr></thead>
        <tbody>
          <tr><td>Autoescola</td><td>Obrigatória</td><td><span class="mudou">Mudou:</span> opcional: autoescola ou instrutor autônomo credenciado pelo Detran</td><td class="nota">Agência Brasil</td></tr>
          <tr><td>Curso teórico</td><td>Presencial, em autoescola</td><td><span class="mudou">Mudou:</span> on-line e gratuito no app CNH do Brasil, ou presencial</td><td class="nota">Agência Brasil</td></tr>
          <tr><td>Aulas práticas</td><td>Mínimo de 20 horas</td><td><span class="mudou">Mudou:</span> mínimo de 2 horas</td><td class="nota">Agência Brasil</td></tr>
          <tr><td>Abertura do processo</td><td>No Detran ou na autoescola</td><td><span class="mudou">Mudou:</span> pelo app CNH do Brasil ou pelo site do Ministério dos Transportes</td><td class="nota">Agência Brasil</td></tr>
          <tr><td>Provas teórica e prática</td><td>Obrigatórias</td><td><span class="ok">Continua:</span> continuam obrigatórias</td><td class="nota">Agência Brasil</td></tr>
          <tr><td>Exame médico e biometria</td><td>Presenciais</td><td><span class="ok">Continua:</span> continuam presenciais</td><td class="nota">Agência Brasil</td></tr>
          <tr><td>Baliza (SP)</td><td>Etapa da prova de carro</td><td><span class="mudou">Mudou:</span> saiu da prova; avalia-se a condução no percurso</td><td class="nota">Detran-SP</td></tr>
          <tr><td>Carro automático (SP)</td><td>Não permitido na prova</td><td><span class="mudou">Mudou:</span> permitido para quem não precisa de adaptação</td><td class="nota">Detran-SP</td></tr>
          <tr><td>Avaliação da prova prática</td><td>Faltas eliminatórias</td><td><span class="mudou">Mudou:</span> pontos: leve 1, média 2, grave 4, gravíssima 6. Aprovado com até 10</td><td class="nota">Autoo; Portal do Trânsito</td></tr>
          <tr><td>Veículo na prova (SP)</td><td>Veículo de autoescola</td><td><span class="mudou">Mudou:</span> também é possível usar veículo particular regularizado que atenda às exigências do Detran-SP <span class="pendente" data-pendente>[confirmar Detran-SP]</span></td><td class="nota">Diário de São Paulo</td></tr>
          <tr><td>Exame toxicológico</td><td>Não exigido para A e B</td><td><span class="mudou">Mudou:</span> exigido na primeira habilitação para processos abertos a partir de 17/06/2026 <span class="pendente" data-pendente>[confirmar Detran-SP]</span></td><td class="nota">Diário de São Paulo</td></tr>
        </tbody>
      </table>
    </div>
    <p class="fonte">Os Detrans implementam as mudanças aos poucos. Confirme sempre no site do Detran-SP antes de agendar. Conferido em ${esc(C.regrasAtualizadasEm)}.</p>
  </div>
</section>

<section class="secao secao--creme" aria-labelledby="passos-titulo">
  <div class="container container--estreito">
    <span class="eyebrow">Passo a passo</span>
    <h2 class="titulo" id="passos-titulo">Como tirar a CNH <em>com instrutor autônomo</em></h2>
    <ol class="passo-a-passo">
      <li><strong>Faça os exames médico e psicotécnico</strong>Primeiro passo, presencial. Na primeira habilitação também é exigido o exame toxicológico. Junto vem a coleta de foto e biometria.</li>
      <li><strong>Faça o curso teórico no app</strong>Baixe o app CNH do Brasil (a antiga Carteira Digital de Trânsito) e faça o curso teórico, on-line e gratuito.</li>
      <li><strong>Passe na prova teórica</strong>Aplicada pelo Detran-SP.</li>
      <li><strong>Faça as aulas práticas com a Grajaú</strong>A lei exige no mínimo 2 horas, com autoescola ou instrutor autônomo credenciado. Você escolhe: 2, 4, 10 ou 20 aulas, ou avulsas.</li>
      <li><strong>Treine no local e faça a prova prática</strong>Aula no local da prova e o veículo da escola no dia do exame. Cada erro soma pontos: até 10, aprovado.</li>
      <li><strong>Receba a CNH</strong>Com a taxa de emissão paga, a habilitação aparece no app.</li>
    </ol>
  </div>
</section>

<section class="secao" aria-labelledby="comparar-titulo">
  <div class="container duas-col duas-col--topo">
    <div>
      <span class="eyebrow">Como escolher</span>
      <h2 class="titulo" id="comparar-titulo">Autoescola ou instrutor autônomo: <em>compare</em></h2>
      <p class="lead">Use critérios objetivos, e não só o preço da hora.</p>
      <div class="aviso">${I.alerta}<p>O instrutor autônomo precisa ser credenciado pelo Detran e aparece identificado no app CNH do Brasil. Confira antes de pagar. <span class="fonte" style="display:inline">Fonte: Agência Brasil.</span></p></div>
    </div>
    <div class="comparar">
      <div class="comparar__item"><h3>1. Credenciamento</h3><p>O instrutor é credenciado pelo Detran-SP? Peça o número e confira no app.</p></div>
      <div class="comparar__item"><h3>2. Veículo</h3><p>O carro ou a moto atende às exigências do Detran-SP para o exame?</p></div>
      <div class="comparar__item"><h3>3. Dia da prova</h3><p>Quem leva o veículo? Dá para fazer aula no local da prova?</p></div>
      <div class="comparar__item"><h3>4. Plano B</h3><p>Se você reprovar, como fica o treino para a próxima tentativa?</p></div>
      <div class="comparar__item"><h3>5. Preço total</h3><p>Some aulas, veículo na prova e taxas do Detran-SP. Compare o total.</p></div>
      <div class="comparar__item comparar__item--nosso claro"><h3>Na Grajaú</h3><p><strong>Dia da prova:</strong> aula no local da prova (<span data-preco="aula-local-prova">${precoDe("aula-local-prova")}</span>) e o veículo da escola no exame; nos pacotes de 10 e 20 aulas, o aluguel na 1ª prova é cortesia.<br><strong>Preço:</strong> aula avulsa <span data-preco="avulsa">${precoDe("avulsa")}</span>; pacotes a partir de <span data-preco="pacote-10">${precoDe("pacote-10")}</span>.<br><span data-cnpj></span></p></div>
    </div>
  </div>
</section>

<section class="secao secao--creme" id="simulador" aria-labelledby="sim-titulo">
  <div class="container">
    <div class="secao__topo">
      <span class="eyebrow">Simulador de pontuação</span>
      <h2 class="titulo" id="sim-titulo">Você passaria <em>na prova prática?</em></h2>
      <p class="lead">Marque os erros e veja a soma. Cada erro vale pontos conforme a gravidade e o candidato é aprovado se terminar com até 10 pontos.</p>
    </div>
    <div class="simulador" data-pontuacao>
      <div class="faltas">
        ${falta("leve", "Leve", "1 ponto cada")}
        ${falta("media", "Média", "2 pontos cada")}
        ${falta("grave", "Grave", "4 pontos cada")}
        ${falta("gravissima", "Gravíssima", "6 pontos cada")}
        <button class="btn btn--contorno btn--p" type="button" data-zerar style="justify-self:start">Zerar</button>
        <p class="fonte">Regra usada: Resolução Contran nº 1.020/2025, conforme Autoo (16/03/2026) e Portal do Trânsito (18/03/2026). O simulador é educativo: quem classifica cada erro na prova é o examinador.</p>
      </div>
      <div class="resultado" aria-live="polite">
        <span class="eyebrow">Sua soma</span>
        <div class="resultado__pts"><span data-total>0</span> <small>pontos</small></div>
        <div class="barra" role="meter" aria-label="Pontos somados" aria-valuemin="0" aria-valuemax="16" aria-valuenow="0"><div class="barra__fill"></div></div>
        <div class="barra__marcas"><span>0</span><span>limite: 10</span><span>16+</span></div>
        <div class="veredito" data-veredito></div>
        <a class="btn btn--ouro btn--bloco" style="margin-top:16px" href="${b}aula-no-local-da-prova/">Treinar no local da prova</a>
      </div>
    </div>
  </div>
</section>

${secFaq(faq, { escola: "", titulo: 'Nova CNH: <em>dúvidas</em>', classe: "secao" })}

<section class="secao secao--creme fontes" aria-labelledby="fontes-titulo">
  <div class="container container--estreito">
    <h2 id="fontes-titulo" style="font-size:1.6rem;text-transform:uppercase">Fontes</h2>
    <ol>
      <li><a href="https://agenciabrasil.ebc.com.br/geral/noticia/2025-12/contran-aprova-resolucao-que-retira-exigencia-de-autoescola-para-cnh" target="_blank" rel="noopener">Agência Brasil: “Contran aprova resolução que retira exigência de autoescola para CNH”</a> (01/12/2025)</li>
      <li><a href="https://www.detran.sp.gov.br/detransp/pb/noticia/detran-sp-moderniza-cnh-exame-pr%C3%A1tico-sem-baliza-e-com-carro?id=noticia&amp;sys_kb_id=a7d69dbbfb2e7a10b253fb05beefdcfd" target="_blank" rel="noopener">Detran-SP: “Detran-SP moderniza CNH: exame prático sem baliza e com carro automático”</a> (jan/2026)</li>
      <li><a href="https://www.autoo.com.br/detran-sp-adota-nova-pontuacao-no-exame-pratico-da-cnh-saiba-o-que-muda/" target="_blank" rel="noopener">Autoo: “Detran-SP adota nova pontuação no exame prático da CNH”</a> (16/03/2026)</li>
      <li><a href="https://www.portaldotransito.com.br/noticias/fiscalizacao-e-legislacao/carteira-de-habilitacao-cnh/primeira-habilitacao/nova-cnh-exame-pratico-em-sp-passa-a-ter-novas-regras/" target="_blank" rel="noopener">Portal do Trânsito: “Nova CNH: exame prático em SP passa a ter novas regras”</a> (18/03/2026)</li>
      <li><a href="https://spdiario.com.br/noticias/noticias-de-sp/detran-sp-libera-carro-automatico-na-prova-pratica-da-cnh-veja-as-novas-regras.html" target="_blank" rel="noopener">Diário de São Paulo: “Detran-SP libera carro automático na prova prática da CNH; veja as novas regras”</a> (24/08/2026)</li>
      <li><a href="https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm" target="_blank" rel="noopener">Código de Trânsito Brasileiro (Lei nº 9.503/1997), arts. 140 e 143</a></li>
    </ol>
    <p class="nota">Informações conferidas em ${esc(C.regrasAtualizadasEm)}. As regras podem mudar e cada Detran implementa no seu ritmo. Este guia não substitui a consulta ao Detran-SP.</p>
  </div>
</section>

${cta(b)}
`;
  salvar("instrutor-autonomo/index.html", pagina({
    base: b, url: "instrutor-autonomo/", atual: "autonomo", scripts: ["pontuacao"],
    titulo: "Instrutor autônomo e Nova CNH 2026 em SP: o que mudou | Auto Escola Grajaú",
    descricao: "Autoescola não é mais obrigatória: veja como tirar a CNH com instrutor autônomo em SP, o que mudou na prova (sem baliza, sistema de pontos) e teste o simulador de pontuação.",
    corpo, ld: [ld(faq), ldMigalhas([["Instrutor autônomo", "instrutor-autonomo/"]])]
  }));
}

/* =================================================================
   VÍDEOS
   ================================================================= */
{
  const b = "../";
  const corpo = `
<section class="pg-hero" aria-labelledby="pg-titulo">
  <div class="container">
    ${migalhas(b, "Vídeos")}
    <span class="eyebrow">Em vídeo</span>
    <h1 id="pg-titulo">Aulas <em>de verdade</em></h1>
    <p class="lead">Moto e carro, aqui na região. Toque para assistir com som.</p>
  </div>
</section>

<section class="secao" aria-label="Vídeos das aulas">
  <div class="container">
    ${reels(b)}
    ${muralBloco(null)}
  </div>
</section>

<section class="secao secao--grafite" aria-labelledby="yt-titulo">
  <div class="container duas-col">
    <div class="revelar">
      <span class="eyebrow">No YouTube</span>
      <h2 class="titulo" id="yt-titulo">${esc(C.youtube.tituloDestaque)}</h2>
      <p class="lead">Mais vídeos e dicas no canal da Auto Escola Grajaú.</p>
      <div class="btns">${botoesRedes()}</div>
    </div>
    <div class="revelar">${youtubeDestaque()}</div>
  </div>
</section>

${cta(b)}
`;
  salvar("videos/index.html", pagina({
    base: b, url: "videos/", atual: "videos", scripts: ["mural"],
    titulo: "Vídeos das aulas de carro e moto | Auto Escola Grajaú",
    descricao: "Veja como são as aulas de carro e moto da Auto Escola Grajaú, com instrutor autônomo no Grajaú, Zona Sul de São Paulo.",
    corpo, ld: [ldMigalhas([["Vídeos", "videos/"]]), {
      "@context": "https://schema.org", "@type": "ItemList",
      itemListElement: C.videos.map((v, k) => ({ "@type": "VideoObject", position: k + 1, name: v.titulo, description: v.titulo + " — Auto Escola Grajaú", thumbnailUrl: URL_SITE + "/assets/video/" + v.poster, contentUrl: URL_SITE + "/assets/video/" + v.arquivo, uploadDate: "2026-10-28" }))
    }]
  }));
}

/* =================================================================
   404
   ================================================================= */
{
  const b = "/";
  const corpo = `
<section class="secao erro404">
  <div>
    ${placa("404")}
    <span class="eyebrow">Página não encontrada</span>
    <h1 class="titulo">Essa rua <em>não existe</em></h1>
    <p class="lead">O endereço pode ter mudado. Volte para o início ou fale direto com o instrutor.</p>
    <div class="btns" style="justify-content:center">
      <a class="btn btn--ouro" href="/">Ir para o início</a>
      <a class="btn btn--contorno" href="/orcamento/">Montar orçamento</a>
    </div>
  </div>
</section>
`;
  salvar("404.html", pagina({ base: b, url: "404.html", titulo: "Página não encontrada | Auto Escola Grajaú", descricao: "Página não encontrada.", corpo })
    .replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"'));
}

/* =================================================================
   SITEMAP E ROBOTS
   ================================================================= */
{
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = [["", "1.0"], ["orcamento/", "0.9"], ["aula-no-local-da-prova/", "0.9"], ["categoria-b/", "0.8"], ["categoria-a/", "0.8"], ["habilitados/", "0.8"], ["instrutor-autonomo/", "0.8"], ["videos/", "0.6"]];
  salvar("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>${URL_SITE}/${u}</loc><lastmod>${hoje}</lastmod><priority>${p}</priority></url>`).join("\n")}
</urlset>
`);
  salvar("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${URL_SITE}/sitemap.xml\n`);
}
