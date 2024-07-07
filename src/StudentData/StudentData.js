import React, { useState, useEffect } from "react";
import "./StudentData.css";
import NavBar from "../Navbar/NavBar";
import backgroundLogo from '../media/backgroundLogo.jpg';
import SchoolForm from "../SchoolForm/SchoolFrom";
import { useLocation } from "react-router-dom";
import Loading from "../Loading/loading";
import DataStatusMessage from "../DataStatusMessage/DataStatusMessage";

export default function StudentData() {

    let [data, setData] = useState(null);
    let [validData, setValidData] = useState(true);
    let [loading, setloading] = useState(false);
    const location = useLocation();
    const { studentID, dataType, admin } = location.state || {};

    let fetchData = async () => {
        setloading(true);
        try {
            const response = await fetch(`https://xxxxxxxxxxxxxxxxxxxxxxx`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXX'
                }
            });

            const stuData = await response.json();

            if (response.ok) {
                setloading(false);
                setData(stuData.response);
            } else {
                setloading(false);
                setValidData(false);
                setData(stuData.response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            setValidData(false);
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (<>
        <NavBar admin={admin}></NavBar>
        <div className="student-data-container">
            <img className="student-data-bg" src={backgroundLogo}></img>
            {
                loading && <Loading></Loading>
            }
            {
                !loading && validData && <SchoolForm studentData={data} type={dataType} admin={admin} ></SchoolForm>
            }
            {
                !loading && !validData && <DataStatusMessage admin={admin} message="Please Enter Valid Student ID" dataAccessType="GET"></DataStatusMessage>
            }
        </div>
    </>)
}