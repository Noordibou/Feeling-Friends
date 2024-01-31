import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from '../../context/UserContext.js';
import { getTeacherById, getAllStudentsClassroom, deleteClassroom } from '../../api/teachersApi.js';
import { getBackgroundColorClass, calculateZorPercentage } from '../../components/ClassRoomColors.jsx';
import xButton from '../../images/x-button.png';
import Greeting from '../../components/TGreeting.jsx'
import 'tailwind-scrollbar';
import './scrollbar.css'
import TeacherNavbar from '../../components/TeacherNavbar.jsx'

const TeacherHome = () => {
  const { userData } = useUser();
  const [classroomsData, setClassroomsData] = useState([]);
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
        setClassroomsData(classroomsWithStudents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTeacherData();
  }, [userData]);

  const handleDeleteClassroom = async (classroomId) => {
    try {
      await deleteClassroom(userData._id, classroomId);
      setClassroomsData(prevData => prevData.filter(item => item.classroom._id !== classroomId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {

    setIsEditMode(!isEditMode);
    setSelectedClassroom(userData._id);
  };


  return (
    <>
    <div>
      <div className="flex flex-col justify-center h-screen">
        <div className="h-[25%]">
          <Greeting isEditMode={isEditMode} userData={userData} />
        </div>

        <div className=" custom-scrollbar ">
          {userData && userData.classrooms ? (
            classroomsData.map(({ classroom, zorPercentages }, index) => (
              <div key={index} className="bg-sandwich w-[80%]  ml-auto mr-auto p-[0.5rem] rounded-[1rem] my-[1rem]">
                  <div className="flex justify-between">
                    <h2 className="text-header4 font-header2 text-left">{classroom.classSubject}</h2>
                    {isEditMode && (
                      <button className="-mt-[3rem] -mx-[2rem]" onClick={() => handleDeleteClassroom(classroom._id)}>
                        {selectedClassroom === userData._id && <img src={xButton} alt="xButton" />}
                      </button>
                    )}
                  </div>
                        <Link to={`/classroom/${userData._id}/${classroom._id}`}>
                  <div className="bg-notebookPaper p-[0.5rem] rounded-[1rem]">
                    <div className="flex justify-between mb-[1rem] mx-2">
                      <div className="flex-col text-sm font-body">
                        <h2>Location:</h2>
                        <h2 className="font-semibold">{classroom.location}</h2>
                      </div>

                      <div className="flex-col text-sm font-body ">
                        <div className="flex gap-4">
                          <h2>Check-in</h2>
                          <h2>Check-out</h2>
                        </div>
                        <div className="flex gap-[4rem] font-semibold">
                            <h2>{classroom.checkIn ? `${classroom.checkIn}AM` : '-'}</h2>
                            <h2>{classroom.checkOut ? `${classroom.checkOut}PM` : '-'}</h2>
                          </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex w-[80%] bg-sandwich rounded-[1rem] h-[2.5rem]">

                        {Object.entries(zorPercentages).map(([zor, percentage], i, arr) => (
                          <div
                            key={zor}
                            style={{ width: `${percentage}%` }}
                            className={`bg-${getBackgroundColorClass(zor)} ${i === 0 ? 'rounded-l-[1rem]' : ''} ${i === arr.length - 1 ? 'rounded-r-[1rem]' : ''} h-[2.5rem]`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

            ))
          ) : (
            <p>Loading classrooms...</p>
          )}

        </div>
        <div className="flex justify-center ">
          <button className="text-header2 font-header2 underline" onClick={handleEditClick}>
            {isEditMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>
    </div>
    <div className="fixed -bottom-0 sticky">
        <TeacherNavbar />
    </div>
  </>
);
};

export default TeacherHome;


