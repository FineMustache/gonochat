const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// define a pasta de arquivos estáticos
app.use(express.static(__dirname + 'src/public'));

// lista para armazenar as mensagens
const messages = [];

// evento de conexão com o socket
io.on('connection', (socket) => {
  console.log('Usuário conectado');

  // evento de recebimento de username do usuário
  socket.on('username', (username) => {
    console.log(`Username recebido: ${username}`);

    // adiciona o username no socket para identificação
    socket.username = username;

    // emite uma mensagem de boas vindas para o usuário
    socket.emit('message', {
      username: 'GonoChat Bot',
      text: `Bem-vindo(a) ao GonoChat, ${username}!`,
      createdAt: new Date().getTime()
    });

    // emite uma mensagem de entrada do usuário para todos os outros usuários
    socket.broadcast.emit('message', {
      username: 'GonoChat Bot',
      text: `${username} entrou no chat.`,
      createdAt: new Date().getTime()
    });
  });

  // evento de recebimento de nova mensagem
  socket.on('sendMessage', (message) => {
    console.log(`Nova mensagem recebida: ${message}`);
    let content = {"text": message, "username": socket.username}

    // adiciona a mensagem na lista
    messages.push(message);

    // emite a nova mensagem para todos os usuários conectados
    io.emit('message', content);
  });

  // evento de desconexão do socket
  socket.on('disconnect', () => {
    console.log('Usuário desconectado');

    if (socket.username) {
      // emite uma mensagem de saída do usuário para todos os outros usuários
      socket.broadcast.emit('message', {
        username: 'GonoChat Bot',
        text: `${socket.username} saiu do chat.`,
        createdAt: new Date().getTime()
      });
    }
  });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'src/views/index.html')
})

// Rota do chat
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + 'src/views/chat.html');
  });
  

// inicia o servidor na porta 3000
server.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
