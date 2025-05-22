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

export const getViolation = async () => {
    try {
        const response = await axios.get(`${API_URL}/getViolation`);
        return response.data;
    } catch (error) {
        console.error('Error fetching violations:', error);
        throw error;
    }
}

export const postViolation = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/addViolation`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error posting violation:', error);
        throw error;
    }
};

export const getClassViolation = async (data) => {
  try {
      const response = await axios.post(`${API_URL}/getClassViolation`, data);
      return response.data;
  } catch (error) {
      console.error('Error fetching class violation:', error);
      throw error;
  }
};