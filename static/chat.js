const participantsDisplay = document.getElementById('participants')
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
    })
    .catch((error) => {
        console.error('Error:', error);
    });


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { message: messageInputField.value, username: username };

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


setInterval(chatRefresh, 2000)
function chatRefresh() {
    let output = ''
    fetch('/messages')
        .then(response => response.json())
        .then(text => {
            for (let item of text) {
                output += `<span class='blueText'>${item['author']}</span> :<strong>${item['message']}</strong> || ${item['timestamp']}<br>`
                // console.log(text)
            }
            document.getElementById('messagesBox').innerHTML = output
        })
    // fetch('/activeUsers') TODO -- uraditi endpoint da vrati aktivne korisnike u participants polje
};

