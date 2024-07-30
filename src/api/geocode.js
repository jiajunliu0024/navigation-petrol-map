import axios from "axios";

const geocodeAddress = async (address, apiKey) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.results[0].geometry.location;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error fetching geocode: " + error.message);
  }
};

export default geocodeAddress;
