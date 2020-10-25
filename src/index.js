const express= require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

//Hellooooo\
//device 2

const app=express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT||3000
const publicDirectoryPath = path.join(__dirname,"../public")

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('new websocket connection')

    socket.emit('message','Welcome!')
    //sends a welcome message to a user that joins

    socket.broadcast.emit('message','A new user has joined')
    //sends a message to all clients, except the new client,
    //that a new client has joined

    socket.on('sendMessage',(msg,callback)=>{
        const filter= new Filter()

        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }

        io.emit('message', msg)
        callback()
    })
    //accepts what one cliet sends
    //and sends it across to all the other clients

    socket.on('disconnect',()=>{
        io.emit('message','A user has left')
    })
    //sends a message to all connected clients that 
    //one client has diconnected
    socket.on('sendLocation',(coords,callback)=>{
        io.emit('message',`http://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
    //shares the location as sent by the client, to all the clients
    //including the client that sent it
})


server.listen(port,()=>{
    console.log(`server is up on port: ${port}`)
})