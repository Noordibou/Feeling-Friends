import React, { createContext, useContext, useState} from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to set user data after login
  const handleLogin = (userData) => {
    setUser(userData);
  };  
  

  const isStudent = () => {
    return user && user.role === "student";
  };

  const isTeacher = () => {
    return user && user.role === "teacher";
  };

  const contextValue = {
    user,
    handleLogin, // Function to set user data after login
    isStudent,
    isTeacher,
  };

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
