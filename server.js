const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

console.log(`Servidor de sinalização WebRTC rodando na porta ${PORT}`);

wss.on('connection', (ws) => {
    console.log('Novo dispositivo conectado ao rádio!');

    ws.on('message', (message) => {
        // Envia tudo o que recebe (seja texto do WebRTC ou áudio bruto) para todos os outros conectados
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Dispositivo desconectado.');
    });
});
