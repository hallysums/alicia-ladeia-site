/* =========================================================================
   Dra. Alicia Ladeia — interações e animações
   Animações com Motion (motion.dev — a biblioteca do Framer Motion para JS puro)
   ========================================================================= */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* ------------------------------------------------------------------
     1. Links de contato a partir da configuração
     ------------------------------------------------------------------ */
  var wa = String(C.whatsapp || "").replace(/\D/g, "");
  var ig = String(C.instagram || "draalicialadeia").replace(/^@/, "");
  var igUrl = "https://www.instagram.com/" + ig + "/";
  var bookUrl = wa
    ? "https://wa.me/" + wa + "?text=" + encodeURIComponent(C.whatsappMessage || "")
    : "https://ig.me/m/" + ig;
  var place = C.address || C.mapQueryFallback || "Tatuapé, São Paulo - SP";
  var routeUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(place);

  $$("[data-book]").forEach(function (a) {
    if (a.hasAttribute("data-wa-only") && !wa) { a.hidden = true; return; }
    a.href = bookUrl; a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", function () { track("agendar_clique", { canal: wa ? "whatsapp" : "instagram" }); });
  });
  $$("[data-insta]").forEach(function (a) { a.href = igUrl; });
  $$("[data-route]").forEach(function (a) {
    a.href = routeUrl;
    a.addEventListener("click", function () { track("rota_clique"); });
  });
  var fab = $(".fab");
  if (fab) {
    fab.setAttribute("aria-label", wa ? "Agendar avaliação pelo WhatsApp" : "Agendar avaliação pelo Instagram");
    if (!wa) fab.classList.add("is-ig");
  }

  // Endereço e horários
  var addrEl = $("[data-address]");
  if (addrEl && C.address) addrEl.innerHTML = esc(C.address);
  var hoursEl = $("[data-hours]");
  if (hoursEl && C.hours && C.hours.length) {
    hoursEl.innerHTML = "<table><tbody>" + C.hours.map(function (h) {
      return "<tr><td>" + esc(h[0]) + "</td><td>" + esc(h[1]) + "</td></tr>";
    }).join("") + "</tbody></table>";
  }
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------------
     2. Header: fundo ao rolar, esconder ao descer, link ativo
     ------------------------------------------------------------------ */
  var hdr = $(".hdr"), lastY = window.scrollY, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle("is-solid", y > 40);
    var goingDown = y > lastY && y > 480;
    hdr.classList.toggle("is-hidden", goingDown && !doc.body.classList.contains("menu-open"));
    if (fab) fab.classList.toggle("is-on", y > window.innerHeight * 0.6);
    lastY = y; ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    var navLinks = $$(".nav a");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["proposta", "lentes", "transformacoes", "sobre", "localizacao"].forEach(function (id) { var s = doc.getElementById(id); if (s) io.observe(s); });
  }

  /* ------------------------------------------------------------------
     3. Menu mobile (acessível: foco preso, Esc, retorno de foco)
     ------------------------------------------------------------------ */
  var menu = $("#menu-mobile"), openBtn = $(".burger:not(.burger--close)"), closeBtn = $(".burger--close");
  function M() { return window.Motion; }
  function openMenu() {
    menu.hidden = false; doc.body.classList.add("menu-open");
    openBtn.setAttribute("aria-expanded", "true");
    if (M() && !reduce) {
      M().animate(menu, { opacity: [0, 1], clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"] }, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
      M().animate($$(".mnav__links a, .mnav__foot > *", menu), { opacity: [0, 1], y: [24, 0] }, { delay: M().stagger(0.05, { startDelay: 0.18 }), duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    }
    closeBtn.focus();
  }
  function closeMenu(focusBack) {
    var done = function () { menu.hidden = true; doc.body.classList.remove("menu-open"); if (focusBack !== false) openBtn.focus(); };
    openBtn.setAttribute("aria-expanded", "false");
    if (M() && !reduce) {
      M().animate(menu, { opacity: [1, 0] }, { duration: 0.3 }).then(done);
    } else done();
  }
  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", function () { closeMenu(); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { closeMenu(false); }); });
  menu.addEventListener("keydown", function (e) {
    if (e.key === "Escape") return closeMenu();
    if (e.key !== "Tab") return;
    var f = $$("a[href], button:not([disabled])", menu), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth >= 1024 && !menu.hidden) closeMenu(false); });

  /* ------------------------------------------------------------------
     4. Especialidade: navegação do carrossel
     ------------------------------------------------------------------ */
  var rail = $(".spec__rail");
  if (rail) {
    var prev = $('[data-scroll="-1"]'), next = $('[data-scroll="1"]');
    var step = function () { var c = $(".card-arch", rail); return c ? c.getBoundingClientRect().width + 16 : 300; };
    var upd = function () {
      var max = rail.scrollWidth - rail.clientWidth - 4;
      if (prev) prev.disabled = rail.scrollLeft <= 4;
      if (next) next.disabled = rail.scrollLeft >= max;
    };
    [prev, next].forEach(function (b) { if (b) b.addEventListener("click", function () { rail.scrollBy({ left: step() * +b.dataset.scroll, behavior: reduce ? "auto" : "smooth" }); }); });
    rail.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd); upd();
  }

  /* ------------------------------------------------------------------
     5. Antes e depois
     ------------------------------------------------------------------ */
  var stage = $(".compare__stage"), range = $(".compare__range");
  var before = $(".compare__before"), after = $(".compare__after");
  var tabs = $(".cases__tabs"), meta = $(".cases__meta");
  var cases = (C.cases || []).filter(function (c) { return c && c.before && c.after; });

  function setPos(v) { stage.style.setProperty("--pos", v + "%"); range.value = v; }
  function renderCase(i) {
    var c = cases[i];
    before.innerHTML = '<img src="' + esc(c.before) + '" alt="Antes — ' + esc(c.title || "caso") + '" loading="lazy" decoding="async">';
    after.innerHTML = '<img src="' + esc(c.after) + '" alt="Depois — ' + esc(c.title || "caso") + '" loading="lazy" decoding="async">';
    meta.textContent = c.note || "";
    $$(".cases__tab", tabs).forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; });
    setPos(50);
    if (M() && !reduce) M().animate(stage, { opacity: [0.4, 1] }, { duration: 0.5 });
  }
  if (stage) {
    if (cases.length) {
      tabs.innerHTML = cases.map(function (c, i) { return '<button class="cases__tab" type="button" role="tab" aria-selected="false">' + esc(c.title || "Caso " + (i + 1)) + "</button>"; }).join("");
      $$(".cases__tab", tabs).forEach(function (t, i) { t.addEventListener("click", function () { renderCase(i); }); });
      renderCase(0);
    } else {
      // Estrutura pronta: sem casos reais cadastrados ainda
      before.innerHTML = '<div class="ph ph--b"><div class="ph__in"><span class="ph__k">Antes</span><span class="ph__s">Foto real do caso, com autorização do paciente</span></div></div>';
      after.innerHTML = '<div class="ph ph--a"><div class="ph__in"><span class="ph__k">Depois</span><span class="ph__s">Mesmo enquadramento e iluminação</span></div></div>';
      var demo = doc.createElement("p");
      demo.className = "compare__demo";
      demo.textContent = "Área preparada para os casos reais da Dra. Alicia. Arraste para testar a comparação.";
      stage.appendChild(demo);
      tabs.innerHTML = "";
      meta.textContent = "";
    }
    range.addEventListener("input", function () { setPos(range.value); });
    // Arrasto direto no palco (toque e mouse)
    var dragging = false;
    var fromEvent = function (e) { var r = stage.getBoundingClientRect(); return Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)); };
    stage.addEventListener("pointerdown", function (e) { dragging = true; stage.classList.add("is-drag"); setPos(fromEvent(e).toFixed(1)); });
    window.addEventListener("pointermove", function (e) { if (dragging) setPos(fromEvent(e).toFixed(1)); }, { passive: true });
    window.addEventListener("pointerup", function () { dragging = false; stage.classList.remove("is-drag"); });
    window.addEventListener("pointercancel", function () { dragging = false; stage.classList.remove("is-drag"); });
  }

  /* ------------------------------------------------------------------
     6. Depoimentos
     ------------------------------------------------------------------ */
  var track_ = $(".quote__track"), dots = $(".quote__dots");
  var testis = (C.testimonials || []).filter(function (t) { return t && t.text; });
  var isDemo = !testis.length;
  if (isDemo) testis = [{ text: "Espaço reservado para depoimentos reais e autorizados de pacientes da Dra. Alicia.", name: "Nome ou identificação autorizada", detail: "Paciente" }];
  var qi = 0, qTimer;
  if (track_) {
    track_.innerHTML = testis.map(function (t, i) {
      return '<figure class="quote__item" aria-hidden="' + (i ? "true" : "false") + '">' +
        (isDemo ? '<span class="quote__badge">Modelo · depoimento a inserir</span>' : "") +
        '<blockquote class="quote__txt">' + esc(t.text) + "</blockquote>" +
        '<figcaption class="quote__who">' + (t.photo ? '<img src="' + esc(t.photo) + '" alt="" width="44" height="44" loading="lazy">' : "") +
        "<span>— " + esc(t.name) + (t.detail ? " · " + esc(t.detail) : "") + "</span></figcaption></figure>";
    }).join("");
    dots.innerHTML = testis.map(function (_, i) { return '<button type="button" role="tab" aria-label="Depoimento ' + (i + 1) + '" aria-selected="' + (i ? "false" : "true") + '"></button>'; }).join("");
    var items = $$(".quote__item", track_), dbtn = $$("button", dots);
    var go = function (i) {
      qi = (i + items.length) % items.length;
      items.forEach(function (el, k) { el.setAttribute("aria-hidden", k === qi ? "false" : "true"); });
      dbtn.forEach(function (b, k) { b.setAttribute("aria-selected", k === qi ? "true" : "false"); });
    };
    dbtn.forEach(function (b, i) { b.addEventListener("click", function () { go(i); restart(); }); });
    $$("[data-q]").forEach(function (b) { b.addEventListener("click", function () { go(qi + +b.dataset.q); restart(); }); });
    var restart = function () { clearInterval(qTimer); if (items.length > 1 && !reduce) qTimer = setInterval(function () { go(qi + 1); }, 7000); };
    if (items.length < 2) { $(".quote__ctrl").hidden = true; }
    restart();
  }

  /* ------------------------------------------------------------------
     7. Mapa (carrega só com ação do usuário — privacidade)
     ------------------------------------------------------------------ */
  var mapBtn = $("[data-map-load]");
  if (mapBtn) mapBtn.addEventListener("click", function () {
    var box = $(".map"), f = doc.createElement("iframe");
    f.src = "https://www.google.com/maps?q=" + encodeURIComponent(place) + "&output=embed";
    f.title = "Mapa — " + place; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
    box.appendChild(f);
    $(".map__facade").remove();
    track("mapa_carregado");
  });

  /* ------------------------------------------------------------------
     8. Consentimento e análise de acessos (LGPD)
     ------------------------------------------------------------------ */
  var hasAnalytics = !!(C.googleAnalyticsId || C.metaPixelId);
  var consentBox = $(".consent"), KEY = "al_consent_v1";
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* modo privado */ } }
  function loadAnalytics() {
    if (C.googleAnalyticsId && !window.gtag) {
      var s = doc.createElement("script"); s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(C.googleAnalyticsId);
      doc.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", C.googleAnalyticsId, { anonymize_ip: true });
    }
    if (C.metaPixelId && !window.fbq) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,doc,"script","https://connect.facebook.net/en_US/fbevents.js");
      /* eslint-enable */
      window.fbq("init", C.metaPixelId); window.fbq("track", "PageView");
    }
  }
  function track(name, params) {
    if (getConsent() !== "yes") return;
    if (window.gtag) window.gtag("event", name, params || {});
    if (window.fbq && name === "agendar_clique") window.fbq("track", "Contact");
  }
  if (hasAnalytics && consentBox) {
    var openBtnC = $("[data-consent-open]");
    if (openBtnC) { openBtnC.hidden = false; openBtnC.addEventListener("click", function () { consentBox.hidden = false; }); }
    var c0 = getConsent();
    if (c0 === "yes") loadAnalytics(); else if (!c0) consentBox.hidden = false;
    $$("[data-consent]", consentBox).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.dataset.consent; setConsent(v); consentBox.hidden = true;
        if (v === "yes") loadAnalytics();
      });
    });
  }

  /* ------------------------------------------------------------------
     9. Animações de entrada (Motion) — respeita "reduzir movimento"
     ------------------------------------------------------------------ */
  function initMotion() {
    var Mo = M();
    if (!Mo || reduce) return;
    var ease = [0.22, 1, 0.36, 1];
    var clear = function (els) { (els.length ? els : [els]).forEach(function (el) { el.style.transform = ""; }); };
    root.classList.add("motion-ready");

    // Hero
    var heroEls = $$("[data-hero]");
    Mo.animate(heroEls, { opacity: [0, 1], y: [28, 0] }, { delay: Mo.stagger(0.1, { startDelay: 0.15 }), duration: 1, ease: ease });
    var himg = $(".hero__img");
    if (himg) Mo.animate(himg, { scale: [1.12, 1], opacity: [0, 1] }, { duration: 1.8, ease: ease });
    var arch = $(".hero__arch path");
    if (arch) Mo.animate(arch, { pathLength: [0, 1] }, { duration: 2.2, delay: 0.4, ease: ease });

    // Parallax sutil (apenas telas grandes)
    if (window.matchMedia("(min-width: 960px)").matches && Mo.scroll) {
      if (himg) Mo.scroll(Mo.animate(".hero__media", { y: [0, 120] }, { ease: "linear" }), { target: $(".hero"), offset: ["start start", "end start"] });
      var fimg = $(".final__img");
      if (fimg) Mo.scroll(Mo.animate(fimg, { y: ["-8%", "0%"] }, { ease: "linear" }), { target: $(".final"), offset: ["start end", "end start"] });
    }

    var from = { left: { x: [-40, 0], y: [0, 0] }, right: { x: [40, 0], y: [0, 0] }, scale: { scale: [0.94, 1] } };
    $$("[data-reveal]").forEach(function (el) {
      Mo.inView(el, function () {
        var kind = el.getAttribute("data-reveal");
        var kf = Object.assign({ opacity: [0, 1] }, from[kind] || { y: [32, 0] });
        Mo.animate(el, kf, { duration: 0.95, ease: ease }).then(function () { clear(el); });
      }, { amount: 0.2, margin: "0px 0px -8% 0px" });
    });
    $$("[data-stagger]").forEach(function (group) {
      var kids = Array.prototype.slice.call(group.children);
      Mo.inView(group, function () {
        Mo.animate(kids, { opacity: [0, 1], y: [30, 0] }, { delay: Mo.stagger(0.08), duration: 0.85, ease: ease }).then(function () { clear(kids); });
      }, { amount: 0.15 });
    });
  }
  if (window.Motion) initMotion();
  else window.addEventListener("load", function () { if (window.Motion) initMotion(); });
})();
