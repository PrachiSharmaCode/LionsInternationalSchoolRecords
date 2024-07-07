import React, { useEffect, useState } from "react";
import NavBar from "../Navbar/NavBar";
import backgroundLogo from '../media/backgroundLogo.jpg';
import "./newStudent.css";
import SchoolForm from "../SchoolForm/SchoolFrom";
import { useLocation } from "react-router-dom";
import DataStatusMessage from "../DataStatusMessage/DataStatusMessage";

export default function NewStudent() {

    let [studentData, setStudentData] = useState();
    let [updateComplete, setupdateComplete] = useState(false);
    let [postResponse, setPostResponse] = useState();
    const location = useLocation();
    const { type, userAdmin } = location.state;


    useEffect(() => {
        if (studentData) {
            postData();
            setStudentData(null);
        }
    }, [studentData]);

    let postData = async () => {
        try {
            const response = await fetch(`https://xxxxxxxxxxxxxxx`, {
                method: 'POST',
                body: JSON.stringify(studentData),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'XXXXXXXXXXXXXXXXX'
                }
            });

            const stuData = await response.json();

            // Convert response to JSON
            if (response.ok) {
                setupdateComplete(true);
                setPostResponse(stuData);
            } else {
                alert("Cannot Add student to Database, please check Data Entered");
                console.error("Error adding Student", response.status);
            }
        } catch (error) {
            console.error("Error occurred while posting", error);
        }
    }

    let saveStudentInformation = (newStudentData) => {
        setStudentData(newStudentData);
    }

    return (<>
        <NavBar admin={userAdmin}></NavBar>
        <div className="new-student-container">
            <img className="new-student-bg" src={backgroundLogo}></img>
            
            {
                !updateComplete && <SchoolForm type='POST' admin={userAdmin} buttonClikcAction={saveStudentInformation}></SchoolForm>
            }
            {
                updateComplete && <DataStatusMessage admin={userAdmin} message={`Successfully Added Student to Database. Student ID: ${postResponse.Student_ID}`} dataAccessType="POST"></DataStatusMessage>
            }
        </div >
    </>)
}