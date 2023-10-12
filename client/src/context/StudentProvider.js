// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useAuth } from '../pages/Authentication/AuthContext';
// import { getStudentById, updateStudent, createStudent, deleteStudent } from '../api/studentsApi';
// import StudentContext from './StudentContext'; // Import the context you created

// export const StudentProvider = ({ children }) => {

//   const { user } = useAuth();

//   const [isCheckinOrOut, setIsCheckInOrOut] = useState("")
//   const [accumulatedUpdates, setAccumulatedUpdates] = useState({});
//   const [studentData, setStudentData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ------------------------------------------------------//
//   // useEffect to fetch a specific student by ID when the component mounts
//   useEffect(() => {
//    const storedStudentData = localStorage.getItem('studentData');
//    if (storedStudentData) {
//      setStudentData(JSON.parse(storedStudentData));
//    }

//     if(user && user.student) {
//         getStudentById(user.student)
//         .then((data) => {
//             setStudentData(data);
//             setLoading(false);
//             localStorage.setItem('studentData', JSON.stringify(data));
//         })
//         .catch((error) => {
//             console.error('Error fetching student data:', error);
//             setLoading(false);
//         });

//     } else {
//         setLoading(false);
//     }
//   }, [user]);

//   // ------------------------------------------------------//
//   // if the to-be-updated data is only one one page
//   const updateStudentDataImmediate = (newData) => {
//     setStudentData((prevData) => ({ ...prevData, ...newData }));
  
//     updateStudent(newData.id, newData)
//       .then(() => {
//         console.log('Student data updated successfully.');
//         localStorage.setItem('studentData', JSON.stringify({ ...studentData, ...newData }));
//       })
//       .catch((error) => {
//         console.error('Error updating student data:', error);
//       });
//   };

//   // ------------------------------------------------------//
//   // if the to-be-updated data is across multiple pages
//   const updateStudentDataAccumulated = (updatedFields) => {
//     setAccumulatedUpdates((prevUpdates) => ({ ...prevUpdates, ...updatedFields }));
//     console.log("set accumulated data: " + JSON.stringify(accumulatedUpdates))
//   };

//   const clearAccumulatedUpdates = () => {
//     setAccumulatedUpdates({});
//   };




//   // Might not be using
//   const createStudentData = async (newStudentData) => {
//     try {
//       const createdStudent = await createStudent(newStudentData); // Call your API function
//       setStudentData((prevData) => [...prevData, createdStudent]); // Add the created student to the state
//       localStorage.setItem('studentData', JSON.stringify([...studentData, createdStudent])); // Update localStorage
//       console.log('Student data created successfully.');
//     } catch (error) {
//       console.error('Error creating student data:', error);
//     }
//   };

//   // Might not be using
//   const deleteStudentData = async (studentId) => {
//     try {
//       await deleteStudent(studentId); // Call your API function
//       const updatedStudentData = studentData.filter((student) => student.id !== studentId); // Remove the deleted student from the state
//       setStudentData(updatedStudentData);
//       localStorage.setItem('studentData', JSON.stringify(updatedStudentData)); // Update localStorage
//       console.log('Student data deleted successfully.');
//     } catch (error) {
//       console.error('Error deleting student data:', error);
//     }
//   };

//   const values = {
//     studentData,
//     updateStudentDataAccumulated,
//     updateStudentDataImmediate,
//     accumulatedUpdates,
//     clearAccumulatedUpdates,
//     setIsCheckInOrOut,
//     isCheckinOrOut
//   };

//   return (
//     <StudentContext.Provider value={values}>
//       {loading ? <div>Loading...</div> : children}
//     </StudentContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../pages/Authentication/AuthContext';
import { getStudentById, updateStudent, createStudent, deleteStudent } from '../api/studentsApi';
import { getTeacherById, updateTeacher, createTeacher} from '../api/teachersApi';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckinOrOut, setIsCheckInOrOut] = useState("")
  const [accumulatedUpdates, setAccumulatedUpdates] = useState({});

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    if (user) {
      if (user.student) {
        getStudentById(user.student)
          .then((data) => {
            setUserData(data);
            setLoading(false);
            localStorage.setItem('userData', JSON.stringify(data));
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            setLoading(false);
          });
      } if (user.teacher) {
        getTeacherById(user.teacher)
          .then((data) => {
            setUserData(data);
            setLoading(false);
            localStorage.setItem('userData', JSON.stringify(data));
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            setLoading(false);
          });
      }
    } else {
      setLoading(false);
    }
  }, [user])

  // Function to update user data
  const updateUser = (newData) => {
    console.log(user.student)
    if (user.student) {
      setUserData((prevData) => ({ ...prevData, ...newData }));
      updateStudent(newData.id, newData)
        .then(() => {
          console.log('Student data updated successfully.');
          localStorage.setItem('userData', JSON.stringify({ ...userData, ...newData }));
        })
        .catch((error) => {
          console.error('Error updating student data:', error);
        });
    } else if (user.teacher) {
      setUserData((prevData) => ({ ...prevData, ...newData }));
      updateTeacher(newData.id, newData)
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