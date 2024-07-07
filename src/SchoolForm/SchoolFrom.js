import React, { useState, useEffect } from 'react';
import "./schoolFrom.css";
import { useNavigate } from "react-router-dom";

export default function SchoolForm(props) {

    let [paymentMethodMode, setPaymentMethodMode] = useState('Cash');
    let [currentInstallment, setCurrentInstallment] = useState('I_Installment');
    let [TransactionDetails, setTransactionDetails] = useState({});
    let [newStudent, setNewStudent] = useState({});
    let [editInstallment, setEditInstallment] = useState(false);
    let [allInstallmentComplete, setAllInstallmentComplete] = useState(false);
    let navigate = useNavigate();

    const installmentKeys = {
        'I_Installment': 'First',
        'II_Installment': 'Second',
        'III_Installment': 'Third',
        'IV_Installment': 'Fourth'
    }

    useEffect(() => {
        if (props.type === 'PUT-FEES' || props.type === 'GET' || props.type === 'PUT-PERSONAL') {
            if (props.studentData) {
                const updatedStudent = { ...props.studentData };
                setNewStudent(updatedStudent);
                if (props.type === 'PUT-FEES') {
                    if (updatedStudent['Mode']) {
                        if (Object.keys(updatedStudent['Mode']).length === 1) {
                            setCurrentInstallment("II_Installment");
                        }
                        if (Object.keys(updatedStudent['Mode']).length === 2) {
                            setCurrentInstallment("III_Installment");
                        }
                        if (Object.keys(updatedStudent['Mode']).length === 3) {
                            setCurrentInstallment("IV_Installment");
                        }
                        if (Object.keys(updatedStudent['Mode']).length === 4) {
                            setAllInstallmentComplete(true);
                        }
                    }
                }
            }
        }
    }, [props.type, props.studentData]);

    const editStudentInstallment = () => {
        setCurrentInstallment("I_Installment");
        setEditInstallment(true);
    }

    const cancelAction = () => {
        if (props.type === 'PUT-FEES' || props.type === 'PUT-PERSONAL') {
            navigate('/Student', { state: { studentID: newStudent.student_id, dataType: 'GET', admin: props.admin } });
        }
        if (props.type === 'POST') {
            navigate('/action', { state: { admin: props.admin } });
        }
    }

    const SaveData = () => {
        updatePaymentdetails();
        if (validateForm()) {
            props.buttonClikcAction(newStudent);
        } else {
            alert(`Please enter in all required fields.`);
        }
    };

    const validateForm = () => {
        if (!newStudent.Name || !newStudent.Class || !newStudent.Admission_Fees || !newStudent.Annual_Fees || !newStudent.Discount || !newStudent['Mode'][currentInstallment]['Amount']) {
            return false;
        }
        return true;
    }

    const updateData = () => {
        if (props.type === 'PUT-FEES' && !allInstallmentComplete) {
            if (TransactionDetails['Amount']) {
                updatePaymentdetails();
            }
        }

        if (props.type === 'PUT-FEES' && editInstallment) {
            if (TransactionDetails['Amount']) {
                updatePaymentdetails();
                setEditInstallment(false);
            }
        }
        props.buttonClikcAction(newStudent);
    };

    const updateStudentFees = () => {
        navigate('/feesUpdate', { state: { studentID: newStudent.student_id, type: 'PUT-FEES', admin: props.admin } })
    }

    const updateStudentPersonalInfo = () => {
        navigate('/personalInfoUpdate', { state: { studentID: newStudent.student_id, type: 'PUT-PERSONAL', admin: props.admin } })
    }

    const handleInputChange = (key, value) => {
        setNewStudent(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    let updatePaymentdetails = () => {
        let tempStudent = newStudent;

        if (props.type === 'POST') {
            tempStudent['Mode'] = {

            }
        }
        tempStudent['Mode'][currentInstallment] = TransactionDetails;
        tempStudent['Mode'][currentInstallment]['Mode'] = paymentMethodMode;

        setNewStudent(tempStudent);
    }

    const getAllStudentFromCurrentClass = () => {
        navigate('/ClassList', { state: { classID: newStudent.Class, userAdmin: props.admin } });
    }

    const GetInstallmentInformation = () => {
        const payExample = newStudent['Mode'] || {};
        const keys = ['I_Installment', 'II_Installment', 'III_Installment', 'IV_Installment'];

        return keys.map((installment) => (
            <td className='payment-infromation-coloum' key={installment}>
                <p>{payExample[installment]?.['Amount'] ? "Amount: " + payExample[installment]['Amount'] : " "}</p>
                <p>{payExample[installment]?.['Mode'] ? "Mode: " + payExample[installment]['Mode'] : " "}</p>
                <p>{payExample[installment]?.['Transection_Id'] ? "Transaction ID: " + payExample[installment]['Transection_Id'] : " "}</p>
                <p>{payExample[installment]?.['Bank_Name'] ? "Bank Name: " + payExample[installment]['Bank_Name'] : " "}</p>
                <p>{payExample[installment]?.['Cheque_Number'] ? "Cheque Number: " + payExample[installment]['Cheque_Number'] : " "}</p>
            </td>
        ));
    };

    const preventScroll = (e) => {
        e.target.blur();
        setTimeout(() => {
            e.target.focus();
        }, 0);
    };

    return (<>

        <div className="new-student-form-heading">

            {
                props.type === 'POST' && <div className='student-info-non-edit'> <div>
                    <div className='student-information-heading'>
                        <p>Student Information</p>
                    </div>
                </div> </div>
            }
            {
                props.type === 'GET' && <div className='student-info-non-edit'> <div>
                    <div className='student-information-heading'>
                        <p>Student Information</p>
                    </div>
                    <p>Student ID: {newStudent.student_id}</p>
                </div> </div>
            }
            {
                (props.type === 'PUT-FEES' || props.type === 'PUT-PERSONAL') && <div className='student-info-non-edit'> <div>
                    <div className='student-information-heading'>
                        <p>Student Information</p>
                    </div>
                    <p>Student ID: {newStudent.student_id}</p>
                    <p>Name: {newStudent.Name}</p>
                    <p>Class: {newStudent.Class}</p>
                </div></div>
            }
            <div>

                {
                    props.type === 'GET' && <> <div className='header-buttons'>
                        <button className='new-student-form-button' onClick={() => updateStudentPersonalInfo()}>Update Student Personal Information</button>
                        <button className='new-student-form-button' onClick={() => updateStudentFees()}>Update Student Fees Information</button>
                        <button className='new-student-form-button' onClick={() => getAllStudentFromCurrentClass()}>See All Student From {newStudent.Class}</button>
                    </div>
                    </>
                }


            </div>
        </div>
        <div className="new-student-form">
            {
                (props.type === 'POST' || props.type === 'GET' || props.type === 'PUT-PERSONAL') && <>
                    <div className='section-divider-container'>
                        <div>
                            <p>Personal Information</p>
                        </div>
                    </div>

                    <div className='student-class-selection'>
                        <div className="form-field">
                            <label for="student-class-selection">{props.type === 'POST' && <span className='required-field'>*</span>}{(props.type === 'POST' || props.type === 'PUT-PERSONAL') ? "Select Class" : "Class"}</label>
                            <select disabled={props.type === 'GET'} value={newStudent.Class} className='form-dropdown' onChange={(e) => handleInputChange('Class', e.target.value)} name="student-class-selection" id="student-class-selection">
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
                        </div>
                    </div>

                    <div className="from-section">
                        <div className="form-field">
                            <p>{props.type === 'POST' && <span className='required-field'>*</span>}Full Name</p>
                            <input onChange={(e) => handleInputChange('Name', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Name} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Father's Name</p>
                            <input onChange={(e) => handleInputChange('Fathers_Name', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Fathers_Name} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Caste</p>
                            <input onChange={(e) => handleInputChange('Caste', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Caste} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Adhaar Number</p>
                            <input onChange={(e) => handleInputChange('Adhaar', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Adhaar} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Date of Addmission</p>
                            <input type="Date" onChange={(e) => handleInputChange('DOA', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.DOA} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Date Of Birth</p>
                            <input type="Date" onChange={(e) => handleInputChange('DOB', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.DOB} className="input-field"></input></div>
                        <div className="form-field">
                            <p>SSSMID</p>
                            <input onChange={(e) => handleInputChange('SSSMID', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.SSSMID} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Scholar Number</p>
                            <input onChange={(e) => handleInputChange('Scholar_Number', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Scholar_Number} className="input-field"></input></div>
                        <div className="form-field">
                            <p>PAN Number</p>
                            <input onChange={(e) => handleInputChange('PAN', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.PAN} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Height</p>
                            <input onChange={(e) => handleInputChange('Height', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Height} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Weight</p>
                            <input onChange={(e) => handleInputChange('Weight', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Weight} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Blood Group</p>
                            <input onChange={(e) => handleInputChange('Blood_Group', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Blood_Group} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Previous School</p>
                            <input onChange={(e) => handleInputChange('Previous_School', e.target.value)} disabled={props.type === 'GET'} defaultValue={newStudent.Previous_School} className="input-field"></input></div>
                    </div>

                    {/* Contact details  */}
                    <div className='section-divider-container'>
                        <div className='section-divider'>
                        </div>
                        <div>
                            <p>Contact Information</p>
                        </div>
                    </div>
                    <div className="from-section">
                        <div className="form-field">
                            <p>Contact Number 1</p>
                            <input disabled={props.type === 'GET'} onChange={(e) => handleInputChange('Contact_Number_1', e.target.value)} defaultValue={newStudent.Contact_Number_1} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Contact Number 2</p>
                            <input disabled={props.type === 'GET'} onChange={(e) => handleInputChange('Contact_Number_2', e.target.value)} defaultValue={newStudent.Contact_Number_2} className="input-field"></input></div>
                        <div className="form-field">
                            <p>Address</p>
                            <input disabled={props.type === 'GET'} onChange={(e) => handleInputChange('Address', e.target.value)} defaultValue={newStudent.Address} className="input-field"></input></div>
                    </div>
                </>
            }

            {(props.type === 'POST' || props.type === 'PUT-FEES' || props.type === 'GET') && <>
                <div className='section-divider-container'>
                    {
                        (props.type === 'GET' || props.type === 'POST') && <div className='section-divider'>
                        </div>
                    }
                    <div>
                        <p>Fees Information</p>
                    </div>
                </div>

                <div className="from-section">
                    {
                        (props.type === 'GET' || props.type === 'PUT-FEES') && <>

                            <div className="form-field">
                                <p>Fees </p>
                                <input onChange={(e) => handleInputChange('Fees', parseInt(e.target.value))} type="number" defaultValue={newStudent.Fees} disabled={props.type === 'GET' || props.type === 'PUT-FEES'} className="input-field"></input></div>
                            <div className="form-field">
                                <p>Fees Received</p>
                                <input onChange={(e) => handleInputChange('Fees_Received', parseInt(e.target.value))} type="number" defaultValue={newStudent.Fees_Received} disabled={props.type === 'GET' || props.type === 'PUT-FEES'} className="input-field"></input></div>

                        </>
                    }
                    <div className="form-field">
                        <div className='required-feild-container'>
                            <p>{props.type === 'POST' && <span className='required-field'>*</span>}Admission Fee</p>
                        </div>
                        <input onWheel={(e) => preventScroll(e)} onChange={(e) => handleInputChange('Admission_Fees', parseInt(e.target.value))} type="number" defaultValue={newStudent.Admission_Fees} disabled={props.type === 'GET' || (props.type === 'PUT-FEES' && !props.admin)} className="input-field"></input></div>
                    <div className="form-field">
                        <p>{props.type === 'POST' && <span className='required-field'>*</span>}Annual Fees</p>
                        <input onWheel={(e) => preventScroll(e)} onChange={(e) => handleInputChange('Annual_Fees', parseInt(e.target.value))} type="number" defaultValue={newStudent.Annual_Fees} disabled={props.type === 'GET' || (props.type === 'PUT-FEES' && !props.admin) || (props.type === 'PUT-FEES' && props.admin === 'undefined')} className="input-field"></input></div>

                    <div className="form-field">
                        <p>{props.type === 'POST' && <span className='required-field'>*</span>}Discount</p>
                        <input onWheel={(e) => preventScroll(e)} onChange={(e) => handleInputChange('Discount', parseInt(e.target.value))} type="number" defaultValue={newStudent.Discount} disabled={props.type === 'GET' || (props.type === 'PUT-FEES' && !props.admin)} className="input-field"></input></div>
                    {
                        (props.type === 'GET' || props.type === 'PUT-FEES') && <>
                            <div className="form-field">
                                <p>Remaining Fees</p>
                                <input onChange={(e) => handleInputChange('Remaining', parseInt(e.target.value))} type="number" defaultValue={newStudent.Remaining} disabled={props.type === 'GET' || props.type === 'PUT-FEES'} className="input-field"></input></div>
                            <div className="form-field">
                                <p>Overall Collection</p>
                                <input onChange={(e) => handleInputChange('Overall_Collection', parseInt(e.target.value))} type="number" defaultValue={newStudent.Overall_Collection} disabled={props.type === 'GET' || props.type === 'PUT-FEES'} className="input-field"></input></div>
                        </>
                    }

                </div>
            </>
            }

            {
                (props.type === 'POST' || (props.type === 'PUT-FEES' && !allInstallmentComplete) || (props.type === 'PUT-FEES' && editInstallment)) && <>
                    <div className='section-divider-container'>
                        <div className='section-divider'>
                        </div>
                        <div>
                            <p>Payment Information</p>
                            <p>Please Enter {installmentKeys[currentInstallment]} Installment Details</p>
                        </div>
                    </div>
                    <div className="from-section">

                        {editInstallment &&
                            <div className="form-field">
                                <label for="payment-method">Select Installment:</label>
                                <select className='form-dropdown' onChange={(e) => {
                                    setTransactionDetails({})
                                    setCurrentInstallment(e.target.value)
                                }} name="payment-method" id="payment-method">
                                    <option disabled={!newStudent['Mode'].I_Installment} value="I_Installment">First Installment</option>
                                    <option disabled={!newStudent['Mode'].II_Installment} value="II_Installment">Second Installment</option>
                                    <option disabled={!newStudent['Mode'].III_Installment} value="III_Installment">Third Installment</option>
                                    <option disabled={!newStudent['Mode'].IV_Installment} value="IV_Installment">Fourth Installment</option>
                                </select>
                            </div>
                        }
                        <div className="form-field">
                            <label for="payment-method">{props.type === 'POST' && <span className='required-field'>*</span>}Select Payment Mode:</label>
                            <select className='form-dropdown' onChange={(e) => {
                                setTransactionDetails({})
                                setPaymentMethodMode(e.target.value)
                            }} name="payment-method" id="payment-method">
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                    </div>

                    <div className='payment-details-section'>
                        <div className="from-section">
                            {paymentMethodMode === 'UPI' && (
                                <>
                                    <div className="form-field">
                                        <p>{props.type === 'POST' && <span className='required-field'>*</span>}Amount Paid:</p>
                                        <input
                                            type="number"
                                            onChange={(e) => setTransactionDetails(prevState => ({
                                                ...prevState,
                                                Amount: parseInt(e.target.value)
                                            }))}
                                            disabled={props.type === 'GET'}
                                            className="input-field"
                                            onWheel={(e) => preventScroll(e)}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <p>{props.type === 'POST' && <span className='required-field'>*</span>}Transaction ID</p>
                                        <input
                                            type="number"
                                            onChange={(e) => setTransactionDetails(prevState => ({
                                                ...prevState,
                                                Transection_Id: e.target.value
                                            }))}
                                            disabled={props.type === 'GET'}
                                            className="input-field"
                                        />
                                    </div>
                                </>
                            )}

                            {paymentMethodMode === 'Cash' && (
                                <>
                                    <div className="form-field">
                                        <p>{props.type === 'POST' && <span className='required-field'>*</span>}Amount Paid:</p>
                                        <input
                                            type="number"
                                            onChange={(e) => setTransactionDetails(prevState => ({
                                                ...prevState,
                                                Amount: parseInt(e.target.value)
                                            }))}
                                            disabled={props.type === 'GET'}
                                            className="input-field"
                                            onWheel={(e) => preventScroll(e)}
                                        />
                                    </div>
                                </>
                            )}

                            {paymentMethodMode === 'Cheque' && (
                                <>
                                    <div className="form-field">
                                        <p>{props.type === 'POST' && <span className='required-field'>*</span>}Amount Paid:</p>
                                        <input
                                            type="number"
                                            onChange={(e) => setTransactionDetails(prevState => ({
                                                ...prevState,
                                                Amount: parseInt(e.target.value)
                                            }))}
                                            disabled={props.type === 'GET'}
                                            className="input-field"
                                            onWheel={(e) => preventScroll(e)}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <p>{props.type === 'POST' && <span className='required-field'>*</span>}Bank Name</p>
                                        <input
                                            onChange={(e) => setTransactionDetails(prevState => ({
                                                ...prevState,
                                                Bank_Name: e.target.value
                                            }))}
                                            disabled={props.type === 'GET'}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <p>{props.type === 'POST' && <span className='required-field'>*</span>}Cheque Number</p>
                                        <input
                                            onChange={(e) => setTransactionDetails(prevState => ({
                                                ...prevState,
                                                Cheque_Number: e.target.value
                                            }))}
                                            disabled={props.type === 'GET'}
                                            className="input-field"
                                        />
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </>
            }

            {
                (props.type === 'GET' || props.type === 'PUT-FEES') && <>
                    <div className='installment-table-school-form'>
                        <table>
                            <tr>
                                <th>First Installment</th>
                                <th>Second Installment</th>
                                <th>Third Installment</th>
                                <th>Fourth Installment</th>
                            </tr>
                            <GetInstallmentInformation></GetInstallmentInformation>
                        </table>
                    </div>
                </>
            }

            {
                props.type === 'POST' && < div className="new-student-form-button-section" >
                    <button onClick={() => SaveData()} className="new-student-form-button">Save</button>
                    <button onClick={() => cancelAction()} className="new-student-form-button">Cancel</button>
                </div >
            }
            {(props.type === 'PUT-FEES' || props.type === 'PUT-PERSONAL') &&
                < div className="new-student-form-button-section" >
                    <button onClick={() => updateData()} className="new-student-form-button">Update</button>
                    <button onClick={() => cancelAction()} className="new-student-form-button">Cancel</button>
                    {
                        (props.type === 'PUT-FEES' && props.admin) && <>
                            <button onClick={() => editStudentInstallment()} className="new-student-form-button">Edit Installment</button>
                        </>
                    }
                </div >
            }
        </div>
    </>)
}