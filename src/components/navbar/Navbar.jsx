import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
const navLinks = [
  { to: "/", title: "HOME" },
  { to: "displayDreams", title: "DISPLAY DREAMS" },
  { to: "addDreams", title: "ADD DREAMS" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // handling signOut of the user
  const handleSignOut = async () => {
    try {
      await signOut(auth).then(() => navigate("/"));
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Sign-out failed:", error.message);
    }
  };
  return (
    <div className={styles.navContainer}>
      <div className={`${isOpen?styles.showMenu:{display:"none"}} ${styles.navLinks}`}>
        {navLinks.map((info, index) => {
          return (
            <Link
            onClick={()=>setIsOpen(false)}
              key={index}
              style={{ textDecoration: "none", fontSize: "20px" }}
              to={info.to}
            >
              {info.title}
            </Link>
          );
        })}
        <button onClick={handleSignOut} className={[styles.signoutButton]}>
          <p>Sign Out</p>
          <FontAwesomeIcon size={18} icon={faSignOut} />
        </button>
      </div>
      <button
        className={styles.menuIcon}
        onClick={() => {
          console.log("clicked");
          setIsOpen(!isOpen);
        }}
      >
        <FontAwesomeIcon
          style={{ width: "25px", height: "25px" }}
          size={100}
          icon={faBars}
        />
      </button>
    </div>
  );
}
{
  /* 
  
  
  
  
  
  <button onClick={handleSignOut} className={[styles.signoutButton]}>
        <p>Sign Out</p>
        <FontAwesomeIcon size={18} icon={faSignOut} />
      </button>
      <button className={styles.menuIcon} onClick={() => { console.log('clicked')
        setIsOpen(!isOpen)}}>
        <FontAwesomeIcon style={{width:'25px',height:'25px'}} size={100} icon={faBars} />
      </button> */
}
export default Navbar;
