document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { message: document.getElementById('message').value };

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
            document.getElementById('message').value = ''
        })
        .catch((error) => {
            console.error('Error:', error);
        });

})


setInterval(chatRefresh, 2000)
function chatRefresh() {
    fetch('/messages')
  .then(response => response.json())
        .then(data => {
            document.getElementById('messages').innerHTML = data.join('<br>')
                console.log(data)
  });
}
