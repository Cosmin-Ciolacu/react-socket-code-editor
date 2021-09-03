import { Switch, Route, HashRouter as Router } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Editor from "./pages/Editor";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/editor/:id" component={Editor} />
      </Switch>
    </Router>
  );
}

export default App;
