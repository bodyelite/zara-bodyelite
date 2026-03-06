async function exportarAuditoria() {
    try {
        const response = await fetch('./zara_monitor_pro.json');
        const datosMonitor = await response.json();

        if (!datosMonitor || !datosMonitor.users) {
            alert("Faltan los datos del monitor para exportar.");
            return;
        }

        let tsvContent = "Fecha de Ing\tTelefono\tNombre\tEstado\tPrimer Mensaje\tBitacora\n";
        
        for (const [telefono, datos] of Object.entries(datosMonitor.users)) {
            let primerMensaje = "";
            let fechaIngreso = "";
            
            const primerMsjUser = datos.history.find(m => m.role === 'user');
            
            if (primerMsjUser) {
                primerMensaje = primerMsjUser.content.replace(/\n/g, ' ').replace(/\t/g, ' ');
                const fecha = new Date(primerMsjUser.timestamp);
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                fechaIngreso = `${dia}-${mes}-${fecha.getFullYear()}`;
            }
            
            const nombre = datos.name || "";
            const estado = datos.tag || "";
            let bitacora = "";
            
            if (datos.notes && datos.notes.length > 0) {
                bitacora = datos.notes.map(n => n.text.replace(/\n/g, ' ').replace(/\t/g, ' ')).join(" | ");
            }
            
            tsvContent += `${fechaIngreso}\t${telefono}\t${nombre}\t${estado}\t${primerMensaje}\t${bitacora}\n`;
        }

        const blob = new Blob(["\uFEFF" + tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Auditoria_Zara.xls";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error al exportar:", error);
        alert("Fallo al conectar con los datos de Zara.");
    }
}
