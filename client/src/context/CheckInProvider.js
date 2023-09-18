import React from "react";
import CheckInContext from "./CheckInContext";

export default function CheckInProvider ({children}) {
  const [studentCheckinData, setStudentCheckinData] = useState({
    emotion: "",
    ZOR: "",
    goal: "",
    need: "",
  });

  const updateFormState = (formData) => {
    setStudentCheckinData({
      ...studentCheckinData,
      ...formData,
    });
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
  };

  return (
    <CheckInContext.Provider value={contextValue}>
      {children}
    </CheckInContext.Provider>
  );
};