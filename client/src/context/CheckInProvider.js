import React, {useState} from "react";
import CheckInContext from "./CheckInContext";
import { updateStudent } from "../api/studentsApi";

export default function CheckInProvider ({children, studentId}) {
  const [studentCheckinData, setStudentCheckinData] = useState({
    emotion: "",
    ZOR: "",
    goal: "",
    need: "",
  });

  const updateFormState = (field, value) => {
    setStudentCheckinData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    console.log("oo from provider: " + JSON.stringify(studentCheckinData))
  };

  const updateStudentData = async (studentCheckinData) => {
    // Create a new student object with the checkin data
    const newStudent = {
      $set:{
        date: new Date(),
        checkIn: {
            emotion: studentCheckinData.emotion,
            ZOR: studentCheckinData.ZOR,
            goal: studentCheckinData.goal,
            need: studentCheckinData.need,
        }
    }
    };

    try {
      await updateStudent(studentId, newStudent);
      // Reset the form state only after the update is successful
      resetFormState();
    } catch (error) {
      // Handle any errors that occur during the update
      console.error("Error updating student:", error);
    }
  };

  const resetFormState = () => {
    setStudentCheckinData({
      emotion: "",
      ZOR: "",
      goal: "",
      need: "",
    });
  };

  const contextValue = {
    studentCheckinData,
    updateFormState,
    resetFormState,
    updateStudentData,
  };

  return (
    <CheckInContext.Provider value={contextValue}>
      {children}
    </CheckInContext.Provider>
  );
};