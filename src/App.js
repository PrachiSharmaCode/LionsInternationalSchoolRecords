import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewStudent from './NewStudent/NewStudent';
import UpdateStudent from './UpdateStudent/UpdateStudent';
import StudentData from './StudentData/StudentData';
import Home from './Home/Home';
import Login from './LoginPage/Login';
import GetStudentDetailsOptions from './GetStudentDeatilsOptions/GetStudentDetailsOptions';
import StudentList from './StudentList/StudentList';
import StudentListByClass from './StudentListByClass/StudentListByClass';
import FeeForm from './FeesForm/FeesForm';
import PersonalInfoForm from './PersonalInfroForm/PersonalInfoForm';
import StudentFeesListByClass from './StudentFeesListByClass/StudentFeesListByClass';
import { AuthProvider } from './AuthContext/AuthContext';
import PrivateRoute from './PrivateRoute/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/action"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/newStudent"
            element={
              <PrivateRoute>
                <NewStudent />
              </PrivateRoute>
            }
          />
          <Route
            path="/updateStudent"
            element={
              <PrivateRoute>
                <UpdateStudent />
              </PrivateRoute>
            }
          />
          <Route
            path="/student"
            element={
              <PrivateRoute>
                <StudentData />
              </PrivateRoute>
            }
          />
          <Route
            path="/studentList"
            element={
              <PrivateRoute>
                <StudentList />
              </PrivateRoute>
            }
          />
          <Route
            path="/classList"
            element={
              <PrivateRoute>
                <StudentListByClass />
              </PrivateRoute>
            }
          />
          <Route
            path="/classFeesList"
            element={
              <PrivateRoute>
                <StudentFeesListByClass />
              </PrivateRoute>
            }
          />
          <Route
            path="/personalInfoUpdate"
            element={
              <PrivateRoute>
                <PersonalInfoForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/student-options"
            element={
              <PrivateRoute>
                <GetStudentDetailsOptions />
              </PrivateRoute>
            }
          />
          <Route
            path="/feesUpdate"
            element={
              <PrivateRoute>
                <FeeForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


