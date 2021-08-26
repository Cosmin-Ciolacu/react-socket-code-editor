const httpServer = require("http").createServer();
const options = {
  /* ... */
  cors: {
    origin: "http://localhost:3000",
  },
};
const io = require("socket.io")(httpServer, options);

const PORT = process.env.PORT || 5000;

io.on("connection", async (socket) => {
  //
  socket.on("join", (room) => {
    console.log("joining room", socket.id);
    socket.join(room);
  });

  socket.on("code-change", (data) => {
    io.to(data.room).emit("recieve-code", data.code);
  });

  socket.on("leave", (room) => {
    console.log("leaving room", socket.id);
    socket.leave(room);
  });
});

httpServer.listen(PORT, () => console.log(`server listening on port ${PORT}`));
