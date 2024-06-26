
import axios from 'axios';


const API_URL = process.env.REACT_APP_URL;

export const getUserById = async (userId) => {
    
    try {
      // Make a GET request to the backend API
      const response = await axios.get(`${API_URL}/users/${userId}`);
    console.log('from api user: ' + JSON.stringify(response.data))
      // If the request is successful, return the user data
      return response.data.user;
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error fetching user:', error);
      throw error; // You can handle this error in the calling code
    }
  };

export const logoutUser = async () => {
  try {
    return await axios.get(`${API_URL}/logout`, { withCredentials: true })
  } catch (error) {
    console.error("Logout Failed: ", error)
  }
}