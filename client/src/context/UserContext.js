import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../pages/Authentication/AuthContext';
import { getStudentById, updateStudent, createStudent, deleteStudent } from '../api/studentsApi';
import { getTeacherById, updateTeacher, createTeacher } from '../api/teachersApi';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckinOrOut, setIsCheckInOrOut] = useState("");
  const [accumulatedUpdates, setAccumulatedUpdates] = useState({});

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
      // If user data is in local storage, use it
      setUserData(JSON.parse(storedUserData));
      setLoading(false);
    }

    if (user) {
      if (user.student) {
        getStudentById(user.student)
          .then((data) => {
            setUserData(data);
            // Save user data to local storage here
            localStorage.setItem('userData', JSON.stringify(data));
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            setLoading(false);
          });
      } else if (user.teacher) {
        getTeacherById(user.teacher)
          .then((data) => {
            setUserData(data);
            // Save user data to local storage here
            localStorage.setItem('userData', JSON.stringify(data));
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            setLoading(false);
          });
      }
    } else {
      setLoading(false);
    }
  }, [user]);


  // Function to update user data
  const updateUser = (newData) => {
    if (newData && newData._id) {
      console.log("new data and id yesss")
      setUserData((prevData) => ({ ...prevData, ...newData }));
      updateTeacher(newData._id, newData)
        .then(() => {
          console.log('Teacher data updated successfully.');
          localStorage.setItem('userData', JSON.stringify({ ...userData, ...newData }));
        })
        .catch((error) => {
          console.error('Error updating teacher data:', error);
        });
    }
  };


  const updateUserDataAccumulated = (updatedFields) => {
    setAccumulatedUpdates((prevUpdates) => ({ ...prevUpdates, ...updatedFields }));
    console.log("set accumulated data: " + JSON.stringify(accumulatedUpdates))
  };

  const clearAccumulatedUpdates = () => {
    setAccumulatedUpdates({});
  };

  // Function to create user data
  const createUser = (newUserData) => {
    if (user.student) {
      createStudent(newUserData)
        .then((createdData) => {
          console.log('Student data created successfully.');
          setUserData((prevData) => [...prevData, createdData]);
          localStorage.setItem('userData', JSON.stringify([...userData, createdData]));
        })
        .catch((error) => {
          console.error('Error creating student data:', error);
        });
    } else if (user.teacher) {
      createTeacher(newUserData)
        .then((createdData) => {
          console.log('Teacher data created successfully.');
          setUserData((prevData) => [...prevData, createdData]);
          localStorage.setItem('userData', JSON.stringify([...userData, createdData]));
        })
        .catch((error) => {
          console.error('Error creating teacher data:', error);
        });
    }
  };

  // Function to delete user data
  const deleteUser = (userId) => {
    if (user.student) {
      deleteStudent(userId)
        .then(() => {
          console.log('Student data deleted successfully.');
          const updatedData = userData.filter((data) => data.id !== userId);
          setUserData(updatedData);
          localStorage.setItem('userData', JSON.stringify(updatedData));
        })
        .catch((error) => {
          console.error('Error deleting student data:', error);
        });
      // } else if (user.teacher) {
      //   deleteTeacher(userId)
      //     .then(() => {
      //       console.log('Teacher data deleted successfully.');
      //       const updatedData = userData.filter((data) => data.id !== userId);
      //       setUserData(updatedData);
      //       localStorage.setItem('userData', JSON.stringify(updatedData));
      //     })
      //     .catch((error) => {
      //       console.error('Error deleting teacher data:', error);
      //     });
    }
  };

  const values = {
    userData,
    updateUser,
    createUser,
    deleteUser,
    setLoading,
    isCheckinOrOut,
    setIsCheckInOrOut,
    accumulatedUpdates,
    updateUserDataAccumulated,
    clearAccumulatedUpdates,
  };

  return (
    <UserContext.Provider value={values}>
      {loading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  );
};