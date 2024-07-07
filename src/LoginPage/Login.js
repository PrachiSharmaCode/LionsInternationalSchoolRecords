import React, { Component, useEffect, useState, useContext } from "react";
import NavBar from "../Navbar/NavBar";
import { useNavigate } from "react-router-dom";
import "./login.css";
import backgroundLogo from '../media/backgroundLogo.jpg';
import Loading from "../Loading/loading";
import { AuthContext } from "../AuthContext/AuthContext";

export default function Login() {

    let [data, setData] = useState();
    const { login } = useContext(AuthContext);
    let [username, setUsername] = useState();
    let [password, setPassword] = useState();
    let [loading, setloading] = useState(false);
    let [loginSuccessful, setLoginSuccessful] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        if(data){
            navigate('/action',  { state: { admin: data.Admin } });
        }
    }, [data]);
    

    let loginUser = async () => {
        setloading(true);

        let userLogin = {
            'username': username,
            'password': password
        }

        try {
            const response = await fetch('https://xxxxxxxxxxxxxxxxxx', {
                method: 'POST',
                body: JSON.stringify(userLogin),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'XXXXXXXXXXXXXXXXXX'
                }
            });

            // Convert response to JSON
            const responseData = await response.json();

            if (response.ok) {
                setData(responseData);
                setloading(false);
                setLoginSuccessful(true);
                login(); 
            } else {
                setloading(false);
                setLoginSuccessful(false);
                console.error("Login failed with status", response.status);
            }
        } catch (error) {
            setloading(false);
            setLoginSuccessful(false);
            console.error("Error occurred while logging in:", error);
        }
    }



    let updateUsername = (currentUserName) => {
        setUsername(currentUserName);
    }

    let updatePassword = (currentPassword) => {
        setPassword(currentPassword);
    }

    let loginFromInput = (event) => {
        if(event.key === 'Enter'){
            loginUser();
        }
    }

    return (<>
        <NavBar admin={data? data.Admin : false}></NavBar>
        <img className="login-demo-bg " src={backgroundLogo}></img>
        {
            loading && <Loading></Loading>
        }
        {
            !loading && <div className="login-container">

                {
                    !loginSuccessful && <div className="fail-login-message"><p>Something went wrong! Please check credentials.</p></div>
                }

                <div className="form-input-feild">
                    <p>Username</p>
                    <input onChange={(e) => updateUsername(e.target.value)} className="login-input-field"></input>
                </div>

                <div className="form-input-feild">
                    <p>Password</p>
                    <input type='password' onKeyDown={(e) => loginFromInput(e)} onChange={(e) => updatePassword(e.target.value)} className="login-input-field"></input>
                </div>
                <button className="login-button" onClick={loginUser}>Login</button>
            </div>
        }

    </>)

}