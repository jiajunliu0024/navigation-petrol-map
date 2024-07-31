export const compareLat = (srcLocation, desLocation) => {
  if (srcLocation.lat > desLocation.lat) {
    return {
      minLat: desLocation.lat,
      maxLat: srcLocation.lat,
    };
  }
  return {
    minLat: srcLocation.lat,
    maxLat: desLocation.lat,
  };
};

export const compareLng = (srcLocation, desLocation) => {
    if (srcLocation.lng > desLocation.lng) {
      return {
        minLng: desLocation.lng,
        maxLng: srcLocation.lng,
      };
    }
    return {
      minLng: srcLocation.lng,
      maxLng: desLocation.lng,
    };
  };


