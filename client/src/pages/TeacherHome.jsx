import React from "react";
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useUser } from '../context/StudentProvider';

const TeacherHome = () => {
  // const navigate = useNavigate();
  const { userData } = useUser();

  useEffect(() => {
    console.log('teacher data:', userData);
  }, [userData]);

  return (
    <>
      <div>
        <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[4rem]">Good morning, {userData.firstName}!</h1>

        {/* The div below needs to be scrollable but it refuses */}
        <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] h-[80%] overflow-y-auto">
          <h2 className="text-header2 font-header2 text-center mb-[2rem]">All Classes at a Glance</h2>


          {userData.classrooms.map((classroom, index) => (
            <div key={index}>
              <h2 className="text-header2 font-header2 text-left">{classroom.classSubject}</h2>
              <div className="bg-notebookPaper p-[1rem] rounded-[1rem]">
                <div className="flex justify-between mb-[1rem]">
                  <div className="text-sm font-body">{classroom.location}</div>
                  <div className="text-sm font-body text-sandwich">Check-in: 8AM &nbsp;&nbsp; Check-out: 2PM</div>
                </div>
                <div className="flex justify-between mb-[1rem]">
                  <div className="bg-blue w-[80%] h-[2.5rem] rounded-[1rem]"></div>
                  <div className="text-body font-body">
                    <a href="/viewclassroom">More &gt;</a>
                  </div>
                </div>
              </div>
            </div>
          ))}


          <div className="font-body text-body text-center pt-[2rem]">
            Logged in as <a href="/">{userData.firstName} {userData.lastName} (Edit)</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherHome;