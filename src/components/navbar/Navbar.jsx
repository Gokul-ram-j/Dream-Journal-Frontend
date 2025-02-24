import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
const navLinks = [
  { to: "/", title: "HOME" },
  { to: "displayDreams", title: "DISPLAY DREAMS" },
  { to: "addDreams", title: "ADD DREAMS" },
];


function Navbar() {
  // handling signOut of the user
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Sign-out failed:", error.message);
    }
  };
  return (
    <nav className={styles.container}>
      <ul className={styles.navItemContainer}>
        {navLinks.map((info, index) => {
          return (
            <li key={index} className={styles.navItem}>
              <Link style={{ textDecoration: 'none' }} to={info.to}>
                {info.title}
              </Link>
            </li>
          );
        })}
      <button onClick={handleSignOut} className={styles.signoutButton}>
        <FontAwesomeIcon icon={faSignOut}/>
      </button>
      </ul>
    </nav>
  );
}

export default Navbar;
