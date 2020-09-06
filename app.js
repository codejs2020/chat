const express = require('express')
const fs = require('fs')
const { checkIfUserIsKnown } = require('./utils')
let { anonymousCounter, port, maximumDisplayedMessages } = require('./appConfig')
const app = express()

app.use(express.static('static'))
app.use(express.json())

app.post('/username', (req, res) => {
    let userIPaddress = req.ip
    let username = req.body.username ? req.body.username.replace('<', '&lt;').replace('>', '&gt;') : `Anonymous ${++anonymousCounter}`
    fs.readFile('participants.json', function (err, data) {
        if (err) throw err
        let participants
        try {
            participants = JSON.parse(data.toString())
        } catch (e) {
            participants = []
        }
        participants.push({ username })
        fs.writeFile('participants.json', JSON.stringify(participants), function (err) {
            if (err) throw err
        })
    })
    //Provera da li je ip adresa poznata, ako jeste ne mora da pita na pocetku za username vec ga vadi iz baze
    fs.readFile('knownUsers.json', function (err, data) {
        if (err) throw err
        let knownUsers
        try {
            knownUsers = JSON.parse(data.toString())
        } catch (e) {
            knownUsers = []
        }
        let userIsKnown = checkIfUserIsKnown(userIPaddress, knownUsers)
        if (!userIsKnown) {
            knownUsers.push({ ip: userIPaddress, username })
            fs.writeFile('knownUsers.json', JSON.stringify(knownUsers), function (err) {
                if (err) throw err
            })
        }

    })
    // Upis u bazu poruka da je korisnik usao u sobu
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let messages
        try {
            messages = JSON.parse(data.toString())
        } catch (e) {
            messages = []
        }
        messages.push({
            messageID: messages[messages.length - 1]['messageID'] + 1,
            author: 'admin',
            message: `<span class='redText'>${username} has entered the chatroom</span>`,
            timestamp: new Date()
        })

        fs.writeFile('messages.json', JSON.stringify(messages), function (err) {
            if (err) throw err
        })
    })
    res.json(username)
})

app.post('/message', (req, res) => {
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let messages
        try {
            messages = JSON.parse(data.toString())
        } catch (e) {
            messages = []
        }
        messages.push({
            messageID: messages[messages.length - 1]['messageID'] + 1,
            author: (req.body.username ? req.body.username : 'Anonymous'),
            message: (req.body.message).replace('<', '&lt;').replace('>', '&gt;'),
            timestamp: new Date()
        })
        if (messages.length > maximumDisplayedMessages) messages.shift()
        fs.writeFile('messages.json', JSON.stringify(messages), function (err) {
            if (err) throw err
        })
    })


    res.status(201).json('sent')
})
app.get('/messages', (req, res) => {
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let messages
        try {
            messages = JSON.parse(data.toString())
        } catch (e) {
            messages = []
        }
        res.json(messages)
    })
})

app.post('logout', (req, res) => {
    fs.readFile('participants.json', function (err, data) {
        if (err) throw err
        let participants
        try {
            participants = JSON.parse(data.toString())
        } catch (e) {
            participants = []
        }
        participants.splice(participants.indexOf(req.body.username), 1)
        fs.writeFile('participants.json', JSON.stringify(participants), function (err) {
            if (err) throw err
        })
    })
})

app.get('/participants', (req, res) => {
    fs.readFile('participants.json', function (err, data) {
        if (err) throw err
        let participants
        try {
            participants = JSON.parse(data.toString())
        } catch (e) {
            participants = []
        }
        res.json(participants)
    })
})


app.listen(port, () => {
    console.log(`App started on port ${port}`);
})
