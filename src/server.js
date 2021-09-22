const express = require("express");
const app = express();
app.use(express.static("client/build"));
const httpServer = require("http").createServer(app);
const options = {
  /* ... */
  cors: {
    origin: "*",
  },
  transports: ["polling"],
};
const io = require("socket.io")(httpServer, options);
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  //
  socket.on("join", (room) => {
    console.log(`joining room: ${room} socket id: ${socket.id}`);
    socket.join(room);
  });

  socket.on("code-change", (data) => {
    //console.log(data);
    io.to(data.room).emit("recieve-code", data.code);
  });

  socket.on("leave", (room) => {
    console.log("leaving room", socket.id);
    socket.leave(room);
  });
});

httpServer.listen(PORT, () => console.log(`server listening on port ${PORT}`));
