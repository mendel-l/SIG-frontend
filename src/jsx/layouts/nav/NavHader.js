import React, { useContext, useState } from "react";
import { useDispatch , useSelector } from 'react-redux';

import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { navtoggle } from "../../../store/actions/AuthActions";

const NavHader = () => {
  const [toggle, setToggle] = useState(false);
    const { navigationHader, openMenuToggle, background } = useContext(
      ThemeContext
    );
    const dispatch = useDispatch();
    const sideMenu = useSelector(state => state.sideMenu);
    const handleToogle = () => {
      dispatch(navtoggle());
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
        <div className={`hamburger ${sideMenu ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>          
        </div>
      </div>
    </div>
  );
};

export default NavHader;
