import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_API_URL = 'http://192.168.20.4:5000/api'; // Base API URL
const API_URL = `${BASE_API_URL}/auth`; // Auth-specific

export { BASE_API_URL, API_URL };

// Login Function
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const token = response.data.token;

    if (token) {
      await AsyncStorage.setItem('authToken', token); // Save token
    }

    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error.response?.data?.message || 'Login failed. Please try again.';
  }
};

// Register Function
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    const token = response.data.token;

    if (token) {
      await AsyncStorage.setItem('authToken', token); // Save token after registration
    }

    return response.data;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error.response?.data?.message || 'Registration failed. Please try again.';
  }
};

// Logout Function
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken'); // Clear stored token
  } catch (error) {
    console.error('Logout Error:', error);
  }
};

// Get Auth Token Function

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      console.error('⚠️ No auth token found in storage!');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

