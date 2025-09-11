import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

const NavHader = () => {
  const [toggle, setToggle] = useState(false);
    const { navigationHader, openMenuToggle, background } = useContext(
      ThemeContext
    );
    const handleToogle = () => {
      setToggle(!toggle);
    };
  return (
    <div className="nav-header">
      <h1>:D</h1>
      <div
        className="nav-control"
        onClick={() => {              
          handleToogle()
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>          
        </div>
      </div>
    </div>
  );
};

export default NavHader;
