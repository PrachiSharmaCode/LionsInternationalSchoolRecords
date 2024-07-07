import React, { useState, useEffect } from 'react';
import "./studentListByClass.css";
import NavBar from '../Navbar/NavBar';
import DataTable from '../DataTable/DataTable';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import FilterButton from '../FilterButton/FilterButton';

export default function StudentListByClass() {

    let [classList, setClassList] = useState([]);
    let [classExist, setClassExist] = useState(true);
    let [showFilter, setShowFilter] = useState(false);
    let classMap = {
        "Nursery": "Nursery",
        "KG1": "KG1",
        "KG2": "KG2",
        "1": "1st",
        "2": "2nd",
        "3": "3rd",
        "4": "4th",
        "5": "5th",
        "6": "6th",
        "7": "7th",
        "8": "8th",
    }

    const location = useLocation();

    const { classID, userAdmin } = location.state || {};
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
        { Header: 'Contact No. 1', accessor: 'Contact_Number_1' },
        { Header: 'Contact No. 2', accessor: 'Contact_Number_2' },
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
                <div className='student-class-list-intallment-info'>
                    {
                        value?.Amount && <p>Amount: {value?.Amount}</p>
                    }
                    {
                        value?.Mode && <p>Mode: {value?.Mode}</p>
                    }
                    {value?.Cheque_Number && <p>Cheque Number: {value.Cheque_Number}</p>}
                    {value?.Bank_Name && <p>Bank Name: {value.Bank_Name}</p>}
                </div>
            )
        },
        {
            Header: 'Second Installment',
            accessor: 'Mode.II_Installment',
            Cell: ({ value }) => (
                <div className='student-class-list-intallment-info'>
                    {
                        value?.Amount && <p>Amount: {value?.Amount}</p>
                    }
                    {
                        value?.Mode && <p>Mode: {value?.Mode}</p>
                    }
                    {value?.Transection_Id && <p>Transaction ID: {value.Transection_Id}</p>}
                </div>
            ),
        },
        {
            Header: 'Third Installment',
            accessor: 'Mode.III_Installment',
            Cell: ({ value }) => (
                <div className='student-class-list-intallment-info'>
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
        },
        {
            Header: 'Fourth Installment',
            accessor: 'Mode.IV_Installment',
            Cell: ({ value }) => (
                <div className='student-class-list-intallment-info'>
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
                    'X-Api-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX'
                }
            });

            const stuData = await response.json();

            if (response.ok) {
                setClassList(stuData.response);
            } else {
                setClassExist(false);
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
        ...classList.map(student => initialColumns
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
        <div className='student-by-class-container'>
            {
                classList && <>
                    <div className='class-id-by-class'>
                        <h2>Class: {classMap[classID]}</h2>
                    </div>
                    <div className='export-button-student-class-list'>
                        {userAdmin &&
                            <button className="downloadbtn-by-class">
                                <CSVLink className="downloadbtn-by-class" filename={`${classID}_Lions_Student_List.csv`} data={csvData}>Download</CSVLink>
                            </button>
                        }
                        <button onClick={() => openFilter()} className='student-by-class-filter-button'>Filter Table Coloums</button>
                    </div>

                    <div className='student-class-list-table-conatiner'>
                        {showFilter &&
                            <FilterButton
                                columns={initialColumns}
                                selectedColumns={selectedColumns}
                                onColumnChange={handleColumnChange}
                                onApplyFilter={applyFilter}
                                onCancelFilter={cancelFilter}
                            />
                        }
                        <DataTable columns={columns} data={classList}></DataTable>
                        {
                            !classExist && <p>No students to display!</p>
                        }
                    </div>
                </>
            }
        </div>
    </>)
}