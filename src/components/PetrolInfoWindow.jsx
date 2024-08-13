import { Button } from "@mui/material";
import getDirectionLink from "../api/directionGoogleLink";
const PetrolInfoWindow = ({
  infoVisiable,
  infoStation,
  srcLocation,
  desLocation,
  setInfoVisiable,
  setWayPoints,
}) => {
  const cancelDetour = () => {
    setInfoVisiable(false);
    setWayPoints([]);
  };
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
      <div>infoStation: {infoVisiable ? infoStation.address : null}</div>
      <div>Distance: </div>
      <div>Estimated Cost: </div>
      <div>
        <Button onClick={cancelDetour}>Cancel</Button>
        <Button href={directionUrl}>Navigate</Button>
      </div>
    </div>
  );
};
export default PetrolInfoWindow;
