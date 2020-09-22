const socket = io();
const btn = document.getElementById('friendRequestsDropdown');
// Get User Id From input Hidden in NavBar
let myId = document.getElementById('userId').value;

socket.on('connect', () => {
    // Build New NotificationsRoom 
    socket.emit('joinNotificationsRoom', myId);
    // Build New Object Online Friends 
    socket.emit('goOnline', myId);
});

socket.on('newFriendRequest', data => {
    // Get DropDown in NavBar Page
    const friendRequest = document.getElementById('friendRequest');
    const span = friendRequest.querySelector('span');
    if (span) span.remove();
    // Show Friend Request in NavBar
    friendRequest.innerHTML += `
        <a class="dropdown-item" href="/profile/${data.id}">
            ${data.name}
        </a>
        `
    // Alert To Display Notification
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-danger');
});

btn.onclick = () => {
    btn.classList.add('btn-secondary');
    btn.classList.remove('btn-danger');
}