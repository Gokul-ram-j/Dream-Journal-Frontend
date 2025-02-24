import React from "react";
import { useEffect, useState } from "react";
import { auth } from "./components/auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import DisplayDreams from "./components/displayDreams/DisplayDreams";
import Login from "./components/userLogin/Login";
import AddDreams from "./components/addDreams/AddDreams";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Navbar from "./components/navbar/Navbar";
import './App.css'
function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("User details:", user);
      } else {
        setCurrentUser(null);
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);
  return (
    <BrowserRouter>
      {currentUser && <Navbar />}
      <Routes>
        {!currentUser && <Route path="/" element={<Login />} />}
        {currentUser && (
          <>
            <Route path="/" element={<Home userDetails={currentUser} />} />
            <Route
              path="displayDreams"
              element={<DisplayDreams userDetails={currentUser} />}
            />
            <Route
              path="addDreams"
              element={<AddDreams userDetails={currentUser} />}
            />
          </>
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
