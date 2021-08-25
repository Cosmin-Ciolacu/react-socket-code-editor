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
    console.log("room", data.room);
    console.log("code", data.code);
    io.to(data.room).emit("recieve-code", data.code);
  });
});

httpServer.listen(PORT, () => console.log(`server listening on port ${PORT}`));
