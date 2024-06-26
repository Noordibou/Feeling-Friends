import { useEffect, useState } from "react";
import GoBack from "./GoBack";
import { getTeacherClassroom } from "../api/teachersApi";
import { formatTime } from "../utils/dateFormat";

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
    <div className="flex items-center justify-around mb-[0.5rem] mt-10 w-full ">
      <div className="flex items-center ">
        <GoBack />
        <h2 className="text-[25px] ml-[2rem] font-semibold">
          {classroom.classSubject}
        </h2>
      </div>
      <div className="flex-col text-xs font-body border-l-4 pl-4 border-sandwich ">
        <h2>Location:</h2>
        <h2 className="font-semibold">{classroom.location}</h2>
      </div>

      <div className="flex-col text-xs font-body">
        <div className="flex gap-4">
          <div className="border-l-4 pl-4 border-sandwich ">
            <h2>Check-in</h2>
            <h2 className="font-semibold">{classroom.checkIn ? formatTime(classroom.checkIn) : "-"}</h2>
          </div>
          <div className="border-r-4 pr-4 border-sandwich ">
            <h2>Check-out</h2>
            <h2 className="font-semibold">{classroom.checkOut ? formatTime(classroom.checkOut) : "-"}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassInfoNavbar;