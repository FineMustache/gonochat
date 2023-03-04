const socket = io();
socket.emit('username', window.location.search.split('?')[1].split('=')[1])
// Evento de envio de mensagem
const form = document.querySelector('form');
const input = document.querySelector('input');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (message) {
        socket.emit('sendMessage', message);
        input.value = '';
    }
});

// Evento de recebimento de mensagem
const messagesList = document.querySelector('#messages-list');
socket.on('message', (message) => {
    console.log(message)
    const li = document.createElement('li');
    li.innerHTML = `${message.username} - ${message.text}`;
    messagesList.appendChild(li);
});
