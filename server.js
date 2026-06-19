
const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;

// Cria um mini app express para lidar com o tráfego seguro do Render
const app = express();
const server = app.listen(PORT, () => console.log(`Servidor WebRTC rodando na porta ${PORT}`));

// Conecta o WebSocket no servidor seguro
const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('Novo dispositivo conectado ao rádio com segurança!');

    ws.on('message', (message) => {
        // Encaminha os pacotes do WebRTC para os celulares conectados
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => console.log('Dispositivo desconectado.'));
});
