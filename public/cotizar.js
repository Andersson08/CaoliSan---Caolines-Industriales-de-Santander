document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cotizar");
  if (!form) return;
  const limpiar = (v) => String(v || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 60);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const cantidad = Math.max(1, Math.min(100000, parseInt(d.get("cantidad"), 10) || 1));
    const cliente = limpiar(d.get("cliente"));
    const lineas = [
      `Hola ${form.dataset.nombre}, quiero cotizar caolín:`,
      `• Presentación: ${limpiar(d.get("presentacion"))}`,
      `• Cantidad: ${cantidad} ${limpiar(d.get("unidad"))}`,
      `• Entrega en: ${limpiar(d.get("ciudad"))}`
    ];
    if (cliente) lineas.push(`• Nombre/empresa: ${cliente}`);
    const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(lineas.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
