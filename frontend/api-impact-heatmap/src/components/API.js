import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // FastAPI backend

export const getUsageData = async () => {
  const response = await axios.get(`${API_BASE_URL}/usage`);
  return response.data;
};

export const getSimilarityData = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/similarity/${id}`);
   console.log("data", response)
  return response.data;
 
};

export const getFingerprintData = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/fingerprint/${id}`);
  return response.data;
};
