"use strict";

const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const INDEX = path.join(__dirname, "views/index.html");
const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 3000;

const io = socketIO(server);
server.listen(3000);
app.use(express.static(__dirname + "/public"));
app.use("/", function(req, res, next) {
  res.sendFile(INDEX);
});

io.on("connection", function(client) {
  client.on("join", function(name) {
    client.nickname = name;
  });
  client.on("messages", function(data) {
    var obj = {
      msg: data,
      sender: client.nickname
    };
    client.broadcast.emit("messages", obj);
    var senderobj = {
      msg: data,
      sender: "You"
    };
    client.emit("messages", senderobj);
  });
});
