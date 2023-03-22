import { Link } from "react-router-dom";

const SplitPage = () => {
  return (
      <div className = "outer">
        <div className="header">
          <h2>DECENTRALIZED PARKING SYSTEM</h2>
        </div>
        <div className="split left">
          <h1>DRIVER?</h1>
          <Link to="/user" className="button">
            Sign In
          </Link>
        </div>
        <div className="split right">
          <h1>OWNER?</h1>
          <Link to="/spotOwner" className="button">
            Sign In
          </Link>
        </div>
      </div>
  );
};
export default SplitPage;
