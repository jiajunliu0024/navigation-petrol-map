import { API_ENDPOINTS } from "./apiEndpoints";
import axiosInstance from "./axiosInstance";

// Example GET
export const getServoByRoute = async (params) => {
  const config = {
    params: params,
  };
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_SERVO, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // throw error; // Re-throw to handle it in the component
  }
};

export const getDetourInfoByRoute = async (params) => {
  const config = {
    params: params,
  };
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_DETOUR_INFO,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // throw error; // Re-throw to handle it in the component
  }
};
