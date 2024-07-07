import React, { useEffect, useState } from 'react';
import "./feesForm.css";
import NavBar from '../Navbar/NavBar';
import backgroundLogo from '../media/backgroundLogo.jpg';
import SchoolForm from '../SchoolForm/SchoolFrom';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DataStatusMessage from '../DataStatusMessage/DataStatusMessage';


export default function FeeForm() {

    let feesFlag = "Yes";

    let navigate = useNavigate();
    const location = useLocation();
    const { studentID, type, admin } = location.state || {};

    let [studentFeesInfo, setStudentFeeInfo] = useState(null);
    let [validData, setValidData] = useState(true);

    let fetchStduentList = async () => {
        try {
            const response = await fetch(`https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
                }
            });

            const stuData = await response.json();

            if (response.ok) {
                setStudentFeeInfo(stuData.response);
            } else {
                setValidData(false);
                setStudentFeeInfo(stuData.response);
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
        const response = await fetch(`xxxxxxxxxxxxxxxxxx`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': 'XXXXXXXXXXXXXXX'
            }
        });

        if (response.ok) {
            alert("Updated Successfully");
            navigate('/Student', { state: { studentID: studentID, dataType: 'GET', admin: admin } });
        } else {
            alert("Something Went Wrong");
        }
    }


    return (<>
        <NavBar admin={admin}></NavBar>
        <div className="fees-form-container">
            <img className="fee-form-bg" src={backgroundLogo}></img>
            {
                validData && <SchoolForm studentData={studentFeesInfo} type={type} admin={admin} buttonClikcAction={updateData} ></SchoolForm>
            }
            {
                !validData && <DataStatusMessage admin={admin} message="Please Enter Valid Student ID" dataAccessType='PUT'></DataStatusMessage>
            }
        </div >
    </>);
}