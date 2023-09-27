import axios from 'axios';

// FIXME: change back to https://mindful-journal-server.vercel.app/api/teachers
const TEACHERS_API_URL = 'http://localhost:3001/api/teachers';

export const createTeacher= async (teacher) => {
    try {
        const response = await axios.post(TEACHERS_API_URL, teacher);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTeachers = async() => {
    try {
        const response = await axios.get(TEACHERS_API_URL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTeacherById = async (id) => {
    try {
        const response = await axios.get(`${TEACHERS_API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateTeacher = async (id, teacher) => {
    try {
        const response = await axios.put(`${TEACHERS_API_URL}/${id}`, teacher);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// TODO: *** WILL NEED TO CHANGE URL & PARAMETERS *** //
export const addStudentToTeacherClassroom = async (teacherId, studentId) => {
    try {
        const response = await axios.put(`${TEACHERS_API_URL}/${teacherId}/students/${studentId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// TODO: *** WILL NEED TO CHANGE URL & PARAMETERS *** //
export const getTeacherStudents = async (teacherId) => {
    try {
        const response = await axios.get(`${TEACHERS_API_URL}/${teacherId}/students`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// TODO: *** WILL NEED TO CHANGE URL & PARAMETERS *** //
export const deleteStudentFromClassroom = async (teacherId, studentId) => {
    try {
        const response = await axios.delete(`${TEACHERS_API_URL}/${teacherId}/students/${studentId}`);
        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
