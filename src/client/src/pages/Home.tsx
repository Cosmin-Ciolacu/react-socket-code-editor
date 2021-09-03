import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to={`/editor/${uuid()}`}>
        <p>join!</p>
      </Link>
    </div>
  );
}

export default Home;
