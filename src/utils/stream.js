let clientes = [];

export function conectarCliente(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    });
    const clientId = Date.now();
    const nuevoCliente = { id: clientId, res };
    clientes.push(nuevoCliente);
    
    // Mantener conexión viva
    req.on('close', () => {
        clientes = clientes.filter(c => c.id !== clientId);
    });
}

export function transmitir(datos) {
    clientes.forEach(c => c.res.write(`data: ${JSON.stringify(datos)}\n\n`));
}
