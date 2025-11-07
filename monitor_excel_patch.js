export function descargarExcel() {
  // Cargar librería XLSX en runtime
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
  script.onload = () => {
    const filtrados = canalFiltro === "todos"
      ? logs
      : logs.filter(x => (x.canal || "").toLowerCase() === canalFiltro);

    // Preparar datos para Excel
    const data = filtrados.map(x => ({
      Teléfono: x.from || "",
      Estado: x.status || "",
      Fecha: x.fecha ? new Date(x.fecha).toLocaleString() : "",
      Canal: x.canal || "",
      Respuesta: x.respuesta || "",
      "Fecha Reserva": x.status === "verde" && x.reserva ? x.reserva.fecha || "" : ""
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads Body Elite");

    XLSX.writeFile(wb, "leads_bodyelite.xlsx");
  };
  document.body.appendChild(script);
}
