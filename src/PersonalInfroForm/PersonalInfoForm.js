import React, { useState, useEffect } from 'react';
import NavBar from '../Navbar/NavBar';
import backgroundLogo from '../media/backgroundLogo.jpg';
import SchoolForm from '../SchoolForm/SchoolFrom';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DataStatusMessage from '../DataStatusMessage/DataStatusMessage';
import "./personalInfoForm.css";

export default function PersonalInfoForm() {

    const location = useLocation();
    let navigate = useNavigate();

    const { studentID, type, admin } = location.state || {};

    let [studentPerosnalInfo, setstudentPerosnalInfo] = useState(null);
    let [validData, setValidData] = useState(true);

    let fetchStduentList = async () => {
        try {
            const response = await fetch(`https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'XXXXXXXXXXXXXXXXXXXXX'
                }
            });

            const stuData = await response.json();

            if (response.ok) {
                setstudentPerosnalInfo(stuData.response);
            } else {
                setValidData(false);
                setstudentPerosnalInfo(stuData.response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchStduentList();
    }, []);

    let updateData = async (data) => {
        const response = await fetch(`https://xxxxxxxxxxxxxxxxxxx`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': 'XXXXXXXXXXXXXXX'
            }
        });

        if (response.ok) {
            navigate('/Student', { state: { studentID: studentID, dataType: 'GET', admin: admin } });
            alert("Update Successfull");
        }
    }

    return (<>
        <NavBar admin={admin}></NavBar>
        <div className="personal-form-container">
            <img className="personal-form-bg" src={backgroundLogo}></img>
            {
                validData && <SchoolForm studentData={studentPerosnalInfo} type={type} admin={admin} buttonClikcAction={updateData} ></SchoolForm>
            }
            {
                !validData && <DataStatusMessage admin={admin} message="Please Enter Valid Student ID" dataAccessType='PUT'></DataStatusMessage>
            }
        </div >
    </>)
}