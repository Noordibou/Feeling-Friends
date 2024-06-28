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
    <div className="flex items-center md:mx-4 mb-5">
      <div className="flex-col text-xs font-body md:border-l-4 md:pl-4 border-sandwich pr-4 md:border-r-4">
        <div className="flex py-[5px] md:py-[2px] text-[14px]">
          <h2>Location:</h2>
          <h2 className="font-semibold pl-2 text-graphite">{classroom.location}</h2>
        </div>

        {/* check in/out section */}
        <div className="flex flex-col md:flex-row md:py-[2px] text-[14px]">
          <div className="flex md:flex-col py-[5px] md:py-[0px] xl:flex-row">
            <h2>Check-in: </h2>
            <h2 className="font-semibold pl-2 text-graphite">
              {classroom.checkIn ? formatTime(classroom.checkIn) : "-"}
            </h2>
          </div>
          <div className="flex md:flex-col py-[5px] md:py-[0px] xl:flex-row md:pl-4 text-[14px]">
            <h2>Check-out:</h2>
            <h2 className="font-semibold pl-2 text-graphite">
              {classroom.checkOut ? formatTime(classroom.checkOut) : "-"}
            </h2>
          </div>
        </div>
        <div className="flex py-[5px] md:py-[2px] text-[14px]">
          <h2>Days:</h2>
          <h2 className="font-semibold pl-2 tracking-wide text-graphite">MON | TUE | WED | THU | FRI</h2>
        </div>
      </div>
    </div>
  );
};

export default ClassInfoNavbar;
