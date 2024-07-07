import React, { useEffect, useState, useMemo } from 'react';
import DataTable from '../DataTable/DataTable';
import NavBar from '../Navbar/NavBar';
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import "./studentList.css";
import FilterButton from '../FilterButton/FilterButton';

import { useLocation } from "react-router-dom";

export default function StudentList() {

    let [studentList, setStudentList] = useState([]);
    let [showFilter, setShowFilter] = useState(false);
    const location = useLocation();
    const { userAdmin } = location.state || {};
    let [stduentsExist, setStduentsExist] = useState(true);
    let navigate = useNavigate();


    const updateStudentDetails = (student_ID) => {
        navigate('/student-options', { state: { type: 'PUT-FROM-TABLE', userAdmin: userAdmin, studentID: student_ID } })
    }

    const initialColumns = [
        { Header: 'Student ID', accessor: 'student_id' },
        { Header: 'Name', accessor: 'Name' },
        { Header: 'Father Name', accessor: 'Fathers_Name' },
        { Header: 'Class', accessor: 'Class' },
        { Header: 'Date of Birth', accessor: 'DOB' },
        { Header: 'Caste', accessor: 'Caste' },
        { Header: 'Contact Number 1', accessor: 'Contact_Number_1' },
        { Header: 'Contact Number 2', accessor: 'Contact_Number_2' },
        { Header: 'Address', accessor: 'Address' },
        { Header: 'Adhaar Number', accessor: 'Adhaar' },
        { Header: 'SSSMID', accessor: 'SSSMID' },
        { Header: 'Scholar Number', accessor: 'Scholar_Number' },
        { Header: 'PAN Number', accessor: 'PAN' },
        { Header: 'Height', accessor: 'Height' },
        { Header: 'Weight', accessor: 'Weight' },
        { Header: 'Blood Group', accessor: 'Blood_Group' },
        { Header: 'Previous School', accessor: 'Previous_School' },
        { Header: 'Fees', accessor: 'Fees' },
        { Header: 'Fees Received', accessor: 'Fees_Received' },
        { Header: 'Remaining', accessor: 'Remaining' },
        { Header: 'Overall Collection', accessor: 'Overall_Collection' },
        {
            Header: 'First Installment',
            accessor: 'Mode.I_Installment',
            Cell: ({ value }) => (
                <div className='student-list-intallment-info'>
                    {
                        value?.Amount && <p>Amount: {value?.Amount}</p>
                    }
                    {
                        value?.Mode && <p>Mode: {value?.Mode}</p>
                    }
                    {value?.Cheque_Number && <p>Cheque Number: {value.Cheque_Number}</p>}
                    {value?.Bank_Name && <p>Bank Name: {value.Bank_Name}</p>}
                </div>
            ),
            excludeFromCSV: false
        },
        {
            Header: 'Second Installment',
            accessor: 'Mode.II_Installment',
            Cell: ({ value }) => (
                <div className='student-list-intallment-info'>
                    {
                        value?.Amount && <p>Amount: {value?.Amount}</p>
                    }
                    {
                        value?.Mode && <p>Mode: {value?.Mode}</p>
                    }
                    {value?.Transection_Id && <p>Transaction ID: {value.Transection_Id}</p>}
                </div>
            ),
            excludeFromCSV: false
        },
        {
            Header: 'Third Installment',
            accessor: 'Mode.III_Installment',
            Cell: ({ value }) => (
                <div className='student-list-intallment-info'>
                    {
                        value?.Amount && <p>Amount: {value?.Amount}</p>
                    }
                    {
                        value?.Mode && <p>Mode: {value?.Mode}</p>
                    }
                    {value?.Cheque_Number && <p>Cheque Number: {value.Cheque_Number}</p>}
                    {value?.Bank_Name && <p>Bank Name: {value.Bank_Name}</p>}
                </div>
            ),
            excludeFromCSV: false
        },
        {
            Header: 'Fourth Installment',
            accessor: 'Mode.IV_Installment',
            Cell: ({ value }) => (
                <div className='student-list-intallment-info'>
                    {
                        value?.Amount && <p>Amount: {value?.Amount}</p>
                    }
                    {
                        value?.Mode && <p>Mode: {value?.Mode}</p>
                    }
                    {value?.Cheque_Number && <p>Cheque Number: {value.Cheque_Number}</p>}
                    {value?.Bank_Name && <p>Bank Name: {value.Bank_Name}</p>}
                </div>
            ),
            excludeFromCSV: false
        },
        {
            Header: 'Edit', accessor: 'edit',

            Cell: ({ row }) => (
                <div >
                    <button onClick={() => updateStudentDetails(row.original.student_id)} className='student-table-button'>Update</button>
                </div>
            ),
            excludeFromCSV: true
        },
    ];

    let fetchStduentList = async () => {
        try {
            const response = await fetch(`https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
                }
            });

            const stuData = await response.json();

            if (response.ok) {
                setStudentList(stuData.response);
                if (stuData.response.length === 0) {
                    setStduentsExist(false);
                }
            } else {
                setStduentsExist(false);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchStduentList();
    }, []);

    const [columns, setColumns] = useState(initialColumns);
    const [selectedColumns, setSelectedColumns] = useState(
        initialColumns.reduce((acc, col) => {
            acc[col.accessor] = true;
            return acc;
        }, {})
    );

    const [tempSelectedColumns, setTempSelectedColumns] = useState(selectedColumns);

    const handleColumnChange = (name, checked) => {
        setTempSelectedColumns(prev => ({ ...prev, [name]: checked }));
    };

    const applyFilter = () => {
        setSelectedColumns(tempSelectedColumns);
        setColumns(
            initialColumns.filter(col => tempSelectedColumns[col.accessor])
        );
        setShowFilter(false);
    }

    const cancelFilter = () => {
        setTempSelectedColumns(selectedColumns);
        setShowFilter(false);
    }

    const openFilter = () => {
        setShowFilter(true);
    }

    const csvData = [
        initialColumns
            .filter(col => selectedColumns[col.accessor] && !col.excludeFromCSV)
            .map(col => col.Header),
        ...studentList.map(student => initialColumns
            .filter(col => selectedColumns[col.accessor] && !col.excludeFromCSV)
            .map(col => {
                if (col.accessor.startsWith('Mode.')) {
                    const modeData = col.accessor.split('.')[1];
                    const value = student.Mode[modeData];
                    return value?.Mode === "Cheque" ? `Amount: ${value?.Amount || ''}\nMode: ${value?.Mode || ''}\nBank Name: ${value?.Bank_Name || ''}\nCheque Number: ${value?.Cheque_Number || ''}`
                        : value?.Mode === "UPI" ? `Amount: ${value?.Amount || ''}\nMode: ${value?.Mode || ''}\nTransaction ID: ${value?.Transection_Id || ''}`
                            : value?.Mode === "Cash" ? `Amount: ${value?.Amount || ''}\nMode: ${value?.Mode || ''}` : "";
                } else if (col.accessor.includes('Installment')) {
                    const modeData = col.accessor.split('.')[1];
                    const installment = student.Mode[modeData];
                    return `${col.Header}: ${installment?.Amount || ''}\nMode: ${installment?.Mode || ''}\n${installment?.Cheque_Number ? `Cheque Number: ${installment.Cheque_Number}\n` : ''}${installment?.Bank_Name ? `Bank Name: ${installment.Bank_Name}\n` : ''}${installment?.Transection_Id ? `Transaction ID: ${installment.Transection_Id}\n` : ''}`;
                }
                return student[col.accessor];
            })
        ),
    ];


    return (<>
        <NavBar admin={userAdmin}></NavBar>
        <div className="student-list-container">
            {
                studentList && <>

                    <div className='export-button-student-list'>
                        {
                            userAdmin &&
                            <button className="downloadbtn">
                                 <CSVLink className="downloadbtn" filename={`Lions_Student_List.csv`} data={csvData}>Download</CSVLink>
                            </button>
                        }
                        <button onClick={() => openFilter()} className='student-list-filter-button'>Filter Table Coloums</button>
                    </div>

                    <div className='student-list-table-conatiner'>
                        {showFilter &&
                            <FilterButton
                                columns={initialColumns}
                                selectedColumns={selectedColumns}
                                onColumnChange={handleColumnChange}
                                onApplyFilter={applyFilter}
                                onCancelFilter={cancelFilter}
                            />
                        }
                        <DataTable columns={columns} data={studentList}></DataTable>
                        {
                            !stduentsExist && <p>No students to display!</p>
                        }
                    </div>
                </>
            }
        </div>
    </>)
}