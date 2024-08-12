import { Button } from "@mui/material";
const PetrolInfoWindow = ({
  infoVisiable,
  infoStation,
  setInfoVisiable,
  setWayPoints,
}) => {
  console.log("visible:", infoVisiable);

  const cancelDetour = () => {
    setInfoVisiable(false);
    setWayPoints([]);
  };

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
      <div>Distance: </div>
      <div>Estimated Cost: </div>
      <div>
        <Button onClick={cancelDetour}>Cancel</Button>
        <Button>Navigate</Button>
      </div>
    </div>
  );
};
export default PetrolInfoWindow;
