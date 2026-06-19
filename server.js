
const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

console.log(`Servidor de Áudio rodando na porta ${PORT}`);

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Repassa os blocos de áudio diretamente para os outros celulares
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});
