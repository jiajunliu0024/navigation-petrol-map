import petrolImages from "../api/petrolImages";
import { MarkerF } from "@react-google-maps/api";

const PetorlMarker = ({
  servo,
  petrolType,
  setWayPoints,
  setMarkerInfoVisiable,
  setSelectedInfoStation,
  setSrcLocation,
}) => {
  // TODO: change the icon shape liked marker
  const getIconImage = (station) => {
    const imageSrc = petrolImages[station.brand] || petrolImages.default; // Fallback to a default image if brand not found
    return {
      url: imageSrc,
      scaledSize: {
        width: 20, // Width in pixels
        height: 25, // Height in pixels
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
    <div>
      <MarkerF
        key={station.id}
        // TODO: update the marker graph also the amount of petrol to a better display
        clickable={true}
        onClick={(event) => {
          setSelectedInfoStation(station);
          displayInfoWindow(event);
        }}
        icon={getIconImage(station)}
        label={getStationTitle(station)}
        position={{ lat: station.location_y, lng: station.location_x }}
      />
    </div>
  ));
};

export default PetorlMarker;
