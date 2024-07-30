import { API_ENDPOINTS } from "./apiEndpoints";
import axiosInstance from "./axiosInstance";

// Example GET request
export const getServoByBoundingBox = async (config) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_BOUNDING_BOX_SERVO,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw to handle it in the component
  }
};
