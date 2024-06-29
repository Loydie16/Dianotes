import { useNavigate, Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {" "}
      <Link to="/login">Login</Link>
    </div>
  );
}

export default Home;
