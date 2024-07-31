import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import geocodeAddress from "../api/geocode";
import { getServoByBoundingBox } from "../api/servo";
import { compareLat, compareLng } from "../utils/servoArea";
import "../App.css";
import { useEffect, useState, useCallback } from "react";

const Map = ({ src, des, cur }) => {
  const [srcLocation, setSrcLocation] = useState(null);
  const [desLocation, setDesLocation] = useState(null);
  const [directions, setDirections] = useState({});

  const [map, setMap] = useState(null);

  const [servo, setServo] = useState(null);

  const [mapFlag, setMapFlag] = useState(null);

  const directionsService = new window.google.maps.DirectionsService();
  // const DirectionsRenderer = new window.google.maps.DirectionsRednerer();

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
          setMapFlag(true);
        } else {
          setMapFlag(false);
          console.error(`error fetching directions`);
        }
      }
    );
  };

  /*
    listen the src or des location to update the direction 
  */
  useEffect(() => {
    if (srcLocation && desLocation) {
      calculateRoute(srcLocation, desLocation);
      fetchServo();
    } else {
      setDirections(null);
      console.log("check the directions: ", directions);
      setServo([]);
    }
  }, [srcLocation, desLocation]);

  useEffect(() => {
    if (mapFlag) {
      map.DirectionsRenderer = null;
      console.log(map);
      setMap(map);
    }
  }, [mapFlag]);

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

  const fetchServo = async () => {
    try {
      const lat_set = compareLat(srcLocation, desLocation);
      const lng_set = compareLng(srcLocation, desLocation);

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

export default Map;
