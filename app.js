"use strict";

const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const INDEX = path.join(__dirname, "views/index.html");
const app = express();

const server = require("http").createServer(app);

const PORT = process.env.PORT || 3000;
const io = socketIO(server);
server.listen(PORT);
app.use(express.static(__dirname + "/src"));
app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res) {
  res.sendFile(INDEX);
});

io.on("connection", socket => {
  console.log("Client connected");

  socket.on("join", function(name) {
    socket.nickname = name;
  });
  socket.on("messages", function(data) {
    var obj = {
      msg: data,
      sender: socket.nickname
    };
    socket.broadcast.emit("messages", obj);
    var senderobj = {
      msg: data,
      sender: "You"
    };
    socket.emit("messages", senderobj);
  });
  socket.on("typing", function(name) {
    socket.broadcast.emit("typing", name);
  });
});
