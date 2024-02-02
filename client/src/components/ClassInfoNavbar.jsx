import { useEffect, useState } from "react";
import GoBack from "./GoBack";
import { getTeacherClassroom } from "../api/teachersApi";

const ClassInfoNavbar = ({ teacherId, classroomId }) => {
  const [classroom, setClassroom] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroom = await getTeacherClassroom(teacherId, classroomId);
        setClassroom(classroom);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [teacherId, classroomId]);

  return (
    <div className="flex justify-center gap-[8rem] mb-[0.5rem] mt-20">
      <div className="flex items-center ">
        <GoBack />
        <h2 className="text-header4 font-header2 ml-[2rem] ">
          {classroom.classSubject}
        </h2>
      </div>
      <div className="flex-col text-sm font-body">
        <h2>Location:</h2>
        <h2 className="font-semibold">{classroom.location}</h2>
      </div>

      <div className="flex-col text-sm font-body ">
        <div className="flex gap-4">
          <div>
            <h2>Check-in</h2>
            <h2>{classroom.checkIn ? `${classroom.checkIn}AM` : "-"}</h2>
          </div>
          <div>
            <h2>Check-out</h2>
            <h2>{classroom.checkOut ? `${classroom.checkOut}PM` : "-"}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassInfoNavbar;
