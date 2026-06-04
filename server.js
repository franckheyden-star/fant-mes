const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// PORT Render
const PORT = process.env.PORT || 3000;

// fichiers statiques
app.use(express.static("public"));

// uploads (optionnel)
app.use("/files", express.static("uploads"));

// données
let users = {};
let onlineUsers = {};

// socket
io.on("connection", (socket) => {

  socket.on("login", (name) => {
    users[socket.id] = name;
    onlineUsers[socket.id] = name;

    io.emit("system", name + " a rejoint 👻");
    io.emit("online", Object.values(onlineUsers));
  });

  socket.on("message", (data) => {
    const user = users[socket.id] || "User";

    io.emit("message", {
      user,
      text: data.text
    });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id];

    delete users[socket.id];
    delete onlineUsers[socket.id];

    io.emit("system", name + " est parti");
    io.emit("online", Object.values(onlineUsers));
  });
});

// start
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
