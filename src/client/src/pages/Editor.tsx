import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import io, { Socket } from "socket.io-client";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface EditorParams {
  id: string;
}

const SOCKET_URL: string = process.env.REACT_APP_SOCKET_URL || "/";

function CodeEditor() {
  const { id } = useParams<EditorParams>();
  const [code, setCode] = useState<any>("// some comment");
  const [language, setLanguage] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");
  const [err, setErr] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  useEffect(() => {
    /* socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join room", id); */
    setSocket(io(SOCKET_URL));
  }, []);

  useEffect(() => {
    socket?.on("test-emit", (data) => console.log(data));
    socket?.on("recieve-code", (code) => {
      console.log("code recieved", code);
      setCode(code);
    });
    socket?.on("recieve-output", (output) => setOutput(output));
    socket?.on("recieve-language", (language) => setLanguage(language));
    /* return () => {
      socket?.emit("leave", id);
    }; */
  });
  const joinEditor = () => {
    socket?.emit("join", id);
    setShowEditor((prev) => !prev);
  };
  const compile = async () => {
    const res = await axios.post("/compiler", {
      code,
      language,
    });
    const data = res.data;
    console.log(data);
    setOutput(data.data.output);
    setErr(data.data.err);
    socket?.emit("send-output", {
      room: id,
      output: data.data.output,
    });
  };

  return (
    <div>
      <Link to="/">
        <h1>CodeEditor</h1>
      </Link>
      <button onClick={() => joinEditor()}>START</button>
      <div>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            socket?.emit("language-change", {
              room: id,
              language: e.target.value,
            });
          }}
        >
          <option value="javascript">javascript</option>
          <option value="c++">c++</option>
          <option value="java">java</option>
          <option value="python">python</option>
        </select>
        <button onClick={() => compile()}>Compileaza codul...</button>
        {output && <pre> output: {output}</pre>}
        {err && <pre>err: {output}</pre>}
      </div>
      {showEditor && (
        <Editor
          height="90vh"
          theme="vs-dark"
          defaultLanguage={language}
          language={language}
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
