import axios from "axios";

const API_URL = process.env.REACT_APP_URL;

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    console.log("from api user: " + JSON.stringify(response.data));
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getUserByTeacherId = async (teacherId) => {
  try {
    const response = await axios.get(`${API_URL}/users/teacher/${teacherId}`);
    return response.data.responseData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await axios.get(`${API_URL}/logout`, { withCredentials: true });
  } catch (error) {
    console.error("Logout Failed: ", error);
  }
};

export const checkAuthApi = async () => {
  try {
    return await axios.get(`${API_URL}/check-auth`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Check if authorized failed: ", error);
  }
};

export const updateTeacherAcct = async (teacherId, teacher) => {
  try {
    return await axios.put(`${API_URL}/users/teacher/${teacherId}`, teacher, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Check if authorized failed: ", error);
  }
};

export const updatePassword = async (teacherId, passwords) => {
  try {
    return await axios.put(`${API_URL}/users/password/${teacherId}`, passwords, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("update password failed: ", error);
  }
}