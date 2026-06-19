const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

console.log(`Servidor de Áudio rodando na porta ${PORT}`);

// Função para enviar o total de conectados para todo mundo
function enviarTotalDeConectados() {
    const total = wss.clients.size;
    const mensagem = JSON.stringify({ acao: "atualizar_contagem", total: total });
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(mensagem);
        }
    });
}

wss.on('connection', (ws) => {
    // Um celular acabou de entrar: atualiza a contagem de todos
    enviarTotalDeConectados();

    ws.on('message', (message) => {
        // Se receber texto (ignora para áudio, só repassa se necessário)
        if (typeof message === 'string' || message instanceof Buffer === false) {
            try {
                const dados = JSON.parse(message);
                if (dados.acao === "ping_presenca") {
                    enviarTotalDeConectados();
                    return;
                }
            } catch (e) {}
        }

        // Repassa os blocos de áudio normalmente para os outros celulares
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Um celular desconectou: atualiza a contagem dos que ficaram
    ws.on('close', () => {
        enviarTotalDeConectados();
    });
});
