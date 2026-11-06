(() => {
  const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escritorio = matchMedia("(min-width: 901px)");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const limitar = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  requestAnimationFrame(() => document.body.classList.add("cargado"));

  const raiz = document.documentElement;
  const metaColor = $('meta[name="theme-color"]');
  const pintarTema = () => {
    const claro = raiz.dataset.tema === "claro";
    if (metaColor) metaColor.content = claro ? "#f5f7fb" : "#050608";
    const b = $("#tema");
    if (b) b.setAttribute("aria-label", claro ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
  };
  pintarTema();
  $("#tema")?.addEventListener("click", () => {
    raiz.dataset.tema = raiz.dataset.tema === "claro" ? "oscuro" : "claro";
    try { localStorage.setItem("tema", raiz.dataset.tema); } catch (e) {}
    pintarTema();
  });
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    let guardado = null;
    try { guardado = localStorage.getItem("tema"); } catch (er) {}
    if (guardado) return;
    raiz.dataset.tema = e.matches ? "claro" : "oscuro";
    pintarTema();
  });

  $$("[data-retraso]").forEach((el) => el.style.setProperty("--retraso", `${Number(el.dataset.retraso) * 80}ms`));

  const contar = (el) => {
    const fin = Number(el.dataset.contar);
    if (reducir) { el.textContent = fin; return; }
    const t0 = performance.now();
    const dur = 1400;
    const paso = (t) => {
      const k = limitar((t - t0) / dur);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visto");
      $$("[data-contar]", e.target).forEach(contar);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  $$(".aparece").forEach((el) => io.observe(el));

  const puntos = $$(".indicador li");
  const ioSec = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      puntos.forEach((p) => p.classList.toggle("activo", p.dataset.ir === e.target.id));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  $$("[data-seccion]").forEach((s) => ioSec.observe(s));
  puntos.forEach((p) => p.addEventListener("click", () => document.getElementById(p.dataset.ir)?.scrollIntoView({ behavior: reducir ? "auto" : "smooth" })));

  const nav = $("#nav");
  const barra = $(".progreso span");
  const parallax = $$("[data-parallax]");
  const pin = $("[data-pin]");
  const pasos = pin ? $$(".paso", pin) : [];
  const frase = $("[data-frase]");
  const palabras = frase ? $$("span", frase) : [];

  const cuadro = () => {
    const y = scrollY;
    const alto = innerHeight;
    nav?.classList.toggle("solida", y > 30);
    if (barra) barra.style.transform = `scaleX(${limitar(y / (document.documentElement.scrollHeight - alto))})`;

    if (!reducir) {
      parallax.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > alto) return;
        el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - alto / 2) * -Number(el.dataset.parallax)}px, 0)`;
      });
    }

    if (pin) {
      let p = 1;
      if (escritorio.matches && !reducir) {
        const r = pin.getBoundingClientRect();
        p = limitar(-r.top / (r.height - alto));
      }
      pin.style.setProperty("--p", p.toFixed(4));
      pasos.forEach((el, i) => el.classList.toggle("activo", p >= 0.08 + i * 0.2));
    }

    if (frase) {
      const r = frase.getBoundingClientRect();
      const k = reducir ? 1 : limitar((alto * 0.85 - r.top) / (r.height + alto * 0.45));
      const n = Math.round(k * palabras.length);
      palabras.forEach((w, i) => w.classList.toggle("on", i < n));
    }
  };

  let pendiente = false;
  const pedir = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { pendiente = false; cuadro(); });
  };
  addEventListener("scroll", pedir, { passive: true });
  addEventListener("resize", pedir);
  cuadro();

  if (!reducir && matchMedia("(hover: hover)").matches) {
    $$(".tarjeta, .uso, .bulto-item").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }
})();
