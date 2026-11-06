(() => {
  const r = document.documentElement;
  r.classList.add("js");
  let t = null;
  try { t = localStorage.getItem("tema"); } catch (e) {}
  if (t !== "claro" && t !== "oscuro") t = matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "oscuro";
  r.dataset.tema = t;
})();
