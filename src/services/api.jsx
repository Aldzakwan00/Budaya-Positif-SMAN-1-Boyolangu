import axios from 'axios';

const API_URL = 'https://api.ciptakode.com/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    Authorization: `Bearer ${token}`,
  };
};


// ==================== LOGIN ====================
export const login = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const token = response.data.token;
    localStorage.setItem('authToken', token);

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return { error: 'Username atau password salah' };
    }
    if (error.response?.status === 422) {
      console.error('Detail kesalahan:', error.response.data);
      return { error: 'Format data login tidak valid. Coba cek username dan password.' };
    }
    return { error: 'Terjadi kesalahan. Coba lagi nanti.' };
  }
};

// ==================== GET ====================
export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllStudent`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getViolation = async () => {
  try {
    const response = await axios.get(`${API_URL}/getViolation`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching violations:', error);
    throw error;
  }
};

export const getMaterial = async () => {
  try {
    const response = await axios.get(`${API_URL}/getMaterial`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};

export const register = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};


export const updateSiswa = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/updateSiswa`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

// ==================== POST ====================
export const postViolation = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/addViolation`, data, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting violation:', error);
    throw error;
  }
};

export const getClassViolation = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/getClassViolation`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching class violation:', error);
    throw error;
  }
};

export const getStudentViolation = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/getStudentViolation`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student violation:', error);
    throw error;
  }
};

export const addMaterial = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/addMaterial`, data, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
};

export const addComment = async (data) => {
  try {
    const response = await axios.put(
        `${API_URL}/addComment`,
        data,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};
