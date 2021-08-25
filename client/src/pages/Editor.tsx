import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import io, { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

interface EditorParams {
  id: string;
}

function CodeEditor() {
  const { id } = useParams<EditorParams>();
  const [code, setCode] = useState<string>("// some comment");
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket>();
  useEffect(() => {
    /* socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join room", id); */
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    socket?.emit("join", id);
    socket?.on("recieve-code", (code) => {
      console.log("recieving code...");
      setCode(code);
    });
  }, []);

  return (
    <div>
      <h1>CodeEditor</h1>
      <Editor
        height="90vh"
        theme="vs-dark"
        defaultLanguage="java"
        defaultValue={code}
        onChange={(value, ev) => {
          console.log(value);
          setCode(value as string);
          socket?.emit("code-change", {
            room: id,
            code: value,
          });
        }}
      />
    </div>
  );
}

export default CodeEditor;