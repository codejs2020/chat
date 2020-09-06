const participantsDisplay = document.getElementById('participantsDisplay')
const usernameInput = document.getElementById('usernameInput')
const messageInputField = document.getElementById('messageInputField')
let username = prompt('Enter username')

fetch('/username', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        username = data
    })
    .catch((error) => {
        console.error('Error:', error);
    });

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { message: messageInputField.value, username };

    fetch('/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            messageInputField.value = ''
        })
        .catch((error) => {
            console.error('Error:', error);
        });

})

function chatRefresh() {
    let output = ''
    fetch('/messages')
        .then(response => response.json())
        .then(text => {
            for (let item of text) {
                output += `<span class='blueText'>${item['author']}</span> :<strong>${item['message']}</strong> || ${item['timestamp']}<br>`
            }
            document.getElementById('messagesBox').innerHTML = output
        })
};
function participantsRefresh() {
    let output = ''
    fetch('/participants')
        .then(response => response.json())
        .then(text => {
            for (let item of text) {
                output += `<span class='blueText'>${item['username']}</span><br>`
            }
            participantsDisplay.innerHTML = output
        })
}

setInterval(chatRefresh, 2000)
setInterval(participantsRefresh, 2000)