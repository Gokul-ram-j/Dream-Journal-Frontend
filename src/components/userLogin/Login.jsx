import React, { useEffect, useState } from "react";
// styles
import styles from "./Login.module.css";
// fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
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
        console.log('Account created successfully')
      })
      .catch(() => {
        setError(true);
      }).finally(()=>{
        setLoading(false)
      })
  };

  useEffect(() => {
    setError(false);
  }, [email, password]);

  const handleSignUpSubmit = async () => {
    setLoading(true);
    try {
      // Send request to backend after successful signup
      await fetch(
        `https://dream-journal-backend.vercel.app/userDreamsDB/addUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
            userName: userName,
            userDetail: {
              age: null,
              phoneNumber: "N/A",
              address: "N/A",
            },
          }),
        }
      )
        .then(async () => {
          await createUserWithEmailAndPassword(auth, email, password);
        })
        .catch((err) => {
          console.log(err);
        });

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
          <h1 className={styles.title}>
            Welcome <br /> to <br /> Dream Journal
          </h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.formTitle}>
              {isLogin ? "Login" : "Sign in"}
            </h1>
            {error && (
              <div className={styles.errorMsg}>
                Gmail and Password Is not Matching
              </div>
            )}
            {!isLogin && (
              <div className={styles.inpWrapper}>
                <FontAwesomeIcon
                  style={{ width: "16px", height: "16px" }}
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
              </div>
            )}
            <div className={styles.inpWrapper}>
              <FontAwesomeIcon
                style={{ width: "16px", height: "16px" }}
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
                style={{ width: "16px", height: "16px" }}
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
