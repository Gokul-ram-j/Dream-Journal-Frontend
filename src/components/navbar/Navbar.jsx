import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars, 
  faSignOut, 
  faXmark, 
  faHome,
  faEye,
  faPlus,
  faUser,
  faMoon
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";

const navLinks = [
  { to: "/", title: "HOME", icon: faHome },
  { to: "displayDreams", title: "DISPLAY DREAMS", icon: faEye },
  { to: "addDreams", title: "ADD DREAMS", icon: faPlus },
  { to: "userProfile", title: "MY PROFILE", icon: faUser },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth).then(() => navigate("/"));
      console.log("User signed out successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Sign-out failed:", error.message);
    }
  };

  // Check if current path is active
  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.includes(path)) return true;
    return false;
  };

  return (
    <>
      <nav className={`${styles.navContainer} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContent}>
          {/* Logo/Brand */}
          <Link to="/" className={styles.logo}>
            <FontAwesomeIcon icon={faMoon} className={styles.logoIcon} />
            <span className={styles.logoText}>DreamJournal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.navLinks}>
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`${styles.navLink} ${isActiveLink(link.to) ? styles.activeLink : ''}`}
              >
                <FontAwesomeIcon icon={link.icon} className={styles.navIcon} />
                <span>{link.title}</span>
              </Link>
            ))}
            
            <button onClick={handleSignOut} className={styles.signoutButton}>
              <FontAwesomeIcon icon={faSignOut} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.menuToggle}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon 
              icon={isOpen ? faXmark : faBars} 
              className={styles.menuIcon}
            />
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`${styles.mobileOverlay} ${isOpen ? styles.showOverlay : ''}`}>
          <div className={`${styles.mobileMenu} ${isOpen ? styles.showMenu : ''}`}>
            <div className={styles.mobileHeader}>
              <h3>Navigation</h3>
            </div>
            
            <div className={styles.mobileNavLinks}>
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className={`${styles.mobileNavLink} ${isActiveLink(link.to) ? styles.activeMobileLink : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon icon={link.icon} className={styles.mobileNavIcon} />
                  <span>{link.title}</span>
                </Link>
              ))}
            </div>

            <div className={styles.mobileFooter}>
              <button onClick={handleSignOut} className={styles.mobileSignoutButton}>
                <FontAwesomeIcon icon={faSignOut} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content overlap */}
      <div className={styles.navSpacer}></div>
    </>
  );
}

export default Navbar;