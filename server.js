const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`Servidor de rádio rodando na porta ${PORT}`);
});

wss.on('connection', (ws) => {
    console.log('Novo celular conectado!');

    ws.on('message', (message) => {
        // Envia o pedacinho de áudio para todos os outros celulares conectados
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => console.log('Celular desconectado.'));
});
