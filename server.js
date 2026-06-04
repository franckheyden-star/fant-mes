const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// PORT Render
const PORT = process.env.PORT || 3000;

// 📁 fichiers statiques (IMPORTANT)
app.use(express.static("public"));

// 🏠 route principale (fix "Cannot GET /")
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// 👥 utilisateurs
let users = {};
let onlineUsers = {};

// 💬 SOCKET.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // login
  socket.on("login", (name) => {
    users[socket.id] = name;
    onlineUsers[socket.id] = name;

    io.emit("system", name + " a rejoint le chat 👻");
    io.emit("online", Object.values(onlineUsers));
  });

  // messages
  socket.on("message", (data) => {
    const user = users[socket.id] || "User";

    io.emit("message", {
      user: user,
      text: data.text
    });
  });

  // disconnect
  socket.on("disconnect", () => {
    const name = users[socket.id];

    delete users[socket.id];
    delete onlineUsers[socket.id];

    io.emit("system", name + " est parti");
    io.emit("online", Object.values(onlineUsers));
  });
});

// 🚀 START SERVER (IMPORTANT RENDER)
server.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
