import React, {useState} from "react";
import CheckInContext from "./CheckInContext";

export default function CheckInProvider ({children}) {
  const [studentCheckinData, setStudentCheckinData] = useState({
    emotion: "",
    ZOR: "",
    goal: "",
    need: "",
  });

  const updateFormState = (field, value) => {
    console.log("helloooo")
    setStudentCheckinData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    console.log("oo from provider: " + JSON.stringify(studentCheckinData))
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