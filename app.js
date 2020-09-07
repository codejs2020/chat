const express = require('express')
const fs = require('fs')
const { checkIfUserIsKnown, jsonParseWithErrorCheck, checkMessageLength } = require('./utils')
let { anonymousCounter, port, maximumDisplayedMessages } = require('./appConfig')
const app = express()

app.use(express.static('static'))
app.use(express.json())

app.post('/username', (req, res) => {
    let userIPaddress = req.ip
    let username = req.body.username ? req.body.username.replace(/</g, '&lt;').replace(/>/g, '&gt;') : `Anonymous ${++anonymousCounter}`
    fs.readFile('participants.json', function (err, data) {
        if (err) throw err
        let participants = jsonParseWithErrorCheck(data.toString())
        participants.push({ username })
        fs.writeFile('participants.json', JSON.stringify(participants, null, 2), function (err) {
            if (err) throw err
        })
    })
    //Provera da li je ip adresa poznata, ako jeste ne mora da pita na pocetku za username vec ga vadi iz baze
    fs.readFile('knownUsers.json', function (err, data) {
        if (err) throw err
        let knownUsers = jsonParseWithErrorCheck(data.toString())
        let userIsKnown = checkIfUserIsKnown(userIPaddress, knownUsers)
        if (!userIsKnown) {
            knownUsers.push({ ip: userIPaddress, username })
            fs.writeFile('knownUsers.json', JSON.stringify(knownUsers, null, 2), function (err) {
                if (err) throw err
            })
        }

    })
    // Upis u bazu poruka da je korisnik usao u sobu
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let messages = jsonParseWithErrorCheck(data.toString())
        messages.push({
            messageID: messages[messages.length - 1]['messageID'] + 1,
            author: 'admin',
            message: `<span class='redText'>${username} has entered the chatroom</span>`,
            timestamp: new Date()
        })

        fs.writeFile('messages.json', JSON.stringify(messages, null, 2), function (err) {
            if (err) throw err
        })
    })
    res.json(username)
})

app.post('/message', (req, res) => {
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let messages = jsonParseWithErrorCheck(data.toString())
        let message = `<span class='noOverflow'> ${(req.body.message).replace(/</g, '&lt;').replace(/>/g, '&gt;')} </span>`
        messages.push({
            messageID: messages[messages.length - 1]['messageID'] + 1,
            author: (req.body.username ? req.body.username : 'Anonymous'),
            message,
            timestamp: new Date()
        })
        fs.writeFile('messages.json', JSON.stringify(messages, null, 2), function (err) {
            if (err) throw err
        })
    })


    res.status(201).json('sent')
})
app.get('/messages', (req, res) => {
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let messages = jsonParseWithErrorCheck(data.toString())
        res.json(messages)
    })
})

app.post('logout', (req, res) => {
    fs.readFile('participants.json', function (err, data) {
        if (err) throw err
        let participants = jsonParseWithErrorCheck(data.toString())
        participants.splice(participants.indexOf(req.body.username), 1)
        fs.writeFile('participants.json', JSON.stringify(participants, null, 2), function (err) {
            if (err) throw err
        })
    })
})

app.get('/participants', (req, res) => {
    fs.readFile('participants.json', function (err, data) {
        if (err) throw err
        let participants = jsonParseWithErrorCheck(data.toString())
        res.json(participants)
    })
})


app.listen(port, () => {
    console.log(`App started on port ${port}`);
})
