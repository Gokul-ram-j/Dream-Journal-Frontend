import React, { useEffect, useState } from "react";
// styles
import styles from "./Login.module.css";
// fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock,faUser } from "@fortawesome/free-solid-svg-icons";
// firebase
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../auth/firebase";
import Loading from "../Loading/Loading";
function Login() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleLoginSubmit = async () => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    setError(false);
  }, [email, password]);

  const handleSignUpSubmit = async () => {
    setLoading(true);
    try {
       await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send request to backend after successful signup
      await fetch(
        `http://localhost:8000/userDreamsDB/addUser?userEmail=${encodeURIComponent(email)}&userName=${userName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      setIsLogin(true);
      alert("Account created successfully!");
    } catch (error) {
      setLoading(false);
      alert("Sign-up failed: " + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLoginSubmit();
    } else {
      handleSignUpSubmit();
    }
  };
  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <div className={styles.container}>
          <h1 className={styles.title}>Welcome to Dream Journal</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.formTitle}>
              {isLogin ? "Login" : "Sign in"}
            </h1>
            {error && (
              <div className={styles.errorMsg}>
                Gmail and Password Is not Matching
              </div>
            )}
            {!isLogin &&<div className={styles.inpWrapper}>
              <FontAwesomeIcon
                style={{ width: "25px", height: "25px" }}
                icon={faUser}
              />
              <input
                className={styles.formInput}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder="Name"
              />
            </div>}
            <div className={styles.inpWrapper}>
              <FontAwesomeIcon
                style={{ width: "25px", height: "25px" }}
                icon={faEnvelope}
              />
              <input
                className={styles.formInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
              />
            </div>
            <div className={styles.inpWrapper}>
              <FontAwesomeIcon
                style={{ width: "25px", height: "25px" }}
                icon={faLock}
              />
              <input
                className={styles.formInput}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>

            <button className={styles.submitBtn} type="submit">
              {isLogin ? "Login" : "Sign in"}
            </button>

            {isLogin ? (
              <p className={styles.msg}>
                Don't have an account?{" "}
                <span
                  className={styles.navLink}
                  onClick={() => setIsLogin(false)}
                >
                  {" "}
                  Sign Up !!
                </span>
              </p>
            ) : (
              <p className={styles.msg}>
                Already Have an Account?{" "}
                <span
                  className={styles.navLink}
                  onClick={() => setIsLogin(true)}
                >
                  Login Here !!
                </span>
              </p>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default Login;
