/* Auto Escola Grajaú — script comum a todas as páginas.
   Lê data/config.js (window.GRAJAU) e liga contatos, WhatsApp,
   menu, preços, vídeos, YouTube, mapa e FAQ. */
(function () {
  "use strict";

  var C = window.GRAJAU || {};
  var APROVADOS = window.GRAJAU_APROVADOS || [];
  var doc = document;
  var base = (doc.body && doc.body.getAttribute("data-base")) || "./";
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  doc.documentElement.classList.add("js");

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function brl(v) {
    if (typeof v !== "number") return "";
    var inteiro = Math.round(v * 100) % 100 === 0;
    return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: inteiro ? 0 : 2, maximumFractionDigits: 2 });
  }
  var PEND = function (t) { return ' <span class="pendente" data-pendente>[' + esc(t) + "]</span>"; };

  /* ---------- WhatsApp ---------- */
  function linkWhats(msg) {
    var num = (C.whatsapp && C.whatsapp.numero) || "5511926324474";
    var texto = msg || (C.whatsapp && C.whatsapp.mensagemPadrao) || "Olá! Vim pelo site e quero um orçamento.";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(texto);
  }
  window.GrajauWhats = linkWhats;
  window.GrajauBRL = brl;

  function prepararWhats() {
    $$("[data-wa]").forEach(function (a) {
      a.href = linkWhats(a.getAttribute("data-wa") || null);
      a.target = "_blank"; a.rel = "noopener";
    });
  }

  /* ---------- Contatos e textos vindos do config ---------- */
  function preencher() {
    var tels = C.telefones || [];
    $$("[data-tel]").forEach(function (a) {
      var t = tels[parseInt(a.getAttribute("data-tel"), 10) || 0];
      if (!t) { a.remove(); return; }
      a.href = "tel:" + t.numero;
      if (a.hasAttribute("data-tel-fixo")) return;
      var alvo = $("[data-tel-texto]", a) || a;
      alvo.textContent = t.rotulo;
    });
    $$("[data-whats-rotulo]").forEach(function (el) { if (C.whatsapp) el.textContent = C.whatsapp.rotulo; });

    var e = C.endereco || {};
    $$("[data-endereco]").forEach(function (el) {
      var l2 = [e.bairro, (e.cidade || "") + " - " + (e.uf || "")].filter(Boolean).join(", ");
      el.innerHTML = esc(e.rua) + "<br>" + esc(l2) + (e.cep ? " · <span style=\"white-space:nowrap\">CEP " + esc(e.cep) + "</span>" : PEND("CLIENTE INFORMAR CEP"));
    });
    var busca = encodeURIComponent(e.busca || (e.rua + ", " + e.cidade));
    $$("[data-maps]").forEach(function (a) { a.href = "https://www.google.com/maps/search/?api=1&query=" + busca; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-waze]").forEach(function (a) { a.href = "https://waze.com/ul?q=" + busca + "&navigate=yes"; a.target = "_blank"; a.rel = "noopener"; });

    $$("[data-instagram]").forEach(function (a) { if (C.instagram) { a.href = C.instagram.url; a.target = "_blank"; a.rel = "noopener"; } });
    $$("[data-youtube]").forEach(function (a) { if (C.youtube) { a.href = C.youtube.url; a.target = "_blank"; a.rel = "noopener"; } });

    $$("[data-horarios]").forEach(function (el) {
      var h = C.horarios || [];
      el.innerHTML = h.length
        ? h.map(function (x) { return esc(x.dias) + ": " + esc(x.horas); }).join("<br>")
        : "Horários e dias flexíveis: combine pelo WhatsApp.";
    });

    $$("[data-regioes]").forEach(function (el) {
      var lista = C.regioes || [];
      if (!lista.length) { el.textContent = "Grajaú e região"; return; }
      el.innerHTML = '<ul class="regioes"' + (C.regioesConfirmadas ? "" : " data-pendente") + ">" +
        lista.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" +
        (C.regioesConfirmadas ? "" : (C.modoRascunho ? PEND("CONFIRMAR bairros atendidos") : "Grajaú e bairros vizinhos da Zona Sul."));
    });

    $$("[data-pagamento]").forEach(function (el) {
      if (C.formasPagamento) el.textContent = C.formasPagamento;
      else { el.innerHTML = "Combine pelo WhatsApp." + PEND("CLIENTE INFORMAR formas de pagamento"); }
    });
    $$("[data-duracao]").forEach(function (el) {
      if (C.duracaoAula) el.textContent = C.duracaoAula;
      else el.innerHTML = "consulte" + PEND("CLIENTE INFORMAR duração da aula");
    });
    $$("[data-instrutor]").forEach(function (el) {
      var i = C.instrutor || {};
      if (i.nome) el.textContent = i.nome + (i.experiencia ? ", " + i.experiencia : "");
      else el.innerHTML = PEND("CLIENTE INFORMAR nome do instrutor e tempo de experiência");
    });
    $$("[data-cnpj]").forEach(function (el) {
      var p = [];
      if (C.cnpj) p.push("CNPJ " + esc(C.cnpj));
      if (C.credenciamentoDetran) p.push("Instrutor credenciado Detran-SP nº " + esc(C.credenciamentoDetran));
      el.innerHTML = p.length ? p.join(" · ") : PEND("CLIENTE INFORMAR nº de credenciamento no Detran-SP e CNPJ");
    });
    $$("[data-ano]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$("[data-regras-data]").forEach(function (el) { el.textContent = C.regrasAtualizadasEm || ""; });
  }

  /* ---------- Preços (texto solto com data-preco="id") ---------- */
  function precos() {
    var itens = (C.planos && C.planos.itens) || [];
    var mapa = {};
    itens.forEach(function (i) { mapa[i.id] = i; });
    $$("[data-preco]").forEach(function (el) {
      var i = mapa[el.getAttribute("data-preco")];
      if (i && typeof i.preco === "number") el.textContent = brl(i.preco);
    });
  }

  /* ---------- Serviços opcionais (true / false / null) ---------- */
  function servicos() {
    var s = C.servicos || {};
    $$("[data-servico]").forEach(function (el) {
      var v = s[el.getAttribute("data-servico")];
      if (v === true) return;
      if (v === false) { el.remove(); return; }
      el.setAttribute("data-pendente", "");
      if (el.hasAttribute("data-sem-marca")) return;
      var alvo = el.matches(".opcao") ? (el.querySelector("input + span") || el) : el;
      alvo.insertAdjacentHTML("beforeend", ' <span class="pendente">[confirmar]</span>');
    });
  }

  function rascunho() {
    if (C.modoRascunho) doc.body.classList.add("rascunho");
  }

  /* ---------- Topo e menu ---------- */
  function topo() {
    var t = $(".topo");
    if (t) {
      var on = function () { t.classList.toggle("rolou", window.scrollY > 8); };
      on(); window.addEventListener("scroll", on, { passive: true });
    }
    var btn = $(".menu-btn"), menu = $("#menu-mobile");
    if (!btn || !menu) return;
    /* o menu fica no DOM (para animar) e fica inerte enquanto fechado */
    menu.hidden = false; menu.inert = true;
    var aberto = false;
    function fechar(foco) {
      aberto = false;
      btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "Abrir menu");
      menu.classList.remove("aberto"); menu.inert = true; doc.body.classList.remove("menu-aberto");
      if (foco) btn.focus();
    }
    function abrir() {
      aberto = true;
      btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-label", "Fechar menu");
      menu.inert = false; menu.classList.add("aberto"); doc.body.classList.add("menu-aberto");
      menu.scrollTop = 0;
      setTimeout(function () { var p = $(".menu__lista a", menu); if (p && aberto) p.focus({ preventScroll: true }); }, reduz ? 0 : 350);
    }
    btn.addEventListener("click", function () { aberto ? fechar(false) : abrir(); });
    doc.addEventListener("keydown", function (e) {
      if (!aberto) return;
      if (e.key === "Escape") { fechar(true); return; }
      if (e.key !== "Tab") return;
      /* foco circula entre o botão de fechar e os itens do menu */
      var itens = [btn].concat($$("a, button", menu));
      var i = itens.indexOf(doc.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); itens[itens.length - 1].focus(); }
      else if (!e.shiftKey && i === itens.length - 1) { e.preventDefault(); itens[0].focus(); }
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { fechar(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1060 && menu.classList.contains("aberto")) fechar(false); });
  }

  function revelar() {
    var els = $$(".revelar");
    if (!("IntersectionObserver" in window) || reduz) { els.forEach(function (el) { el.classList.add("visivel"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("visivel"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Vídeo do topo: só carrega depois da página ---------- */
  function videoHero() {
    var v = $("[data-hero-video]");
    if (!v) return;
    var economia = navigator.connection && navigator.connection.saveData;
    if (reduz || economia) return;            /* fica só a capa */
    window.addEventListener("load", function () {
      setTimeout(function () {
        v.src = v.getAttribute("data-hero-video");
        v.muted = true;
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      }, 300);
    });
  }

  /* ---------- Reels: botão de play grande, um vídeo por vez ---------- */
  function reels() {
    var todos = $$(".reel video");
    $$(".reel").forEach(function (fig) {
      var v = $("video", fig), b = $(".reel__play", fig);
      if (!v || !b) return;
      b.addEventListener("click", function () {
        todos.forEach(function (o) { if (o !== v) o.pause(); });
        v.controls = true; b.hidden = true;
        var p = v.play(); if (p && p.catch) p.catch(function () {});
        v.focus();
      });
      v.addEventListener("play", function () { todos.forEach(function (o) { if (o !== v) o.pause(); }); });
    });
  }

  /* ---------- YouTube: só carrega o player depois do clique ---------- */
  function youtube() {
    $$("[data-yt]").forEach(function (box) {
      var b = $("button", box); if (!b) return;
      b.addEventListener("click", function () {
        var id = box.getAttribute("data-yt");
        box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0" title="' + esc(box.getAttribute("data-yt-titulo") || "Vídeo no YouTube") + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      });
    });
  }

  /* ---------- Mapa sob clique ---------- */
  function mapa() {
    $$("[data-mapa]").forEach(function (el) {
      var b = $("button", el); if (!b) return;
      b.addEventListener("click", function () {
        var q = encodeURIComponent((C.endereco && C.endereco.busca) || "Av. Dona Belmira Marin, 4772, São Paulo");
        el.innerHTML = '<iframe title="Mapa: Auto Escola Grajaú" src="https://www.google.com/maps?q=' + q + '&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
      });
    });
  }

  /* ---------- FAQ que depende da escola ---------- */
  function faqEscola() {
    $$("[data-faq-escola]").forEach(function (el) {
      var cats = el.getAttribute("data-faq-escola").split(" ");
      var existentes = $$("summary", el).map(function (s) { return s.textContent.trim(); });
      var html = (C.faqEscola || []).filter(function (q) {
        return cats.indexOf(q.categoria) > -1 && existentes.indexOf(q.pergunta) === -1;
      }).map(function (q) {
        var r = (q.resposta || "").trim();
        return "<details" + (r ? "" : " data-pendente") + "><summary>" + esc(q.pergunta) + "</summary>" +
          '<div class="faq__resp"><p>' + (r ? esc(r) : '<span class="pendente">[CLIENTE INFORMAR] Só aparece no site depois da resposta.</span>') + "</p></div></details>";
      }).join("");
      el.insertAdjacentHTML("beforeend", html);
    });
  }

  /* ---------- Fotos de aprovados (data/aprovados.js) ---------- */
  function mural() {
    $$("[data-mural]").forEach(function (el) {
      var bloco = el.closest("[data-mural-bloco]");
      var cat = el.getAttribute("data-cat");
      var lista = APROVADOS.filter(function (f) { return !cat || f.categoria === cat; }).slice(0, 16);
      if (!lista.length) { if (bloco && !C.modoRascunho) bloco.remove(); return; }
      $$("[data-mural-vazio]").forEach(function (n) { n.remove(); });
      var dir = base + "assets/img/aprovados/";
      el.innerHTML = lista.map(function (f) {
        return '<figure class="foto-placa"><span class="foto-placa__faixa" aria-hidden="true">BRASIL</span><span class="foto-placa__img"><picture>' +
          '<source srcset="' + dir + f.id + '.webp" type="image/webp"><img src="' + dir + f.id + '.jpg" width="' + f.w + '" height="' + f.h + '" loading="lazy" decoding="async" alt="' +
          esc(f.alt || ("Aluno aprovado na categoria " + f.categoria + " com a Auto Escola Grajaú")) + '"></picture></span>' +
          '<figcaption class="foto-placa__rotulo">APROVADO <span class="foto-placa__cat">CAT ' + esc(f.categoria) + "</span></figcaption></figure>";
      }).join("");
    });
  }

  function tabelas() {
    $$(".tabela-wrap table").forEach(function (t) {
      var cab = $$("thead th", t).map(function (th) { return th.textContent.trim(); });
      $$("tbody tr", t).forEach(function (tr) { $$("td", tr).forEach(function (td, k) { if (cab[k]) td.setAttribute("data-rotulo", cab[k]); }); });
    });
  }

  function iniciar() {
    tabelas();
    /* sem animação: o carrinho do mapa fica parado na saída */
    if (reduz) $$("animateMotion").forEach(function (a) { a.parentNode.setAttribute("transform", "translate(30 250)"); a.remove(); });
    rascunho();
    preencher();
    precos();
    servicos();
    prepararWhats();
    topo();
    videoHero();
    reels();
    youtube();
    mapa();
    faqEscola();
    mural();
    revelar();
    doc.dispatchEvent(new CustomEvent("grajau:pronto"));
  }
  /* espera os outros scripts (orcamento.js...) montarem a página */
  if (doc.readyState === "complete") iniciar();
  else doc.addEventListener("DOMContentLoaded", iniciar);
})();
