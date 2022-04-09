const ws = require('ws')
require('dotenv').config()

const wss = new ws.WebSocketServer({
    port: process.env.PORT
}, () => console.log(`Server started on ${process.env.PORT} PORT`))

wss.on('connection', function connection(ws) {
    ws.on('message', function(message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break
            case 'connection':
                broadcastMessage(message)
                break
        }
    })
})

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}