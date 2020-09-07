// server.js

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const {train} =require( './backend/ML/ml')
const {trainCPU}=require('./backend/ML/mlnode')

nextApp.prepare().then(() => {

    app.get('*', (req, res) => {
        return handle(req, res)
    })
    /**
     * io channel list
     * connection
     * 
     * train: client to server, call the server to train on data set and make prediction
     * 
     * vis: server to client, send data to client and visualize using tfjs-vis
     * result: server to client, report the result back to client 
     * 
     */
    io.on('connection', (socket) => {
        const callback={
            emit:(channel,msg)=>{
                console.log('receiving callback, sending via: ',channel, ' with msg: ',msg)
                socket.broadcast.emit(channel,msg)
            }
        }
        console.log('a user connected');
        socket.on('train',(data)=>{
            train(data,callback)
        })
        socket.on('trainCPU',(data)=>{
            console.log(data)
            trainCPU(data,callback)
        })
    });
    server.listen(3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    })
})