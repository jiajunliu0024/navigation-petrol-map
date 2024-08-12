import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import geocodeAddress from "../api/geocode";
import { getServoByRoute } from "../api/servo";
import "../App.css";
import { useEffect, useState, useCallback } from "react";
import petrolImages from "../api/petrolImages";

const Map = ({ brand, petrolType, src, des, cur }) => {
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

  const PetrolInfoWindow = () => {
    return selectedInfoStation ? (
      <InfoWindow
        visiable={markerInfoVisiable}
        onCloseClick={() => {
          setMarkerInfoVisiable(false);
        }}
        position={{
          lat: selectedInfoStation.location_y,
          lng: selectedInfoStation.location_x,
        }}
      >
        <div>
          <h4>{selectedInfoStation.brand}</h4>
          <h4>{selectedInfoStation.address}</h4>
        </div>
      </InfoWindow>
    ) : null;
  };

  const PetorlMarker = ({ servo }) => {
    // TODO: change the icon shape liked marker
    const getIconImage = (station) => {
      const imageSrc = petrolImages[station.brand] || petrolImages.default; // Fallback to a default image if brand not found
      return {
        url: imageSrc,
        scaledSize: {
          width: 20, // Width in pixels
          height: 20, // Height in pixels
        }, // Set the size here (width, height) in pixels
      };
    };

    const getStationTitle = (station) => {
      const petrol = station.petrol_list.find(
        (petrol) => petrol.type === petrolType
      );
      if (petrol) {
        return `${petrol.amount}`;
      }
    };

    const displayInfoWindow = (event) => {
      // TODO: update the Info window to the top of the map instead of on the marker
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setWayPoints([{ lat, lng }]);
      setMarkerInfoVisiable(true);
    };

    return servo.map((station) => (
      <div id={station.id}>
        <MarkerF
          // TODO: update the marker graph also the amount of petrol to a better display
          clickable={true}
          onClick={(event) => {
            setSelectedInfoStation(station);
            displayInfoWindow(event);
          }}
          key={station.address}
          icon={getIconImage(station)}
          label={getStationTitle(station)}
          position={{ lat: station.location_y, lng: station.location_x }}
        />
      </div>
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
        <PetorlMarker id="petrol-marker" servo={filteredServo} />
        <PetrolInfoWindow />
        {srcLocation && <MarkerF position={srcLocation} />}
        {desLocation && <MarkerF position={desLocation} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default Map;
