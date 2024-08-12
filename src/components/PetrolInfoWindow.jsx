const PetrolInfoWindow = ({ infoVisiable, infoStation, setInfoVisiable }) => {
  console.log("visible:", infoVisiable);
  return infoVisiable ? (
    <div
      id="info-panel"
      style={{
        position: "absolute",
        bottom: "100px",
        left: "50%",
        width: "300px",
        transform: "translateX(-50%)",
        background: "#fff",
        padding: "5px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      {/* <h4>Route Information</h4> */}
      {/* <div>Address: {selectedInfoStation.address}</div>
      <div>Brand Cost: {selectedInfoStation.brand}</div> */}
      <div>Distance: </div>
      <div>Estimated Cost: </div>
      {/* <div>
        <Button>Navigate</Button>
        <Button>Submmit Price</Button>
      </div> */}
    </div>
  ) : null;
};
export default PetrolInfoWindow;
