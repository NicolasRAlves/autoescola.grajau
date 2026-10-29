/* Orçamento por caso: cada situação (nunca dirigi, já dirijo, prova
   marcada, reprovei, habilitado, adição, só aluguel) tem as próprias
   perguntas e opções de preço. Tudo vem de data/config.js > casos.
   No fim, abre o WhatsApp com a mensagem pronta. Nada vai para servidor. */
(function () {
  "use strict";
  var C = window.GRAJAU || {};
  var S = C.servicos || {};
  var ITENS = (C.planos && C.planos.itens) || [];
  var CASOS = C.casos || [];
  var RASCUNHO = !!C.modoRascunho;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function brl(v) { return window.GrajauBRL ? window.GrajauBRL(v) : "R$ " + v; }
  function whats(m) { return window.GrajauWhats ? window.GrajauWhats(m) : "https://wa.me/5511926324474?text=" + encodeURIComponent(m); }
  function item(id) { return ITENS.filter(function (i) { return i.id === id; })[0] || null; }
  function caso(id) { return CASOS.filter(function (c) { return c.id === id; })[0] || null; }
  function param(n) { var m = new RegExp("[?&]" + n + "=([^&#]+)").exec(location.search); return m ? decodeURIComponent(m[1]) : null; }

  /* serviço: true aparece, false some, null só na prévia (marcado) */
  function visivel(servico) {
    if (!servico) return true;
    var v = S[servico];
    return v === true || (v == null && RASCUNHO);
  }
  function marca(servico) { return servico && S[servico] !== true ? ' <span class="pendente">[confirmar]</span>' : ""; }

  var CAT_ROTULO = { A: "Moto (categoria A)", B: "Carro (categoria B)", AB: "Carro e moto (A + B)" };
  var CAT_MSG = { A: "moto (A)", B: "carro (B)", AB: "carro e moto (A + B)" };
  var MSG = { etapa: "Etapa", pratica: "Quanto já dirijo", data: "Data da prova", local: "Local da prova", veiculo: "Veículo para a prova", tentativas: "Provas práticas feitas", dificuldades: "O que pegou", tempo: "Tempo sem dirigir", objetivo: "Quero treinar", carro: "Onde treinar" };
  var QTD_INICIAL = { zero: 10, habilitado: 4, reprovei: 2 };

  function perguntaCategoria(c) {
    var rot = "Qual categoria?";
    var nomes = CAT_ROTULO;
    if (c.id === "habilitado") rot = "O que você quer voltar a dirigir?";
    if (c.id === "adicao") { rot = "Qual categoria você quer adicionar?"; nomes = { A: "Moto (já tenho a B)", B: "Carro (já tenho a A)" }; }
    if (c.id === "aluguel") rot = "Para qual prova?";
    if (c.id === "prova-marcada" || c.id === "reprovei") rot = "A prova é de quê?";
    return { id: "cat", tipo: "radio", rotulo: rot, obrigatoria: true, opcoes: c.categorias.map(function (k) { return [k, nomes[k]]; }) };
  }

  function htmlPergunta(p, prefixo) {
    var nome = prefixo + p.id;
    var ped = p.servico && S[p.servico] !== true ? " data-pendente" : "";
    if (p.tipo === "data" || p.tipo === "texto") {
      return '<div class="campo"' + ped + '><label for="' + nome + '">' + esc(p.rotulo) + marca(p.servico) + "</label>" +
        '<input type="' + (p.tipo === "data" ? "date" : "text") + '" id="' + nome + '" name="' + nome + '" maxlength="80"' + (p.placeholder ? ' placeholder="' + esc(p.placeholder) + '"' : "") + "></div>";
    }
    var tipo = p.tipo === "multi" ? "checkbox" : "radio";
    return '<fieldset class="campo"' + ped + "><legend>" + esc(p.rotulo) + marca(p.servico) + (p.obrigatoria ? "" : ' <span class="campo__ajuda">(opcional)</span>') + "</legend>" +
      '<div class="opcoes">' + p.opcoes.map(function (o) {
        return '<label class="opcao' + (p.opcoes.length > 3 || p.tipo === "multi" ? "" : "") + '"><input type="' + tipo + '" name="' + nome + '" value="' + esc(o[0]) + '" data-rotulo="' + esc(o[1]) + '"><span>' + esc(o[1]) + "</span></label>";
      }).join("") + "</div></fieldset>";
  }

  /* ================= Versão curta (home) ================= */
  $$("[data-orc-rapido]").forEach(function (form) {
    var link = $("[data-orc-enviar]", form), previa = $("[data-orc-previa]", form), mais = $("[data-orc-mais]", form);
    function atualizar() {
      var c = $('input[name="r-caso"]:checked', form), k = $('input[name="r-cat"]:checked', form);
      var l = ["Olá! Vim pelo site da Auto Escola Grajaú e quero um orçamento."];
      if (c) l.push("Meu caso: " + c.getAttribute("data-rotulo"));
      if (k) l.push("Categoria: " + CAT_MSG[k.value]);
      var m = l.join("\n");
      link.href = whats(m);
      if (previa) previa.textContent = m;
      if (mais) mais.href = mais.getAttribute("data-base-href") + "?caso=" + (c ? c.value : "") + (k ? "&cat=" + k.value : "");
    }
    form.addEventListener("change", atualizar);
    form.addEventListener("submit", function (e) { e.preventDefault(); window.open(link.href, "_blank", "noopener"); });
    atualizar();
  });

  /* ================= Formulário completo ================= */
  var form = $("[data-orc]");
  if (!form) return;

  var passos = $$(".passo", form), barras = $$(".passos__item", form);
  var erro = $("[data-orc-erro]", form);
  var boxPerg = $("[data-perguntas]", form), boxOpc = $("[data-opcoes-preco]", form);
  var boxQtd = $("[data-qtd-bloco]", form), qtdIn = $('input[name="qtd"]', form), qtdOut = $("output", boxQtd);
  var estim = $("[data-orc-estimativa]", form), previa = $("[data-orc-previa]", form), enviar = $("[data-orc-enviar]", form);
  var atual = 0, casoAtual = null, catAtual = null;

  function casoSel() { var r = $('input[name="caso"]:checked', form); return r ? caso(r.value) : null; }
  function marcado(n) { return $('input[name="' + n + '"]:checked', form); }
  function marcados(n) { return $$('input[name="' + n + '"]:checked', form); }

  /* --- passo 2: perguntas do caso --- */
  function montarPerguntas() {
    var c = casoSel();
    if (!c) return;
    if (casoAtual && casoAtual.id === c.id) return;
    casoAtual = c;
    var lista = (c.categorias.length > 1 ? [perguntaCategoria(c)] : []).concat((c.perguntas || []).filter(function (p) { return visivel(p.servico); }));
    boxPerg.innerHTML = lista.map(function (p) { return htmlPergunta(p, "p-"); }).join("");
    $$("[data-caso-nome]", form).forEach(function (el) { el.textContent = c.titulo; });
    if (c.categorias.length === 1) catAtual = c.categorias[0];
    var catUrl = param("cat");
    if (catUrl) { var r = $('input[name="p-cat"][value="' + catUrl.toUpperCase() + '"]', form); if (r) r.checked = true; }
    montarOpcoes();
  }

  function categoria() {
    if (!casoAtual) return null;
    if (casoAtual.categorias.length === 1) return casoAtual.categorias[0];
    var r = marcado("p-cat"); return r ? r.value : null;
  }

  /* --- passo 3: opções de preço, filtradas pela categoria --- */
  function opcoesValidas() {
    var c = casoAtual, k = categoria();
    if (!c) return [];
    return c.sugestoes.map(item).filter(function (i) {
      if (!i || !visivel(i.servico)) return false;
      if (!k) return true;
      if (k === "AB") return i.categorias.indexOf("A") > -1 && i.categorias.indexOf("B") > -1;
      return i.categorias.indexOf(k) > -1;
    });
  }
  function montarOpcoes() {
    var k = categoria();
    if (boxOpc.getAttribute("data-chave") === (casoAtual ? casoAtual.id : "") + "|" + k) return;
    boxOpc.setAttribute("data-chave", (casoAtual ? casoAtual.id : "") + "|" + k);
    var lista = opcoesValidas();
    var url = param("opcao");
    boxOpc.innerHTML = '<fieldset class="campo"><legend class="sr-only">Opções</legend><div class="opcoes">' +
      lista.map(function (i, n) {
        var preco = typeof i.preco === "number" ? brl(i.preco) + (i.unidade ? '<small style="display:block;font-family:var(--f-texto);font-size:.72rem;font-weight:600;text-align:right">' + esc(i.unidade) + "</small>" : "") : "Sob consulta";
        var sel = url ? url === i.id : n === 0;
        return '<label class="opcao opcao--bloco"><input type="radio" name="opcao" value="' + i.id + '"' + (sel ? " checked" : "") + '><span><span class="opcao__info"><strong>' + esc(i.nome) + (i.detalhe ? " · " + esc(i.detalhe) : "") + (n === 0 ? ' <span class="tag tag--ouro" style="margin-left:4px">Indicado</span>' : "") + marca(i.servico) + "</strong><small>" + esc(i.resumo || "") + "</small></span>" +
          '<span class="opcao__preco">' + preco + "</span></span></label>";
      }).join("") +
      '<label class="opcao opcao--bloco"><input type="radio" name="opcao" value="indicacao"' + (lista.length ? "" : " checked") + '><span><span class="opcao__info"><strong>Ainda não sei</strong><small>Quero que o instrutor indique o melhor para o meu caso.</small></span></span></label>' +
      "</div></fieldset>";
    qtdIn.value = QTD_INICIAL[casoAtual && casoAtual.id] || 2; qtdOut.textContent = qtdIn.value;
    blocoQtd();
  }
  function opcaoSel() { var r = marcado("opcao"); return r && r.value !== "indicacao" ? item(r.value) : null; }
  function blocoQtd() { var i = opcaoSel(); boxQtd.hidden = !(i && i.quantidade); }

  $$("[data-delta]", boxQtd).forEach(function (b) {
    b.addEventListener("click", function () {
      var v = Math.max(1, Math.min(40, (parseInt(qtdIn.value, 10) || 1) + parseInt(b.getAttribute("data-delta"), 10)));
      qtdIn.value = v; qtdOut.textContent = v; resumo();
    });
  });

  /* --- resumo, estimativa e mensagem --- */
  function dataBR(v) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ""); return m ? m[3] + "/" + m[2] + "/" + m[1] : v; }
  function respostas() {
    var out = [];
    if (!casoAtual) return out;
    (casoAtual.perguntas || []).filter(function (p) { return visivel(p.servico); }).forEach(function (p) {
      var n = "p-" + p.id, v = "";
      if (p.tipo === "radio") { var r = marcado(n); v = r ? r.getAttribute("data-rotulo") : ""; }
      else if (p.tipo === "multi") v = marcados(n).map(function (x) { return x.getAttribute("data-rotulo"); }).join(", ");
      else { var i = $('[name="' + n + '"]', form); v = i ? (p.tipo === "data" ? dataBR(i.value) : i.value.trim().slice(0, 80)) : ""; }
      if (v) out.push([p.msg || MSG[p.id] || p.rotulo, v]);
    });
    return out;
  }

  function calculo() {
    var i = opcaoSel();
    if (!i) return null;
    var q = i.quantidade ? (parseInt(qtdIn.value, 10) || 1) : 1;
    return { item: i, qtd: q, total: typeof i.preco === "number" ? i.preco * q : null };
  }

  function mensagem() {
    var l = ["Olá! Vim pelo site da Auto Escola Grajaú e quero um orçamento."];
    if (casoAtual) l.push("Meu caso: " + casoAtual.titulo + (casoAtual.subtitulo ? " (" + casoAtual.subtitulo.charAt(0).toLowerCase() + casoAtual.subtitulo.slice(1) + ")" : ""));
    var k = categoria(); if (k) l.push("Categoria: " + CAT_MSG[k]);
    respostas().forEach(function (r) { l.push(r[0] + ": " + r[1]); });
    var cal = calculo(), op = marcado("opcao");
    if (cal) l.push("Interesse: " + (cal.item.quantidade ? cal.qtd + "x " : "") + cal.item.nome + (cal.item.detalhe ? " (" + cal.item.detalhe + ")" : "") + (cal.total != null ? " · " + brl(cal.total) : " · sob consulta"));
    else if (op && op.value === "indicacao") l.push("Interesse: quero uma indicação do instrutor");
    var nome = $("#nome", form).value.trim().replace(/\s+/g, " ").slice(0, 40);
    var bairro = $("#bairro", form).value.trim().slice(0, 50);
    var per = marcados("periodo").map(function (x) { return x.getAttribute("data-rotulo"); });
    if (nome) l.push("Nome: " + nome);
    if (bairro) l.push("Bairro: " + bairro);
    if (per.length) l.push("Melhor horário: " + per.join(", "));
    return l.join("\n");
  }

  /* exames e taxas pagos à parte (config > planos.taxasAParte) */
  var TAXAS = ((C.planos && C.planos.taxasAParte) || []).reduce(function (s, t) { return s + (typeof t.valor === "number" ? t.valor : 0); }, 0);
  function notaTaxas() {
    var id = casoAtual && casoAtual.id;
    if (id === "habilitado") return "";
    if ((id === "zero" || id === "ja-dirijo") && TAXAS) return "<small>Exames e taxas da CNH, pagos à parte: <strong style=\"display:inline;font-size:inherit;font-family:inherit\">" + brl(TAXAS) + "</strong> (médico, psicotécnico, toxicológico, exame teórico e emissão).</small>";
    return "<small>Exames e taxas do Detran-SP são pagos à parte.</small>";
  }

  function resumo() {
    blocoQtd();
    var cal = calculo();
    if (estim) {
      if (cal && cal.total != null) {
        var cortesia = (cal.item.inclui || []).filter(function (t) { return /cortesia/i.test(t); })[0];
        estim.innerHTML = "<span>Valor estimado</span><small>" + (cal.item.quantidade ? cal.qtd + " × " : "") + esc(cal.item.nome) + "</small><strong>" + brl(cal.total) + "</strong>" +
          (cortesia ? "<small>" + esc(cortesia) + ".</small>" : "") +
          notaTaxas() + "<small>Valor confirmado pelo WhatsApp.</small>";
      } else if (cal) {
        estim.innerHTML = "<span>Valor</span><strong>Sob consulta</strong><small>O instrutor responde pelo WhatsApp com o valor do seu caso.</small>";
      } else {
        estim.innerHTML = "<span>Valor</span><strong>A combinar</strong><small>O instrutor indica a melhor opção e o valor pelo WhatsApp.</small>";
      }
    }
    var m = mensagem();
    if (previa) previa.textContent = m;
    if (enviar) enviar.href = whats(m);
  }

  /* --- navegação entre passos --- */
  function mostrar(i, foco) {
    atual = Math.max(0, Math.min(passos.length - 1, i));
    if (atual >= 1) montarPerguntas();
    if (atual >= 2) montarOpcoes();
    passos.forEach(function (p, k) { p.classList.toggle("ativo", k === atual); p.hidden = k !== atual; });
    barras.forEach(function (b, k) { b.classList.toggle("feito", k < atual); b.classList.toggle("atual", k === atual); });
    $$("[data-passo-num]", form).forEach(function (el) { el.textContent = (atual + 1) + " de " + passos.length; });
    $$("[data-voltar]", form).forEach(function (b) { b.hidden = atual === 0; });
    $$("[data-proximo]", form).forEach(function (b) { b.hidden = atual === passos.length - 1; });
    erro.textContent = "";
    if (foco !== false) {
      var h = $("h2", passos[atual]);
      if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      var topo = form.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > topo) window.scrollTo({ top: topo });
    }
    resumo();
  }

  function falha(msg, alvo) { erro.textContent = msg; if (alvo) alvo.focus(); return false; }
  function validar() {
    var p = passos[atual], tipo = p.getAttribute("data-passo");
    if (tipo === "caso") return casoSel() ? true : falha("Escolha o seu caso para continuar.", $('input[name="caso"]', form));
    if (tipo === "perguntas") {
      if (casoAtual.categorias.length > 1 && !marcado("p-cat")) return falha("Escolha a categoria.", $('input[name="p-cat"]', form));
      var faltando = (casoAtual.perguntas || []).filter(function (q) { return q.obrigatoria && visivel(q.servico) && q.tipo === "radio" && !marcado("p-" + q.id); })[0];
      if (faltando) return falha("Responda: " + faltando.rotulo, $('input[name="p-' + faltando.id + '"]', form));
      return true;
    }
    if (tipo === "opcao") return marcado("opcao") ? true : falha("Escolha uma opção (ou \"Ainda não sei\").");
    if (tipo === "voce") {
      var n = $("#nome", form);
      if (n.value.trim().length < 2) return falha("Digite seu nome para o instrutor saber com quem está falando.", n);
      return true;
    }
    return true;
  }

  $$("[data-proximo]", form).forEach(function (b) { b.addEventListener("click", function () { if (validar()) mostrar(atual + 1); }); });
  $$("[data-voltar]", form).forEach(function (b) { b.addEventListener("click", function () { mostrar(atual - 1); }); });
  $$("[data-trocar-caso]", form).forEach(function (b) { b.addEventListener("click", function () { mostrar(0); }); });

  form.addEventListener("change", function (e) {
    var n = e.target.name;
    if (n === "caso") { casoAtual = null; boxOpc.removeAttribute("data-chave"); montarPerguntas(); if (atual === 0) setTimeout(function () { if (validar()) mostrar(1); }, 180); }
    if (n === "p-cat") montarOpcoes();
    resumo();
  });
  form.addEventListener("input", resumo);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (atual < passos.length - 1) { if (validar()) mostrar(atual + 1); return; }
    window.open(enviar.href, "_blank", "noopener");
  });
  $$('input[type="text"]', form).forEach(function (i) {
    i.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); if (validar()) mostrar(atual + 1); } });
  });

  /* esconde períodos de serviços não confirmados */
  $$("[data-servico-periodo]", form).forEach(function (el) {
    var s = el.getAttribute("data-servico-periodo");
    if (!visivel(s)) el.remove();
    else if (S[s] !== true) { el.setAttribute("data-pendente", ""); $("span", el).insertAdjacentHTML("beforeend", ' <span class="pendente">[confirmar]</span>'); }
  });
  /* casos de serviços não confirmados */
  $$('input[name="caso"]', form).forEach(function (r) {
    var c = caso(r.value);
    if (c && !visivel(c.servico)) r.closest(".opcao").remove();
  });

  /* entrada pela URL: /orcamento/?caso=reprovei&cat=B */
  var cu = param("caso");
  var r0 = cu ? $('input[name="caso"][value="' + cu + '"]', form) : null;
  passos.forEach(function (p, k) { p.hidden = k !== 0; });
  if (r0) { r0.checked = true; montarPerguntas(); mostrar(1, false); }
  else mostrar(0, false);
})();
