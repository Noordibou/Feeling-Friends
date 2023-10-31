import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from '../context/UserContext';

const TeacherHome = () => {
  const { userData } = useUser();

  useEffect(() => {
    // console.log('teacher data:', userData);
  }, [userData]);

  return (
    <>
      <div className="h-screen">
        <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[4rem] ">
          {userData ? `Good morning, ${userData.prefix} ${userData.firstName}!` : 'Loading...'}
        </h1>

        <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] h-[80%] overflow-y-auto">
          <h2 className="text-header2 font-header2 text-center mb-[2rem]">All Classes at a Glance</h2>

          {userData && userData.classrooms ? (
            userData.classrooms.map((classroom, index) => (
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
                      {/* Use Link to navigate to the specific classroom */}
                      {/* <Link to={`/classroom/${userData._id}/${classroom._id}`}>More &gt;</Link> */}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading classrooms...</p>
          )}

          <div className="font-body text-body text-center pt-[2rem] ">
            {userData ? `Logged in as ${userData.firstName} ${userData.lastName}` : 'Loading...'}
            {userData && <Link to={`/edit/${userData._id}`}> (edit)</Link>}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherHome;
