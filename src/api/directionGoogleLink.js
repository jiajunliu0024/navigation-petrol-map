import React from "react";
const getDirectionLink = (infoStation) => {
  let waypoints = null;
  if (infoStation) {
    waypoints = infoStation.location_x + "," + infoStation.location_y;
  }
  const travelMode = "driving";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${waypoints}&travelmode=${travelMode}`;
  return directionsUrl;
};

export default getDirectionLink;
