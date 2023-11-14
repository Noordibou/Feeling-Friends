import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from '../context/UserContext';
import { getTeacherById, getAllStudentsClassroom, deleteClassroom } from '../api/teachersApi';
import { getBackgroundColorClass, calculateZorPercentage } from '../components/classRoomColors';
import xButton from '../images/x-button.png';

const TeacherHome = () => {
  const { userData } = useUser();
  const [studentsData, setStudentsData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await getTeacherById(userData._id);
        const studentsPromises = response.classrooms.map(async classroom => {
          const students = await getAllStudentsClassroom(userData._id, classroom._id);
          const zorPercentages = calculateZorPercentage({ students });
          return { classroom, students, zorPercentages };
        });

        const classroomsWithStudents = await Promise.all(studentsPromises);
        setStudentsData(classroomsWithStudents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTeacherData();
  }, [userData]);

  const handleDeleteClassroom = async (classroomId) => {
    try {
      await deleteClassroom(userData._id, classroomId);
      // Remove the deleted class from studentsData
      setStudentsData(prevData => prevData.filter(item => item.classroom._id !== classroomId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    // Toggle edit mode
    setIsEditMode(!isEditMode);
    setSelectedClassroom(userData._id);
  };

  // const generateEditLink = (classroomId) => `/edit/${userData?._id}/${classroomId}`;

  return (
    <>
      <div className="h-screen">
        <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[4rem] mx-6">
        {!isEditMode && (userData ? `Good morning, ${userData.prefix} ${userData.firstName}!` : 'Loading...') || "Add/remove classes"}
        </h1>

          <h2 className="text-header2 font-header2 text-center mb-[2rem]">
            {isEditMode ? "Create New Class" : "All Classes at a Glance"}
          </h2>
        <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] h-[80%] overflow-y-auto">

          {studentsData.length > 0 ? (
            studentsData.map(({ classroom, students, zorPercentages }, index) => {
              let firstNonZeroIndex = 0;
              for (let i = 0; i < Object.entries(zorPercentages).length; i++) {
                const [zor, percentage] = Object.entries(zorPercentages)[i];
                if (percentage > 0) {
                  firstNonZeroIndex = i;
                  break;
                }
              }
              return (
                <div key={index}>
                  <div className="flex justify-between">
                    <h2 className="text-header2 font-header2 text-left">{classroom.classSubject}</h2>
                    {isEditMode && (
                      <button onClick={() => handleDeleteClassroom(classroom._id)}>
                        {selectedClassroom === userData._id && <img src={xButton} alt="xButton" />}
                      </button>
                    )}
                  </div>
                  <div className="bg-notebookPaper p-[1rem] rounded-[1rem]">
                    <div className="flex justify-between mb-[1rem]">
                      <div className="text-sm font-body">{classroom.location}</div>
                      <div className="text-sm font-body text-sandwich">Check-in: 8AM &nbsp;&nbsp; Check-out: 2PM</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex w-[80%] bg-sandwich rounded-[1rem]">
                        {Object.entries(zorPercentages).map(([zor, percentage], i, arr) => (
                          <div
                            key={zor}
                            style={{ width: `${percentage}%` }}
                            className={`bg-${getBackgroundColorClass(zor)} ${i === firstNonZeroIndex ? 'rounded-l-[1rem]' : ''} ${i === arr.length - 1 ? 'rounded-r-[1rem]' : ''} h-[2.5rem]`}
                          ></div>
                        ))}
                      </div>
                      <div className="text-body font-body underline">
                        <Link to={`/classroom/${userData._id}/${classroom._id}`}>More &gt;</Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Loading classrooms...</p>
          )}

          <div className="font-body text-body text-center pt-[2rem] ">
            {userData ? `Logged in as ${userData.firstName} ${userData.lastName} ` : 'Loading...'}
            <button className="underline" onClick={handleEditClick}>{isEditMode ? "(save)" : "(edit)"}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherHome;


