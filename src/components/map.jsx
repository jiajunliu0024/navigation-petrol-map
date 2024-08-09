import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  AdvancedMarkerElement,
} from "@react-google-maps/api";
import geocodeAddress from "../api/geocode";
import { getServoByRoute } from "../api/servo";
import "../App.css";
import { useEffect, useState, useCallback } from "react";

const Map = ({ petrolType, src, des, cur }) => {
  const [srcLocation, setSrcLocation] = useState(null);
  const [desLocation, setDesLocation] = useState(null);
  const [directions, setDirections] = useState({});
  const [map, setMap] = useState(null);
  const [servo, setServo] = useState([]);
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

  const calculateRoute = (srcLocation, desLocation) => {
    directionsService.route(
      {
        origin: srcLocation,
        destination: desLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          // console.log(result);
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
      calculateRoute(srcLocation, desLocation);
      fetchServo();
    } else {
      setDirections(null);
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

  const fetchServo = async () => {
    try {
      const params = {
        srcLat: srcLocation.lat,
        srcLng: srcLocation.lng,
        desLat: desLocation.lat,
        desLng: desLocation.lng,
      };
      const config = {
        params: params,
      };
      const result = await getServoByRoute(config);
      setServo(result.body);
    } catch (error) {
      console.log(error.message);
    }
  };

  const PetorlMarker = ({ servo }) => {
    const getStationTitle = (station) => {
      const petrol = station.petrol_list.find(
        (petrol) => petrol.type === petrolType
      );
      if (petrol) {
        return `${petrol.amount}`;
      }
      return "No petrol info"; // Default title if no matching petrol type is found
    };

    return servo.map((station) => (
      <MarkerF
        clickable={true}
        key={station.address}
        draggable={true}
        label={getStationTitle(station)}
        position={{ lat: station.location_y, lng: station.location_x }}
      />
    ));
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
        <PetorlMarker servo={servo} />
        {srcLocation && <MarkerF position={srcLocation} />}
        {desLocation && <MarkerF position={desLocation} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default Map;
