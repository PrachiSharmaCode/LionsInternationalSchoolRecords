import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../Navbar/NavBar";
import "./home.css";
import backgroundLogo from '../media/backgroundLogo.jpg';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home() {

    let navigate = useNavigate();
    const location = useLocation();
    const { admin } = location.state || {};


    let goToAddNewStudent = () => {
        navigate('/newStudent', { state: { type: 'POST', userAdmin: admin } })
    }

    let goToCheckStudentStatus = () => {
        navigate('/student-options', { state: { type: 'GET', userAdmin: admin } })
    }

    let goToUpdateStudent = () => {
        navigate('/student-options', { state: { type: 'PUT', userAdmin: admin } })
    }
    
    return (<>

        <NavBar admin={admin}></NavBar>
        <img className="home-bg" src={backgroundLogo}></img>
        <div className="home-container">
            <div className="container">
                <button onClick={() => goToAddNewStudent()} className="home-page-button">Add New Student</button>
                <button onClick={() => goToCheckStudentStatus()} className="home-page-button">Student Information</button>
                <button onClick={() => goToUpdateStudent()} className="home-page-button">Update Student Information</button>
            </div>
        </div>
    </>)
}

export default Home;