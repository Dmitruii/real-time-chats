const express = require('express');
const cors = require('cors');
const events = require('events')
require('dotenv').config()

const emitter = new events.EventEmitter();
emitter.setMaxListeners(999)

const app = express()

app.use(cors())
app.use(express.json())

app.get('/connection', (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    })
    emitter.on('newMessage', message => {
        res.write(`data: ${JSON.stringify(message)} \n\n`)
    })
})

app.post('/new-messages', ((req, res) => {
    const message = req.body;
    emitter.emit('newMessage', message)
    res.status(200)
}))


app.listen(process.env.PORT, () => console.log(`server started on port ${process.env.PORT}`))