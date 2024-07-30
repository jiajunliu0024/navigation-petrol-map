import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import geocodeAddress from "../api/geocode";
import { getServoByBoundingBox } from "../api/servo";

import "../App.css";
import { useEffect, useState, useCallback } from "react";

const Map = ({ src, des, cur }) => {
  const [srcLocation, setSrcLocation] = useState(null);
  const [desLocation, setDesLocation] = useState(null);
  const [directions, setDirections] = useState({});
  const [pathStatus, setPathStatus] = useState(null);

  const [map, setMap] = useState(null);

  const [servo, setServo] = useState(null);

  const directionsService = new window.google.maps.DirectionsService();

  useEffect(() => {
    handleGeocode(src).then((location) => setSrcLocation(location));
  }, [src]);

  useEffect(() => {
    handleGeocode(des).then((location) => setDesLocation(location));
  }, [des]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (srcLocation || desLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      if (srcLocation) bounds.extend(srcLocation);
      if (desLocation) bounds.extend(desLocation);
      map.fitBounds(bounds);
      map.setZoom(15);
      // console.log(srcLocation, desLocation);
    }
  }, [srcLocation, desLocation]);

  const calculateRoute = (srcLocation, desLocation) => {
    directionsService.route(
      {
        origin: srcLocation,
        destination: desLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions`);
        }
      }
    );
  };

  useEffect(() => {
    if (srcLocation && desLocation) {
      calculateRoute(srcLocation, desLocation);
      setPathStatus(1);
      fetchServo();
    } else {
      setPathStatus(null);
      setDirections(null);
      console.log("check the directions: ", directions);
      setServo([]);
    }
  }, [srcLocation, desLocation]);

  const handleGeocode = async (address) => {
    try {
      const location = await geocodeAddress(
        address,
        "AIzaSyA6d7pIq9TszfM0M6pIosMT1flSKr5o8oM"
      );
      return location;
    } catch (error) {
      console.log(error.message);
    }
  };

  const compareLat = () => {
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

  const compareLng = () => {
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

  const fetchServo = async () => {
    try {
      const lat_set = compareLat();
      const lng_set = compareLng();

      const params = {
        sw_lat: lat_set.minLat,
        ne_lat: lat_set.maxLat,
        sw_long: lng_set.minLng,
        ne_long: lng_set.maxLng,
      };

      const config = {
        params: params,
      };

      const servoList = await getServoByBoundingBox(config);
      if (servoList.size !== 0) {
        setServo(servoList.body);
        // console.log(servoList.body);
      } else {
        setServo(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const PetorlMarker = () => {
    if (servo && servo.size != 0) {
      return servo.map((station) => (
        <MarkerF
          clickable={true}
          key={station.address}
          position={{ lat: station.location_y, lng: station.location_x }}
        />
      ));
    } else {
      return null;
    }
  };

  return (
    <div className="Map">
      <GoogleMap
        mapContainerClassName="map_container"
        onLoad={onLoad}
        center={cur}
        zoom={15}
      >
        <MarkerF position={cur} />
        <PetorlMarker></PetorlMarker>
        {srcLocation && <MarkerF position={srcLocation} />}
        {desLocation && <MarkerF position={desLocation} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};


function Directions(){
  


}
export default Map;
