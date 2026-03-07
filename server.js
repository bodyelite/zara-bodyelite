
app.get('/download-monitor', (req, res) => {
  const path = require('path');
  const filePath = path.join(__dirname, 'data', 'sessions.json');
  res.download(filePath, 'zara_monitor_reporte.json', (err) => {
    if (err) {
      console.error('Error al descargar el reporte:', err);
      res.status(500).send('No se pudo generar la descarga.');
    }
  });
});

app.get('/descargar-zara', (req, res) => {
  const filePath = '/opt/render/project/src/data/sessions.json';
  res.download(filePath, 'zara_monitor_reporte.json', (err) => {
    if (err) {
      console.error('Error al descargar:', err);
      res.status(500).send('Error en descarga');
    }
  });
});
