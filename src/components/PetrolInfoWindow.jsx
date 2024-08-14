import { Button } from "@mui/material";
import getDirectionLink from "../api/directionGoogleLink";
import { getDetourInfoByRoute } from "../api/servo";
import { useEffect, useState } from "react";
const PetrolInfoWindow = ({
  infoVisiable,
  infoStation,
  srcLocation,
  desLocation,
  petrolType,
  setInfoVisiable,
  setWayPoints,
}) => {
  const [distance, setDistance] = useState(null);
  const [cost, setCost] = useState(null);
  const [price, setPrice] = useState(null);

  const cancelDetour = () => {
    setInfoVisiable(false);
    setWayPoints([]);
  };

  const fetchDetourInfo = async () => {
    if (srcLocation && desLocation && infoStation) {
      const params = {
        srcLat: srcLocation.lat,
        srcLng: srcLocation.lng,
        desLat: desLocation.lat,
        desLng: desLocation.lng,
        petrolType: petrolType,
        stationId: infoStation.id,
      };
      const data = await getDetourInfoByRoute(params);
      setDistance(data.body.distance);
      setCost(data.body.cost);
      setPrice(data.body.price);
    }
  };
  useEffect(() => {
    fetchDetourInfo();
  }, [infoStation, petrolType]);

  const directionUrl = getDirectionLink(infoStation);

  return (
    <div
      hidden={infoVisiable ? null : "hidden"}
      id="info-panel"
      style={{
        position: "absolute",
        top: "60px",
        left: "50%",
        width: "200px",
        transform: "translateX(-50%)",
        background: "#fff",
        padding: "5px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <div>Address: {infoVisiable ? infoStation.address : null}</div>
      <div>Distance: {distance} km</div>
      <div>
        {petrolType}:{price} Estimated Cost: {cost} $
      </div>
      <div>
        <Button onClick={cancelDetour}>Cancel</Button>
        <Button href={directionUrl}>Navigate</Button>
      </div>
    </div>
  );
};
export default PetrolInfoWindow;
