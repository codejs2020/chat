const express = require('express')
const fs = require('fs')
const app = express()
const port = process.env.NODE_PORT || 3333

app.use(express.static('static'))
app.use(express.json())

/**
 app.get('/', (req, res) => {
     res.set('Content-Type', 'text/html')
     res.sendFile(__dirname + '/static/index.html')
 })
 */

app.post('/message', (req, res) => {
    fs.readFile('messages.json', function (err, data) {
        if (err) throw err
        let json
        try {
            json = JSON.parse(data.toString())
        } catch (e) {
            json = []
        }
        json.push(req.body.message)
        
        fs.writeFile('messages.json', JSON.stringify(json), function (err) {
            if (err) throw err
        })
       })

    fs.appendFile('messages.txt', req.body.message+"\n", function (err) {
        if (err) throw err
    })
    // fs.appendFile('messages.txt', req.body.message+"\n", function (err) {
    //    if (err) throw err
    //})
   res.json(['Hello'])
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

app.listen(port, ()=>{
 console.log(`App started on port ${port}`);
})
