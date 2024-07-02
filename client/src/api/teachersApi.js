import axios from 'axios';
import React from 'react'

const BASE_URL = process.env.REACT_APP_URL
const TEACHERS_API_URL = process.env.REACT_APP_URL + '/api/teachers';

export const createTeacher = async (teacher) => {
    try {
        const response = await axios.post(TEACHERS_API_URL, teacher);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTeachers = async () => {
    try {

        const response = await axios.get(TEACHERS_API_URL, { withCredentials: true });


        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTeacherById = async (id) => {
    try {

        const response = await axios.get(`${TEACHERS_API_URL}/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateTeacher = async (id, teacher) => {
    try {
        // console.log(id)
        const response = await axios.put(`${TEACHERS_API_URL}/${id}`, teacher, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateStudent = async (teacherId, classroomId, studentId, studentData) => {
    try {
        console.log('Received student:', studentData);
        const response = await axios.put(`${TEACHERS_API_URL}/${teacherId}/classrooms/${classroomId}/students/${studentId}`, studentData, { withCredentials: true });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTeacherClassroom = async (id, classroomId) => {
    try {

        const response = await axios.get(`${TEACHERS_API_URL}/${id}/classrooms/${classroomId}`, { withCredentials: true });

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const getStudentProfile = async (teacherId, classroomId, studentId) => {
    try {
        
        const response = await axios.get(`${TEACHERS_API_URL}/${teacherId}/classrooms/${classroomId}/students/${studentId}`, { withCredentials: true });
        const profile = response.data;
        return profile;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAllStudentsClassroom = async (id, classroomId) => {
    try {
        const response = await axios.get(`${TEACHERS_API_URL}/${id}/classrooms/${classroomId}/students`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const addStudentToClassroom = async (id, classroomId, newStudent) => {
    try {
      const response = await axios.put(`${TEACHERS_API_URL}/${id}/classrooms/${classroomId}/students`, newStudent, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

export const deleteStudentFromClassroom = async (id, classroomId, studentId) => {
    try {
        const response = await axios.delete(`${TEACHERS_API_URL}/${id}/classrooms/${classroomId}/students/${studentId}`, { withCredentials: true });

        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}


export const deleteClassroom = async (id, classroomId) => {
    try {
        const response = await axios.delete(`${TEACHERS_API_URL}/${id}/${classroomId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createClassroom = async (id, classroom) => {
    try {
      const response = await axios.post(`${TEACHERS_API_URL}/${id}/classrooms`, classroom, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  export const getAllStudents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/students`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// updating teacher's seating chart
export const updateSeatingChart = async (teacherId, classroomId, updatedPositions) => {
    try {
        const response = await axios.put(`${TEACHERS_API_URL}/${teacherId}/classrooms/${classroomId}/updateSeatingChart`, {
            positions: updatedPositions,
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateFurniturePositions = async (teacherId, classroomId, updatedPositions) => {
    console.log("teacher ID: " + teacherId)
    console.log("class ID: " + classroomId)
    console.log("updated positions: " + JSON.stringify(updatedPositions))
    try {
      const response = await axios.put(`${TEACHERS_API_URL}/${teacherId}/classrooms/${classroomId}/furniture`, updatedPositions);
      console.log("response data:  " + JSON.stringify(response.data))
      return response.data;
    } catch (error) {
      console.log("Oops, an error has occurred: " + error);
      throw error;
    }
  };

export const addFurniture = async (teacherId, classroomId, furnitureData) => {
    try {
        console.log("well I'm here")
        const response = await axios.post(`${TEACHERS_API_URL}/${teacherId}/classrooms/${classroomId}/furniture`, furnitureData);
        return response.data;
    } catch (error) {
        console.log("woops an aerror has occured: " + error);
        throw error;
    }
};

export const deleteFurniture = async (teacherId, classroomId, itemIds) => {
    console.log("Hey it's hitting he deleteFurniture api call hmm: " + JSON.stringify(itemIds))
    try {
      const response = await axios.delete(`${TEACHERS_API_URL}/${teacherId}/classrooms/${classroomId}/furniture`, { data: itemIds, withCredentials: true });
      return response.data;
    } catch (error) {
      console.log("Oops, an error has occurred:", error);
      throw error;
    }
  };