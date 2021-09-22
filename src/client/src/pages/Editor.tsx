import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import io, { Socket } from "socket.io-client";
import { useParams, Link } from "react-router-dom";

interface EditorParams {
  id: string;
}

function CodeEditor() {
  const { id } = useParams<EditorParams>();
  const [code, setCode] = useState<any>("// some comment");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  useEffect(() => {
    /* socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join room", id); */
    setSocket(io("/"));
  }, []);

  useEffect(() => {
    socket?.on("test-emit", (data) => console.log(data));
    socket?.on("recieve-code", (code) => {
      console.log("code recieved", code);
      setCode(code);
    });
    /* return () => {
      socket?.emit("leave", id);
    }; */
  });
  const joinEditor = () => {
    socket?.emit("join", id);
    setShowEditor((prev) => !prev);
  };

  return (
    <div>
      <Link to="/">
        <h1>CodeEditor</h1>
      </Link>
      <button onClick={() => joinEditor()}>START</button>
      {showEditor && (
        <Editor
          height="90vh"
          theme="vs-dark"
          defaultLanguage="java"
          defaultValue={code}
          value={code}
          onChange={(value, ev) => {
            setCode(value);
            console.log(value);
            socket?.emit("code-change", {
              room: id,
              code: value,
            });
          }}
        />
      )}
    </div>
  );
}

export default CodeEditor;
