import axios from 'axios';
import { apiUrl } from './config';

export const getProduct = async (id) => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/detail/${id}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const getQuotation = async (id) => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/quotations/${id}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const getPerfilesProduct = async (id) => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/detail-perfiles/${id}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const productsPaginatedResults = async (page) => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/products?page=${page}&limit=20`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const detailPaginatedResults = async (page) => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/detail?page=${page}&limit=20`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const getPerfiles = async () => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/perfiles`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const getHuecos = async (id) => {
  try {
    const response = await axios({
      url: `${apiUrl}/api/detail-huecos/${id}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};
