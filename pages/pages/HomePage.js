import Navbar from "../Layout/Navbar";
import Login from "../components/login";
import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
const HomePage = () => {
const params = useParams();
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="main">
          <div className="container-1">
            <div className="authoptions">
              <button className={styles.btn}>
                  <Link to={`/login/${params.authPerson}`}>
                  <span>Log In</span>
                  </Link>
              </button>
              <button className={styles.btn}>
              <Link to={`/signUp/${params.authPerson}`}>
                  <span>Sign Up</span>
                  </Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
