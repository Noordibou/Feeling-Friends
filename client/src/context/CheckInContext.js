import React, { createContext, useContext } from "react";

// TODO: should I merge this with the Student context??

const StudentCheckinContext = createContext({
  studentCheckinData: {
  emotion: "",
  ZOR: "",
  goal: "",
  need: "",
},
  updateFormState: () => {},
  resetFormState: () => {},
  updateStudentData: () => {},
});

export function useStudentCheckin() {
  const studentCheckinData = useContext(StudentCheckinContext);

  return {
    studentCheckinData,
    updateFormState: studentCheckinData.updateFormState,
    resetFormState: studentCheckinData.resetFormState,
    updateStudentData: studentCheckinData.updateStudentData,
  };

}

export default StudentCheckinContext;