import React, { Component, useContext } from "react";
import logo from '../media/schoolLogo.jpg';
import "./navbar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";

export default function NavBar(props) {

    const { isLoggedIn, logout } = useContext(AuthContext);



    const Logout = () => {
        logout();
    }

    return (<>
        <div className="navBar-container">
            <div className="nav-icon">
                <img className="nav-img" src={logo}></img>
            </div>
            {
                isLoggedIn && <div className="nav-links-container">
                    <Link
                        className="nav-links"
                        to="/action"
                        state={{ admin: props.admin }}
                    >
                        Home
                    </Link>
                    <Link onClick={() => Logout()} className="nav-links" to='/'>Logout</Link>
                </div>
            }
        </div>
    </>)

}