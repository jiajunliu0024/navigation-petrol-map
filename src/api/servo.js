import { API_ENDPOINTS } from "./apiEndpoints";
import axiosInstance from "./axiosInstance";

// Example GET
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

export const getServoByBoudingBoxList = async (geopoints) => {
  try {
  } catch (error) {}
};

export const getBoundingBoxByRange = (lat, lng, range) => {
  const earthRadius = 6371000; // Earth's radius in meters

  // Convert range from meters to degrees
  const rangeInDegrees = (range / earthRadius) * (180 / Math.PI);

  // Calculate bounding box
  const latMin = lat - rangeInDegrees;
  const latMax = lat + rangeInDegrees;

  // Longitude degrees vary with latitude, so we need to calculate this separately
  const lngRangeInDegrees =
    (range / (earthRadius * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);
  const lngMin = lng - lngRangeInDegrees;
  const lngMax = lng + lngRangeInDegrees;

  return {
    latMin,
    latMax,
    lngMin,
    lngMax,
  };
};
