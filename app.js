'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const INDEX = path.join(__dirname, 'views/index.html');
const app=express();
const server= require('http').createServer(app);

// const server = express()
//   .use('/',(req, res) => res.sendFile(INDEX) )
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));
const PORT= process.env.PORT || 3000
const io = socketIO(server);
server.listen(PORT);
app.get('/',function(req,res){
	res.sendFile(INDEX);
})
io.on('connection', (socket) => {
  console.log('Client connected');
	socket.emit('news', {data:'hello'});
  socket.on('client', (res) => {
		socket.emit('news', {data: res.data });
	});
});
