import React, { createContext, useContext, useState} from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user] = useState(null);


  const isStudent = () => {
    return user && user.role === "student";
  };

  const isTeacher = () => {
    return user && user.role === "teacher";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isStudent,
        isTeacher,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
