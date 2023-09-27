import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../pages/Authentication/AuthContext';
import { getStudentById, updateStudent } from '../api/studentsApi';

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

// StudentProvider component
export const StudentProvider = ({ children }) => {
    const { user } = useAuth();
  // State to store student data
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect to fetch a specific student by ID when the component mounts
  useEffect(() => {
   console.log("helloooo ")
    if(user && user.student) {
        getStudentById(user.student)
        .then((data) => {
            setStudentData(data);
            setLoading(false);
        })
        .catch((error) => {
            // Handle errors, e.g., show an error message or log the error
            console.error('Error fetching student data:', error);
            setLoading(false);
        });

    } else {
        setLoading(false);
    }
  }, [user]);

  // Function to update student data and send changes to the backend
  const updateStudentData = (newData) => {
    // Update student data locally
    setStudentData((prevData) => ({ ...prevData, ...newData }));

    // Send the updated data to the backend using the API function
    updateStudent(newData.id, newData)
      .then(() => {
        // Handle success, e.g., show a success message
        console.log('Student data updated successfully.');
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message or log the error
        console.error('Error updating student data:', error);
      });
  };

  // Create a context value object with data and functions
  const values = {
    studentData,
    updateStudentData,
  };

  // Provide the context value to children components
  return (
    <StudentContext.Provider value={values}>
      {loading ? <div>Loading...</div> : children}
    </StudentContext.Provider>
  );
};