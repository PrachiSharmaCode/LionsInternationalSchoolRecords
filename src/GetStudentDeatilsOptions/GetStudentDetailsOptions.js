import React, { useEffect, useState } from 'react';
import "./GetStudentDetailsOptions.css";
import NavBar from '../Navbar/NavBar';
import backgroundLogo from '../media/backgroundLogo.jpg';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function GetStudentDetailsOptions() {

    let [stduentViewOption, setStudentViewOption] = useState('stu-id');
    let [studentIdOrClass, setStudentIdOrClass] = useState("");
    let navigate = useNavigate();
    const location = useLocation();
    const { type, userAdmin, studentID } = location.state || {};

    useEffect(() => {
        if (studentID) {
            setStudentIdOrClass(studentID);
        }
    }, []);

    let goToStudentOrClassDetails = () => {
        if (type === 'GET') {
            if (stduentViewOption === 'stu-id') {
                navigate('/Student', { state: { studentID: studentIdOrClass, dataType: type, admin: userAdmin } });
            } else if (stduentViewOption === 'class') {
                if (studentIdOrClass === "") {
                    alert("Please a select class")
                } else {
                    navigate('/ClassList', { state: { classID: studentIdOrClass, userAdmin: userAdmin } });
                }
            }
        }
    }

    let getClassFeesInformation = () => {
        if (type === 'GET') {
            if (studentIdOrClass === "") {
                alert("Please a select class")
            } else {
                navigate('/classFeesList', { state: { classID: studentIdOrClass, userAdmin: userAdmin } });
            }
        }
    }

    let goToAllStudentList = () => {
        navigate('/StudentList', { state: { userAdmin: userAdmin } });
    }

    const updateStudentFees = () => {
        navigate('/feesUpdate', { state: { studentID: studentIdOrClass, type: 'PUT-FEES', admin: userAdmin } })
    }

    const updateStudentPersonalInfo = () => {
        navigate('/personalInfoUpdate', { state: { studentID: studentIdOrClass, type: 'PUT-PERSONAL', admin: userAdmin } })
    }


    return (<>
        <NavBar admin={userAdmin}></NavBar>
        <img className="option-page-bg" src={backgroundLogo}></img>
        <div className='student-option-container'>
            <div className='student-id-class-container'>
                {/* Options while getting student information: Get */}
                {
                    type === 'GET' && <>
                        <label className='option-page-dropdown-label' for="stu-options">View details by:</label>
                        <select className='option-page-dropdown' onChange={(e) => setStudentViewOption(e.target.value)} name="stu-options" id="stu-options">
                            <option value="stu-id">Student ID</option>
                            <option value="class">Class</option>
                        </select>
                        {
                            stduentViewOption === "stu-id" && <input onChange={(e) => setStudentIdOrClass(e.target.value)} className='student-option-input' placeholder='Enter Student ID'></input>
                        }

                        {
                            stduentViewOption === "class" && <>
                                <label className='option-page-dropdown-label' for="class-selection">Select Class:</label>
                                <select className='option-page-dropdown' onChange={(e) => setStudentIdOrClass(e.target.value)} name="stu-options" id="stu-options">
                                    <option value="" disabled selected>Please select class</option>
                                    <option value="Nursery">Nursery</option>
                                    <option value="KG1">KG1</option>
                                    <option value="KG2">KG2</option>

                                    <option value="1">1st</option>
                                    <option value="2">2nd</option>
                                    <option value="3">3rd</option>

                                    <option value="4">4th</option>
                                    <option value="5">5th</option>
                                    <option value="6">6th</option>

                                    <option value="7">7th</option>
                                    <option value="8">8th</option>
                                </select>
                            </>
                        }
                        {
                            stduentViewOption === 'stu-id' && <>
                                <button onClick={() => goToStudentOrClassDetails()} className='option-page-button'>Student Information</button>
                            </>

                        }
                        {
                            stduentViewOption === 'class' && <>
                                <button onClick={() => goToStudentOrClassDetails()} className='option-page-button'>Class Information</button>
                                <button onClick={() => getClassFeesInformation()} className='option-page-button'>Class Fees Information</button>
                            </>

                        }
                        <hr className='or-divider' ></hr>

                        <button onClick={() => goToAllStudentList()} className='option-page-button'>
                            Show All Student Data
                        </button>
                    </>

                }

                {/* Options while updating student information: Put */}
                {
                    (type === 'PUT' || type === 'PUT-FROM-TABLE') && <>
                        {
                            type === 'PUT' && <input onChange={(e) => setStudentIdOrClass(e.target.value)} className='student-option-input' placeholder='Enter Student ID'></input>
                        }

                        {
                            type === 'PUT-FROM-TABLE' && <div><p>Student ID: {studentIdOrClass}</p></div>
                        }
                        <hr className='or-divider' ></hr>
                        <button onClick={() => updateStudentPersonalInfo()} className='option-page-button'>
                            Update Student Personal Information
                        </button>
                        <hr className='or-divider' ></hr>

                        <button onClick={() => updateStudentFees()} className='option-page-button'>
                            Update student fees information
                        </button>
                    </>
                }
            </div>
        </div>
    </>)
}