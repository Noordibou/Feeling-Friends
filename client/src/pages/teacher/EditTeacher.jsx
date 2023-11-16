import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherById, getAllStudentsClassroom, addStudentToTeacherClassroom, deleteStudentFromClassroom } from '../../api/teachersApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const EditTeacher = () => {
    const navigate = useNavigate();
    const { userData, updateUser } = useUser();
    const [formData, setFormData] = useState({
        prefix: '',
        avatarImg: '',
        firstName: '',
        lastName: '',
        schoolTeacherId: '',
        classrooms: [],
    });
    const [studentsData, setStudentsData] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedClassroomIndex, setSelectedClassroomIndex] = useState(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await getTeacherById(userData._id);
                setFormData(response);
                const studentsPromises = response.classrooms.map(classroom => {
                    return getAllStudentsClassroom(userData._id, classroom._id);
                });

                const students = await Promise.all(studentsPromises);
                setStudentsData(students);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTeacherData();
    }, [userData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleClassroomInputChange = (event, classroomIndex, field) => {
        const updatedClassrooms = [...formData.classrooms];
        updatedClassrooms[classroomIndex][field] = event.target.value;
        setFormData({
            ...formData,
            classrooms: updatedClassrooms,
        });
    };

    // const handleStudentInputChange = (event, classroomIndex, studentIndex, field) => {
    //     const updatedStudentsData = [...studentsData];
    //     updatedStudentsData[classroomIndex][studentIndex][field] = event.target.value;
    //     setStudentsData(updatedStudentsData);
    // };

    const addStudentToClassroom = async () => {
        if (selectedClassroomIndex !== null) {
            try {
                const classroom = formData.classrooms[selectedClassroomIndex];
                const teacherId = userData._id;
                const classroomId = classroom._id;

                // Make an API call to add a student to the classroom
                const response = await addStudentToTeacherClassroom(teacherId, classroomId);

                if (response && response.student) {
                    const updatedClassrooms = [...formData.classrooms];
                    updatedClassrooms[selectedClassroomIndex].students.push(response.student);
                    setFormData({
                        ...formData,
                        classrooms: updatedClassrooms,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const removeStudentFromClassroom = async (classroomIndex, studentId) => {
        const classroom = formData.classrooms[classroomIndex];
        const teacherId = userData._id;
        const classroomId = classroom._id;

        // Make an API call to remove a student from the classroom
        await deleteStudentFromClassroom(teacherId, classroomId, studentId);

        const updatedClassrooms = [...formData.classrooms];
        const studentIndex = updatedClassrooms[classroomIndex].students.findIndex(student => student._id === studentId);
        if (studentIndex !== -1) {
            updatedClassrooms[classroomIndex].students.splice(studentIndex, 1);
            setFormData({
                ...formData,
                classrooms: updatedClassrooms,
            });
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            // Update teacher data
            await updateUser(formData);

            // Update student data for each classroom
            // formData.classrooms.forEach(async (classroom, classroomIndex) => {
            //     classroom.students.forEach(async (student) => {
            //         await updateStudent(userData._id, classroom._id, student._id, {
            //             firstName: student.firstName,
            //             lastName: student.lastName,
            //             iepStatus: student.iepStatus,
            //         });
            //     });
            // });

            navigate('/teacher-home');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='h-full min-h-screen flex flex-col items-center '>
            <h1 className='m-4 font-header1'>Edit Teacher</h1>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Prefix: </label>
                    <input type="text" name="prefix" value={formData.prefix} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Avatar Image: </label>
                    <input type="text" name="avatarImg" value={formData.avatarImg} onChange={handleInputChange} />
                </div>
                <div>
                    <label>First Name: </label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Last Name: </label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>School Teacher ID: </label>
                    <input type="text" name="schoolTeacherId" value={formData.schoolTeacherId} onChange={handleInputChange} />
                </div>
                {/* Classroom details */}
                {formData.classrooms.map((classroom, classroomIndex) => (
                    <div key={classroomIndex}>
                        <label>Class Subject: </label>
                        <input
                            type="text"
                            name={`classrooms[${classroomIndex}].classSubject`}
                            value={classroom.classSubject}
                            onChange={(event) => handleClassroomInputChange(event, classroomIndex, 'classSubject')}
                        />
                        <label>Location: </label>
                        <input
                            type="text"
                            name={`classrooms[${classroomIndex}].location`}
                            value={classroom.location}
                            onChange={(event) => handleClassroomInputChange(event, classroomIndex, 'location')}
                        />

                        <ul>
                            {Array.isArray(studentsData[classroomIndex]) &&
                                studentsData[classroomIndex].map((student, studentIndex) => (
                                    <li key={studentIndex}>
                                        <span>{student.firstName} {student.lastName}</span>
                                        <button className='border rounded-md mx-4'
                                            onClick={() => removeStudentFromClassroom(classroomIndex, student._id)}
                                        >
                                            Remove Student
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
                {/* Add Student section */}
                <div>
                    <h2>Add Student to Classroom</h2>
                    <select onChange={(event) => setSelectedClassroomIndex(event.target.value)}>
                        <option value="">Select a Classroom</option>
                        {formData.classrooms.map((classroom, index) => (
                            <option key={index} value={index}>{classroom.classSubject}</option>
                        ))}
                    </select>
                    <button onClick={addStudentToClassroom}>Add Student to Classroom</button>
                </div>
                <button className='border rounded-md my-4' type="submit">Update Teacher</button>
            </form>
        </div>
    );
};

export default EditTeacher;

{/* <label>Students:</label>
                        <ul>
                            {Array.isArray(studentsData[classroomIndex]) &&
                                studentsData[classroomIndex].map((student, studentIndex) => (
                                    <li key={studentIndex}>
                                        <input
                                            type="text"
                                            value={student.firstName}
                                            onChange={(event) =>
                                                handleStudentInputChange(event, classroomIndex, studentIndex, 'firstName')
                                            }
                                        />
                                        <input
                                            type="text"
                                            value={student.lastName}
                                            onChange={(event) =>
                                                handleStudentInputChange(event, classroomIndex, studentIndex, 'lastName')
                                            }
                                        />
                                        <select
                                            value={student.iepStatus}
                                            onChange={(event) =>
                                                handleStudentInputChange(event, classroomIndex, studentIndex, 'iepStatus')
                                            }
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </li>
                                ))}
                        </ul> */}


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useUser } from '../context/UserContext';
// import { getTeacherById, getAllStudentsClassroom, deleteClassroom } from '../api/teachersApi';
// import { getBackgroundColorClass, calculateZorPercentage } from '../components/classRoomColors';
// import xButton from '../images/x-button.png';
// import { createClassroom } from '../api/teachersApi'

// const TeacherHome = () => {
//   const { userData } = useUser();
//   const [studentsData, setStudentsData] = useState([]);
//   const [selectedClassroom, setSelectedClassroom] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
//   const [newClassData, setNewClassData] = useState({
//     classSubject: "",
//     location: "",
//     students: [],
//   });

//   useEffect(() => {
//     const fetchTeacherData = async () => {
//       try {
//         const response = await getTeacherById(userData._id);
//         const studentsPromises = response.classrooms.map(async classroom => {
//           const students = await getAllStudentsClassroom(userData._id, classroom._id);
//           const zorPercentages = calculateZorPercentage({ students });
//           return { classroom, students, zorPercentages };
//         });

//         const classroomsWithStudents = await Promise.all(studentsPromises);
//         setStudentsData(classroomsWithStudents);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchTeacherData();
//   }, [userData]);

//   const handleDeleteClassroom = async (classroomId) => {
//     try {
//       await deleteClassroom(userData._id, classroomId);
//       // Reload the page after successful deletion
//       window.location.reload();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleEditClick = () => {
//     // Toggle edit mode
//     setIsEditMode(!isEditMode);
//     // Reset selected classroom when exiting edit mode
//     setSelectedClassroom(userData._id);
//   };

//   const handleCreateClassroom = async () => {
//     try {
//       const newClassroomData = {
//         classSubject: newClassData.classSubject,
//         location: newClassData.location,
//         students: newClassData.students,
//       };

//       const newClassroom = await createClassroom(userData._id, newClassroomData);

//       setStudentsData((prevData) => [
//         ...prevData,
//         {
//           classroom: newClassroom,
//         },
//       ]);

//       // Reset form visibility and input values after successful creation
//       setIsCreateFormVisible(false);
//       setNewClassData({
//         classSubject: "",
//         location: "",
//         students: [],
//       });

//       // You can add additional logic if needed

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // const generateEditLink = (classroomId) => `/edit/${userData?._id}/${classroomId}`;

//   return (
//     <>
//       <div className="h-screen">
//         <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[4rem] ">
//           {userData ? `Good morning, ${userData.prefix} ${userData.firstName}!` : 'Loading...'}
//         </h1>

//         <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] h-[80%] overflow-y-auto">
         
//           {isCreateFormVisible && (
//         <div>
//           <label>Class Subject:</label>
//           <input
//             type="text"
//             value={newClassData.classSubject}
//             onChange={(e) =>
//               setNewClassData((prevData) => ({
//                 ...prevData,
//                 classSubject: e.target.value,
//               }))
//             }
//           />
//           <label>Location:</label>
//           <input
//             type="text"
//             value={newClassData.location}
//             onChange={(e) =>
//               setNewClassData((prevData) => ({
//                 ...prevData,
//                 location: e.target.value,
//               }))
//             }
//           />
//           <label>Students:</label>
//           <input
//             type="text"
//             value={newClassData.students}
//             onChange={(e) =>
//               setNewClassData((prevData) => ({
//                 ...prevData,
//                 students: e.target.value,
//               }))
//             }
//           />

//           <button onClick={handleCreateClassroom}>Create New Class</button>
//         </div>
//       )}
// <h2 className="text-header2 font-header2 text-center mb-[2rem]">
//       <button
//         onClick={() => {
//           setIsCreateFormVisible(!isCreateFormVisible);
//           setIsEditMode(false); // Close edit mode when opening the form
//         }}
//       >
        
//         {isCreateFormVisible ? "Cancel" : isEditMode ? "Create New Class" : "All Classes at a Glance"}
//       </button>
//       </h2>

//           {studentsData.length > 0 ? (
//             studentsData.map(({ classroom, students, zorPercentages }, index) => {
//               let firstNonZeroIndex = 0;
//               for (let i = 0; i < Object.entries(zorPercentages).length; i++) {
//                 const [zor, percentage] = Object.entries(zorPercentages)[i];
//                 if (percentage > 0) {
//                   firstNonZeroIndex = i;
//                   break;
//                 }
//               }
//               return (
//                 <div key={index}>
//                   <div className="flex justify-between">
//                     <h2 className="text-header2 font-header2 text-left">
//                       {classroom.classSubject}
//                     </h2>
//                     {selectedClassroom === userData._id && (
//                       <button onClick={() => handleDeleteClassroom(classroom._id)}>
//                         <img src={xButton} alt="xButton" />
//                       </button>
//                     )}
//                   </div>
//                   <div className="bg-notebookPaper p-[1rem] rounded-[1rem]">
//                     <div className="flex justify-between mb-[1rem]">
//                       <div className="text-sm font-body">{classroom.location}</div>
//                       <div className="text-sm font-body text-sandwich">Check-in: 8AM &nbsp;&nbsp; Check-out: 2PM</div>
//                     </div>
//                     <div className="flex justify-between">
//                       <div className="flex w-[80%] bg-sandwich rounded-[1rem]">
//                         {Object.entries(zorPercentages).map(([zor, percentage], i, arr) => (
//                           <div
//                             key={zor}
//                             style={{ width: `${percentage}%` }}
//                             className={`bg-${getBackgroundColorClass(zor)} ${i === firstNonZeroIndex ? 'rounded-l-[1rem]' : ''} ${i === arr.length - 1 ? 'rounded-r-[1rem]' : ''} h-[2.5rem]`}
//                           ></div>
//                         ))}
//                       </div>
//                       <div className="text-body font-body underline">
//                         <Link to={`/classroom/${userData._id}/${classroom._id}`}>More &gt;</Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p>Loading classrooms...</p>
//           )}

//           <div className="font-body text-body text-center pt-[2rem] ">
//             {userData ? `Logged in as ${userData.firstName} ${userData.lastName}  ` : 'Loading...'}
//             <button className="underline" onClick={handleEditClick}>{isEditMode ? "Cancel" : "(edit)"}</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TeacherHome;