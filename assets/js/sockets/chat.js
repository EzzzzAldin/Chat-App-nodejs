// Get Value ChatId
const chatId = document.getElementById('chatId').value;
const  message = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const messageCont = document.getElementById('messages-container');
messageCont.scrollTop = messageCont.scrollHeight;

// Create Event To Send Messages
socket.emit('joinChat', chatId);

sendBtn.onclick = () => {
    // Get Message Contenet
    let content = message.value;
    // Create New Event To Send Message
    socket.emit('sendMessage', {
        chat: chatId,
        content: content,
        sender: myId
    }, () => {
        message.value = '';
    })
};

// Listen Event New Message From chat.socket.js
socket.on('newMessage', message => {
    messageCont.innerHTML +=`
    <span class="msg ${message.sender === myId ? "left" : "right"}">
        ${message.content}
    </span>
`;
messageCont.scrollTop = messageCont.scrollHeight;;
});