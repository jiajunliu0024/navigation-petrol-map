import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import geocodeAddress from "../api/geocode";
import { getServoByBoundingBox, getBoundingBoxByRange } from "../api/servo";
import { compareLat, compareLng } from "../utils/servoArea";
import "../App.css";
import { useEffect, useState, useCallback } from "react";

const Map = ({ src, des, cur }) => {
  const [srcLocation, setSrcLocation] = useState(null);
  const [desLocation, setDesLocation] = useState(null);
  const [directions, setDirections] = useState({});

  const [map, setMap] = useState(null);

  const [geopointBoundings, setGeopointBoundings] = useState([]);

  const [servo, setServo] = useState([]);

  const [overviewPath, setOverviewPath] = useState(null);

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
          console.log(result);
          setDirections(result);
          if (directions && directions.routes) {
            setOverviewPath(directions.routes[0].overview_path);
            console.log(overviewPath);
          }
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

  const fetchServo = async () => {
    try {
      console.log(directionsService.route);
      setGeopointBoundings([]);
      // get the bounding box list for route location
      if (overviewPath) {
        overviewPath.map((location) => {
          let boundingBox = getBoundingBoxByRange(
            location.lat(),
            location.lng(),
            5000
          );
          console.log("box: ", boundingBox);
          setGeopointBoundings((geopointBoundings) => [
            ...geopointBoundings,
            boundingBox,
          ]);
        });
      }
      console.log("result:", geopointBoundings);
      if (geopointBoundings.size != 0) {
        geopointBoundings.map((point) => {
          const params = {
            sw_lat: point.latMin,
            ne_lat: point.latMax,
            sw_long: point.lngMin,
            ne_long: point.lngMax,
          };
          const config = {
            params: params,
          };

          const servoList = getServoByBoundingBox(config);

          const newSrevo = servoList.body;
          console.log(newSrevo, 111);
          setServo((servo) => [...servo, newSrevo]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const PetorlMarker = () => {
    if (servo && servo.size > 0) {
      console.log(servo.size, servo);
      return servo.map((station) => (
        <MarkerF
          clickable={true}
          key={station.address}
          position={{ lat: station.location_y, lng: station.location_x }}
        />
      ));
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
