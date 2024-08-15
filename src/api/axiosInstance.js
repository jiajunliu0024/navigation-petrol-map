import axios from "axios";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: "https://13.211.62.189:8000", // Base URL of your API
  timeout: 30000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
