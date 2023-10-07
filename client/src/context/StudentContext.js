import { createContext, useContext } from 'react';

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

export default StudentContext;