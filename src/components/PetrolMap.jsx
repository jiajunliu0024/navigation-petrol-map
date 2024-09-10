import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import geocodeAddress from "../api/geocode";
import { getServoByRoute, getServoByMap } from "../api/servo";
import "../App.css";
import { useEffect, useState, useCallback } from "react";
import PetorlMarker from "./PetrolMarker";
import PetrolInfoWindow from "./PetrolInfoWindow";
import { debounce } from "lodash";
import coffee from "../assets/coffee.png";

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
  const [bounds, setBounds] = useState(null);
  const [distance, setDistance] = useState(0);

  const directionsService = new window.google.maps.DirectionsService();

  const fetchWithDebounce = useCallback(
    debounce((params) => {
      fetchServoByMap(params);
    }, 1000),
    []
  );

  useEffect(() => {
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const params = {
        swLat: sw.lat(),
        swLng: sw.lng(),
        neLat: ne.lat(),
        neLng: ne.lng(),
      };
      if (!srcLocation || !desLocation) {
        fetchWithDebounce(params); // Use the debounced function
      }
    }
  }, [bounds]);

  const fetchServoByMap = async (params) => {
    const result = await getServoByMap(params);
    if (result) {
      setServo(result.body);
    }
  };

  useEffect(() => {
    handleGeocode(src).then((location) => setSrcLocation(location));
  }, [src]);

  useEffect(() => {
    handleGeocode(des).then((location) => setDesLocation(location));
  }, [des]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);
  /**
   * get the bounding zoom
   */
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
          let totalDistance = 0;
          const legs = result.routes[0].legs;
          legs.forEach((leg) => {
            totalDistance += leg.distance.value; // Distance in meters
          });

          // Convert distance to kilometers or miles if needed
          totalDistance = totalDistance / 1000;
          setDistance(totalDistance);
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
      setServo(filteredServo);
    }
  }, [srcLocation, desLocation, waypoints]);

  useEffect(() => {
    if (!selectedInfoStation) {
      return;
    }
    if (!srcLocation || !desLocation) {
      const selectedInfoStationLoc = {
        lat: selectedInfoStation.location_y,
        lng: selectedInfoStation.location_x,
      };
      // console.log(cur, selectedInfoStationLoc);
      calculateRoute(cur, selectedInfoStationLoc, waypoints);
    }
  }, [srcLocation, desLocation, waypoints, selectedInfoStation]);

  useEffect(() => {
    if (servo) {
      setFilteredServo(
        servo.filter((station) => brand.includes(station.brand))
      );
    }
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
        onBoundsChanged={() => {
          const bounds = map.getBounds();
          setBounds(bounds);
        }}
      >
        <MarkerF position={cur} />
        <PetorlMarker
          id="petrol-marker"
          petrolType={petrolType}
          servo={filteredServo}
          setSrcLocation={setSrcLocation}
          setWayPoints={setWayPoints}
          setMarkerInfoVisiable={setMarkerInfoVisiable}
          setSelectedInfoStation={setSelectedInfoStation}
        />
        <PetrolInfoWindow
          routesDistance={distance}
          waypoints={waypoints}
          srcLocation={srcLocation}
          desLocation={desLocation}
          setWayPoints={setWayPoints}
          infoVisiable={markerInfoVisiable}
          setInfoVisiable={setMarkerInfoVisiable}
          infoStation={selectedInfoStation}
          setSelectedStation={setSelectedInfoStation}
          petrolType={petrolType}
          curLocation={cur}
        />
        {srcLocation && <MarkerF position={srcLocation} />}
        {desLocation && <MarkerF position={desLocation} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      <div className="floating-button">
        <a href="https://buymeacoffee.com/jiajunliu" class="button">
          <img src={coffee} alt="Button Image" className="button-image" />
        </a>
      </div>
    </div>
  );
};

export default PetrolMap;
