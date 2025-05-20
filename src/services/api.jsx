import axios from 'axios';

const API_URL = 'https://ciptakode.com/api'; 

export const getAllStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAllStudent`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
};