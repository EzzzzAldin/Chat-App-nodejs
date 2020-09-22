// Create New Event To Get Online Freiends
socket.emit('getOnlineFriends', myId);

// Lithen Event Online Friends From friends.socket.js To Get Online Friens
socket.on('onlineFriends', friends => {
    let div = document.getElementById('onlineFriends');
    if (friends.length === 0) {
        div.innerHTML = `
            <p class="alert alert-danger mt-2">No Online Friend </p>
            `
    } else {
        let html = `
            <div class="row">
        `;
        for (let friend of friends) {
            html += `
                <div class="col col-12 col-md-6 col-lg-4 col-xl-3 rounded mr-5 mt-5">
                <img class="mx-auto d-block rounded-circle border border-dark mt-5" src="/${friend.image}" style="height: 200px; width: 200px;">
                    <div style="text-align: center;" class="mt-2">
                        <h3>
                            <a href="/profile/${friend.id}" style="color: #000"> ${friend.name} </a>
                        </h3>
                        <a href="/chat/${friend.chatId}" class="btn br">Chat</a>
                    </div>
                </div>
            `;
        }
        html += '</div>'
        div.innerHTML = html;
    }
});