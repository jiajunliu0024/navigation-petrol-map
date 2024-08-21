import axios from "axios";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: "ALP-Petrol-Map-669908758.ap-southeast-2.elb.amazonaws.com", // Base URL of your API
  // baseURL: "http://localhost:8000", // Base URL of your API
  timeout: 30000, // Optional: Set a timeout for requests

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
