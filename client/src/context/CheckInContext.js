import React, { createContext } from "react";

const StudentCheckinContext = createContext({
  studentCheckinData: {
  emotion: "",
  ZOR: "",
  goal: "",
  need: "",
},
  updateFormState,
  resetFormState,
});

export function useStudentCheckin() {
  return useContext(StudentCheckinContext);
}

export default StudentCheckinContext;