/* "Monte sua placa de APROVADO": gera a imagem 1080×1350 em canvas
   (preto e dourado da Grajaú). A imagem é feita no aparelho da pessoa. */
(function () {
  "use strict";
  var form = document.querySelector("[data-gerador]");
  if (!form) return;

  var canvas = form.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var input = form.querySelector("#nome-placa");
  var erro = form.querySelector("[data-gerador-erro]");
  var btnBaixar = form.querySelector("[data-baixar]");
  var btnCompartilhar = form.querySelector("[data-compartilhar]");
  var btnWhats = form.querySelector("[data-gerador-whats]");
  var base = document.body.getAttribute("data-base") || "./";
  var W = 1080, H = 1350, MAX = 14;
  var FONTE = '"Barlow Condensed", "Arial Narrow", Arial, sans-serif';
  var logo = new Image();
  logo.src = base + "assets/img/logo-grajau.png";
  logo.onload = function () { atualizar(); };

  /* ---------- filtro simples de palavrões ---------- */
  var TRECHOS = ["caralh", "porra", "merda", "buceta", "boceta", "foder", "fuder", "fodid", "arromb", "cacete", "piroca", "punhet", "xoxot", "xerec", "vagabund", "otari", "babaca", "bosta", "cuzao", "viado", "puta", "puto", "hitler", "nazis", "corno", "vadia"];
  var EXATAS = ["cu", "foda", "pau", "pica", "fdp", "pqp", "vsf", "tnc", "krl", "prr", "vtnc", "bct", "rola", "kct", "bunda"];
  var LIBERADOS = ["corneli"];
  function colapsar(p) { return p.replace(/(.)\1+/g, "$1"); }
  TRECHOS = TRECHOS.map(colapsar); EXATAS = EXATAS.map(colapsar);
  function normalizar(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[@4]/g, "a").replace(/3/g, "e").replace(/[1!]/g, "i").replace(/0/g, "o").replace(/\$|5/g, "s").replace(/(.)\1+/g, "$1");
  }
  function proibido(nome) {
    var n = normalizar(nome), junto = n.replace(/[^a-z]/g, "");
    if (n.split(/[^a-z]+/).filter(Boolean).some(function (p) { return EXATAS.indexOf(p) > -1; })) return true;
    if (LIBERADOS.some(function (l) { return junto.indexOf(l) > -1; })) return false;
    return TRECHOS.some(function (p) { return junto.indexOf(p) > -1; });
  }
  function limpar(v) { return (v || "").replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' \-]/g, "").replace(/\s{2,}/g, " ").slice(0, MAX); }

  /* ---------- desenho ---------- */
  function rr(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function largura(txt, esp) { return ctx.measureText(txt).width + esp * Math.max(0, txt.length - 1); }
  function caber(txt, peso, tam, max, esp) {
    ctx.font = peso + " " + tam + "px " + FONTE;
    while (largura(txt, esp * tam) > max && tam > 20) { tam -= 4; ctx.font = peso + " " + tam + "px " + FONTE; }
    return tam;
  }
  function espacado(txt, cx, y, esp) {
    var x = cx - largura(txt, esp) / 2; ctx.textAlign = "left";
    for (var i = 0; i < txt.length; i++) { ctx.fillText(txt[i], x, y); x += ctx.measureText(txt[i]).width + esp; }
  }
  function ouro(y0, y1) {
    var g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, "#FBE29A"); g.addColorStop(.5, "#E2B24C"); g.addColorStop(1, "#B27B1F");
    return g;
  }
  function bandeira(x, y, w, h) {
    ctx.fillStyle = "#1C9A4B"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#FFD200"; ctx.beginPath(); ctx.moveTo(x + w / 2, y + h * .1); ctx.lineTo(x + w * .92, y + h / 2); ctx.lineTo(x + w / 2, y + h * .9); ctx.lineTo(x + w * .08, y + h / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#123E8C"; ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, h * .24, 0, Math.PI * 2); ctx.fill();
  }

  function desenhar(semNome) {
    var nome = semNome ? "" : limpar(input.value).trim();
    var genero = (form.querySelector('input[name="genero"]:checked') || {}).value || "APROVADO";

    /* fundo preto com brilho dourado */
    ctx.fillStyle = "#0B0B0C"; ctx.fillRect(0, 0, W, H);
    var rg = ctx.createRadialGradient(W / 2, 260, 40, W / 2, 260, 700);
    rg.addColorStop(0, "rgba(217,169,58,.28)"); rg.addColorStop(1, "rgba(217,169,58,0)");
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

    /* moldura dourada */
    ctx.strokeStyle = ouro(0, H); ctx.lineWidth = 6; rr(28, 28, W - 56, H - 56, 30); ctx.stroke();

    /* logo */
    if (logo.complete && logo.naturalWidth) {
      var lw = 330, lh = lw * logo.naturalHeight / logo.naturalWidth;
      ctx.drawImage(logo, (W - lw) / 2, 70, lw, lh);
    } else {
      ctx.fillStyle = ouro(80, 220); ctx.font = "800 96px " + FONTE; ctx.textBaseline = "alphabetic";
      espacado("GRAJAÚ", W / 2, 230, 10);
    }

    /* placa */
    var pw = 900, ph = Math.round(pw * 130 / 400), px = (W - pw) / 2, py = 400;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
    ctx.fillStyle = ouro(py, py + ph); rr(px - 14, py - 14, pw + 28, ph + 28, 46); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#1C1F24"; rr(px, py, pw, ph, 36); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(px + 9, py + 9, pw - 18, ph - 18, 28); ctx.fill();
    ctx.save(); rr(px + 9, py + 9, pw - 18, ph - 18, 28); ctx.clip();
    var fh = Math.round(ph * .24);
    ctx.fillStyle = "#0A3C8C"; ctx.fillRect(px, py, pw, fh + 9); ctx.restore();
    ctx.fillStyle = "#FFFFFF"; ctx.font = "700 " + Math.round(fh * .72) + "px " + FONTE; ctx.textBaseline = "middle";
    espacado("BRASIL", W / 2, py + 9 + fh / 2 + 2, 22);
    ctx.font = "700 " + Math.round(fh * .5) + "px " + FONTE; ctx.textAlign = "left"; ctx.fillText("BR", px + 40, py + 9 + fh / 2 + 2);
    bandeira(px + pw - 40 - 64, py + 9 + fh * .2, 64, fh * .62);
    ctx.fillStyle = "#1C1F24";
    var cy = py + 9 + fh, ch = ph - 18 - fh;
    var tam = caber(genero, "800", Math.round(ch * .86), pw - 110, .04);
    espacado(genero, W / 2, cy + ch / 2 + tam * .05, tam * .04);

    /* nome */
    ctx.textBaseline = "alphabetic";
    if (nome) {
      ctx.fillStyle = "#BEB8AC"; ctx.font = "600 44px " + FONTE; espacado("ESSA PLACA TEM DONO:", W / 2, 800, 6);
      var up = nome.toLocaleUpperCase("pt-BR");
      var tn = caber(up, "800", 210, W - 160, .02);
      ctx.fillStyle = ouro(830, 830 + tn); espacado(up, W / 2, 830 + tn * .82, tn * .02);
    } else {
      ctx.fillStyle = "#7E796F"; ctx.font = "700 64px " + FONTE; espacado("DIGITE SEU NOME", W / 2, 920, 6);
    }

    /* estrada */
    var ey = 1080;
    ctx.fillStyle = "#1E1E22"; ctx.fillRect(34, ey, W - 68, 110);
    ctx.fillStyle = "#FFC300"; for (var d = 40; d < W - 60; d += 130) ctx.fillRect(d, ey + 50, 80, 10);

    /* rodapé */
    ctx.fillStyle = "#FFFFFF"; ctx.font = "800 52px " + FONTE; espacado("SEU SONHO DE DIRIGIR COMEÇA AQUI.", W / 2, 1258, 1);
    ctx.fillStyle = ouro(1270, 1300); ctx.font = "700 34px " + FONTE; espacado("@AUTOESCOLAGRAJAU", W / 2, 1306, 4);
  }

  function nomeArquivo() {
    var n = limpar(input.value).trim().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]+/g, "-").toLowerCase();
    return "placa-aprovado-grajau" + (n ? "-" + n : "") + ".png";
  }
  function validar() {
    var v = limpar(input.value);
    if (v !== input.value) input.value = v;
    if (v.trim() && proibido(v)) { erro.textContent = "Esse nome não pode ir na placa. Tente outro."; input.setAttribute("aria-invalid", "true"); return false; }
    erro.textContent = ""; input.removeAttribute("aria-invalid"); return true;
  }
  function atualizar() {
    var ok = validar();
    desenhar(!ok);
    var nome = ok ? limpar(input.value).trim() : "";
    if (btnWhats && window.GrajauWhats) btnWhats.href = window.GrajauWhats("Olá! Fiz minha placa de APROVADO no site" + (nome ? " (" + nome + ")" : "") + " e quero começar minhas aulas. Pode me passar um orçamento?");
    btnBaixar.disabled = !ok || !nome;
    if (btnCompartilhar) btnCompartilhar.disabled = !ok || !nome;
  }
  function comBlob(fn) { canvas.toBlob(function (b) { if (b) fn(b); }, "image/png"); }

  btnBaixar.addEventListener("click", function () {
    if (!validar()) return;
    desenhar();
    comBlob(function (blob) {
      var url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = nomeArquivo(); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    });
  });
  if (btnCompartilhar) {
    var pode = false;
    try { pode = !!(navigator.canShare && navigator.canShare({ files: [new File([""], "t.png", { type: "image/png" })] })); } catch (e) { pode = false; }
    if (!pode) btnCompartilhar.hidden = true;
    btnCompartilhar.addEventListener("click", function () {
      if (!validar()) return;
      desenhar();
      comBlob(function (blob) {
        navigator.share({ files: [new File([blob], nomeArquivo(), { type: "image/png" })], title: "Minha placa de APROVADO", text: "Seu sonho de dirigir começa aqui. @autoescolagrajau" }).catch(function () {});
      });
    });
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  input.addEventListener("input", atualizar);
  Array.prototype.forEach.call(form.querySelectorAll('input[name="genero"]'), function (r) { r.addEventListener("change", atualizar); });

  if (document.fonts && document.fonts.load) {
    Promise.all(["800", "700", "600"].map(function (p) { return document.fonts.load(p + ' 100px "Barlow Condensed"'); })).then(atualizar, atualizar);
  }
  desenhar();
  document.addEventListener("grajau:pronto", atualizar);
})();
