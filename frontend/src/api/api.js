const BASE_URL = process.env.REACT_APP_API_URL

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || 'An error occurred. Please try again.';
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Auth
  register: async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  // Tasks
  getAllTasks: async () => {
    const res = await fetch(`${BASE_URL}/api/task/getall`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getTaskDetails: async (taskId) => {
    const res = await fetch(`${BASE_URL}/api/task/${taskId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createTask: async (taskData) => {
    const res = await fetch(`${BASE_URL}/api/task`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  updateTask: async (taskId, taskData) => {
    const res = await fetch(`${BASE_URL}/api/task/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  deleteTask: async (taskId) => {
    const res = await fetch(`${BASE_URL}/api/task/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // File Upload
  uploadAttachment: async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/api/task/upload/${taskId}`, {
      method: 'POST',
      headers: getHeaders(true), // Content-Type must not be set manually for Multipart
      body: formData,
    });
    return handleResponse(res);
  },
};
