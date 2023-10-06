import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../pages/Authentication/AuthContext';
import { getStudentById, updateStudent } from '../api/studentsApi';

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

// StudentProvider component
export const StudentProvider = ({ children }) => {
    const { user } = useAuth();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect to fetch a specific student by ID when the component mounts
  useEffect(() => {
   const storedStudentData = localStorage.getItem('studentData');
   if (storedStudentData) {
     setStudentData(JSON.parse(storedStudentData));
   }

    if(user && user.student) {
        getStudentById(user.student)
        .then((data) => {
            setStudentData(data);
            setLoading(false);
            localStorage.setItem('studentData', JSON.stringify(data));
        })
        .catch((error) => {
            console.error('Error fetching student data:', error);
            setLoading(false);
        });

    } else {
        setLoading(false);
    }
  }, [user]);

  const updateStudentData = (newData) => {
    setStudentData((prevData) => ({ ...prevData, ...newData }));

    updateStudent(newData.id, newData)
      .then(() => {
        console.log('Student data updated successfully.');
        localStorage.setItem('studentData', JSON.stringify(studentData));
      })
      .catch((error) => {
        console.error('Error updating student data:', error);
      });
  };

  const values = {
    studentData,
    updateStudentData,
  };

  return (
    <StudentContext.Provider value={values}>
      {loading ? <div>Loading...</div> : children}
    </StudentContext.Provider>
  );
};