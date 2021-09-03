import { useState, useEffect } from "react";
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
  const [showEditor, setShowEditor] = useState<boolean>(false);
  useEffect(() => {
    /* socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join room", id); */
    setSocket(
      io("wss://meditations.eduxxi.online/meditation", {
        transports: ["websocket"],
      })
    );
  }, []);

  useEffect(() => {
    socket?.on("recieve-code", (code) => {
      setCode(code as string);
    });
    return () => {
      socket?.emit("leave", id);
    };
  }, [socket, id]);
  const joinEditor = () => {
    socket?.emit("join", id);
    setShowEditor((prev) => !prev);
  };

  return (
    <div>
      <h1>CodeEditor</h1>
      <button onClick={() => joinEditor()}>START</button>
      {showEditor && (
        <Editor
          height="90vh"
          theme="vs-dark"
          defaultLanguage="java"
          defaultValue={code}
          value={code}
          onChange={(value, ev) => {
            setCode(value as string);
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
