import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import geocodeAddress from "../api/geocode";
import { getServoByRoute } from "../api/servo";
import "../App.css";
import { useEffect, useState, useCallback } from "react";
import PetorlMarker from "./PetrolMarker";
import PetrolInfoWindow from "./PetrolInfoWindow";

const PetrolMap = ({ brand, petrolType, src, des, cur }) => {
  const [srcLocation, setSrcLocation] = useState(null);
  const [desLocation, setDesLocation] = useState(null);
  const [directions, setDirections] = useState({});
  const [map, setMap] = useState(null);
  const [servo, setServo] = useState([]);
  const [filteredServo, setFilteredServo] = useState([]);
  const [waypoints, setWayPoints] = useState([]);
  const [markerInfoVisiable, setMarkerInfoVisiable] = useState(false);
  const [selectedInfoStation, setSelectedInfoStation] = useState(null);
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
    }
  }, [srcLocation, desLocation]);

  const calculateRoute = (srcLocation, desLocation, waypoints) => {
    directionsService.route(
      {
        origin: srcLocation,
        destination: desLocation,
        waypoints: waypoints.map((point) => ({
          location: point,
          stopover: true,
        })),
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

  /*
    listen the src or des location to update the direction 
  */
  useEffect(() => {
    if (srcLocation && desLocation) {
      calculateRoute(srcLocation, desLocation, waypoints);
      fetchServo();
    } else {
      setDirections(null);
      setServo([]);
    }
  }, [srcLocation, desLocation, waypoints]);

  useEffect(() => {
    setFilteredServo(servo.filter((station) => brand.includes(station.brand)));
  }, [brand, servo]);

  const handleGeocode = async (address) => {
    try {
      const location = await geocodeAddress(
        address,
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      );
      return location;
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchServo = async () => {
    try {
      const params = {
        srcLat: srcLocation.lat,
        srcLng: srcLocation.lng,
        desLat: desLocation.lat,
        desLng: desLocation.lng,
      };
      const result = await getServoByRoute(params);
      setServo(result.body);
    } catch (error) {
      console.log(error.message);
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
        <PetorlMarker
          id="petrol-marker"
          petrolType={petrolType}
          servo={filteredServo}
          setWayPoints={setWayPoints}
          setMarkerInfoVisiable={setMarkerInfoVisiable}
          setSelectedInfoStation={setSelectedInfoStation}
        />
        <PetrolInfoWindow
          waypoints={waypoints}
          srcLocation={srcLocation}
          desLocation={desLocation}
          setWayPoints={setWayPoints}
          infoVisiable={markerInfoVisiable}
          setInfoVisiable={setMarkerInfoVisiable}
          infoStation={selectedInfoStation}
          petrolType={petrolType}
        />
        {srcLocation && <MarkerF position={srcLocation} />}
        {desLocation && <MarkerF position={desLocation} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default PetrolMap;
