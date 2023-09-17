import axios from 'axios';

const STUDENTS_API_URL = 'http://localhost:3001/api/students';


// this works ✅
export const getStudents = async () => {
  const response = await axios.get(STUDENTS_API_URL);
  return response.data;
};


export const createStudent = async (student) => {
  const response = await axios.post(STUDENTS_API_URL, student);
  return response.data;
};

// this works ✅
export const getStudentById = async (id) => {
    const response = await axios.get(`${STUDENTS_API_URL}/${id}`)
    return response.data;
}


export const updateStudent = async (id, student) => {
    const response = await axios.put(`${STUDENTS_API_URL}/${id}`, student)
    return response.data;
}

export const deleteStudent = async (id) => {
    const response = await axios.delete(`${STUDENTS_API_URL}/${id}`)
    return response.data;
}
