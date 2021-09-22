const express = require("express");
const app = express();
app.use(express.static("client/build"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
const { promisify } = require("util");
const { exec } = require("child_process");
const { writeFileSync, unlinkSync } = require("fs");
const execute = promisify(exec);
dotenv.config();
app.post("/compiler", async (request, response) => {
  const { language, code } = request.body;
  console.log(language, code);

  let output = null;
  let compileError = null;
  switch (language) {
    case "javascript": {
      const filename = `./${Math.floor(Math.random() * 1000)}.js`;
      writeFileSync(filename, code);
      const data = await execute(`node ${filename}`);
      console.log(data);
      output = data.stdout;
      compileError = data.stderr;
      unlinkSync(filename);
      break;
    }
    case "python": {
      const filename = `./${Math.floor(Math.random() * 1000)}.py`;
      writeFileSync(filename, code);
      const data = await execute(`python ${filename}`);
      console.log(data);
      output = data.stdout;
      compileError = data.stderr;
      unlinkSync(filename);
      break;
    }
    case "java": {
      const filename = `./${Math.floor(Math.random() * 1000)}.java`;
      writeFileSync(filename, code);
      const data = await execute(`javac ${filename} && java ${filename}`);
      console.log(data);
      output = data.stdout;
      compileError = data.stderr;
      unlinkSync(filename);
      break;
    }
    default: {
      output = "erroare";
      break;
    }
  }

  return response.json({
    data: {
      output,
      err: compileError,
    },
  });
});

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

  socket.on("language-change", (data) => {
    //console.log(data);
    io.to(data.room).emit("recieve-language", data.language);
  });

  socket.on("send-output", (data) => {
    io.to(data.room).emit("recieve-output", data.output);
  });

  socket.on("leave", (room) => {
    console.log("leaving room", socket.id);
    socket.leave(room);
  });
});

httpServer.listen(PORT, () => console.log(`server listening on port ${PORT}`));
