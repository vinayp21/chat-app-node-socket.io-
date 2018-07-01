var socket = io();
var el = document.getElementById("server-time");
socket.on("news", function(timeString) {
  el.innerHTML = "Server time: " + timeString.data;
  setTimeout(function() {
    socket.emit("client", { data: "hi" });
  }, 3000);
});
var name = prompt("Enter Your Name");
name = name !== "null" ? name : "Anonymous";
$(".welcome-text").html("Welcome " + name + ",");
socket.emit("join", name);
socket.on("messages", function(data) {
  incomingMsg(data);
});
function incomingMsg(data) {
  console.log(data);
  if (data.sender === "You") {
    var newText =
      '<div class="incoming">' +
      data.sender +
      '<p class="text">' +
      data.msg +
      "</p></div>";
  } else {
    var newText =
      '<div class="outgoing">' +
      data.sender +
      ': <p class="text">' +
      data.msg +
      "</p></div>";
  }

  $(".chat-list").append(newText);
}

function sendMessage() {
  console.log(socket);
  var msg = $(".input-msg").val();
  socket.emit("messages", msg);
  $(".input-msg").val("");
}

$(".input-msg").bind("keypress", function() {
  $(".typing-info").html("<span>" + name + " is typing...</span>");
});
$(".input-msg").bind("focusout", function() {
  $(".typing-info").html("");
});
