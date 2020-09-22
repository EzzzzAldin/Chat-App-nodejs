const addBtn = document.getElementById('addBtn');

// Get Data
const myName = document.getElementById('myName').value;
const myImage = document.getElementById('myImage').value;
const friendId = document.getElementById('friendId').value;
const friendName = document.getElementById('friendName').value;
const friendImage = document.getElementById('friendImage').value;

addBtn.onclick = (e) => {
    e.preventDefault();
    // Send Data To Friend Request
    socket.emit('sendFriendRequest', {
        myId,
        myName,
        myImage,
        friendId,
        friendName,
        friendImage
    })
};

socket.on('requestSent', () => {
    // To Remove Btn Add When To Send Request
    addBtn.remove();
    // Add Btn Cancel After Remove Btn Add
    document.getElementById('friendsForm').innerHTML = `
        <div class="col-md-12 text-center">
            <input type="submit" value="Cancel Request" class="btn btn-danger mt-2" formaction="/friend/cancel">
        </div>
        `
});