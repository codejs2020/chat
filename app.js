const express = require('express')
const fs = require('fs')
const { json } = require('express')
const { checkIfUserIsKnown } = require('./utils')
const app = express()
const port = process.env.NODE_PORT || 3333

app.use(express.static('static'))
app.use(express.json())

app.post('/username', (req, res) => {
    let userIPaddress = req.ip
    let username = req.body.username ? req.body.username : 'Anonymous'
    //Provera da li je ip adresa poznata, ako jeste ne mora da pita na pocetku za username vec ga vadi iz baze
    fs.readFile('knownUsers.json', function (err, data) {
        if (err) throw err
        let users
        try {
            users = JSON.parse(data.toString())
        } catch (e) {
            users = []
        }
        let userIsKnown = checkIfUserIsKnown(userIPaddress, users)
        if (!userIsKnown) {
            users.push({ ip: userIPaddress, username })
            fs.writeFile('knownUsers.json', JSON.stringify(users), function (err) {
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
            messageID: messages.length,
            author: 'admin',
            message: `${username} has entered the chatroom`,
            timestamp: new Date()
        })



        fs.writeFile('messages.json', JSON.stringify(messages), function (err) {
            if (err) throw err
        }
        )
    }
    )

    res.json(username)
})

app.post('/message', (req, res) => {
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let json
        try {
            json = JSON.parse(data.toString())
        } catch (e) {
            json = []
        }
        json.push({
            messageID: json.length,
            author: (req.body.username ? req.body.username : 'Anonymous'),
            message: req.body.message,
            timestamp: new Date()
        })

        fs.writeFile('messages.json', JSON.stringify(json), function (err) {
            if (err) throw err
        })
    })


    res.status(201).json('sent')
})
app.get('/messages', (req, res) => {
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let json
        try {
            json = JSON.parse(data.toString())
        } catch (e) {
            json = []
        }
        res.json(json)
    })
})

app.listen(port, () => {
    console.log(`App started on port ${port}`);
})
