// import { useState, useEffect, useRef, useMemo } from "react";
import "./style.css";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider, IconButton } from "@mui/material";
import PetrolSelect from "./PetrolSelect";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";
import LocationSearchingSharpIcon from "@mui/icons-material/LocationSearchingSharp";
import RoomIcon from "@mui/icons-material/Room";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import ServoBrandSelect from "./ServoBrandSelect";

const Header = ({
  brand,
  setBrand,
  petrol,
  setPetrol,
  src,
  des,
  setSrc,
  setDes,
  cur,
  updatePosition,
}) => {
  // const [src, setSrc] = useState("");
  // const [des, setDes] = useState("");
  const getCurLocation = () => {
    // console.log(cur);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updatePosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.log("error api");
    }
  };

  return (
    <div
      id="menu"
      className="h-40 m-2 md:h-20 lg:h-15 relative flex flex-col md:flex-row items-center justify-between  rounded-t-lg"
    >
      <GooglePlacesAutocomplete
        Icon={PanoramaFishEyeIcon}
        inputValue={src}
        setInputValue={setSrc}
        className="relative rounded-lg h-8 w-full md:w-auto"
        label={"Your location"}
      ></GooglePlacesAutocomplete>
      <GooglePlacesAutocomplete
        Icon={RoomIcon}
        inputValue={des}
        setInputValue={setDes}
        label={"Choose destination"}
        className="relative mx-5 rounded-lg h-8 m-2 w-full md:w-auto"
      ></GooglePlacesAutocomplete>
      {/* <Button
        className="relative rounded-lg h-8 w-full md:w-auto"
        variant="contained"
        startIcon={<SearchIcon />}
      >
        Search
      </Button> */}
      <Divider />
      <div className="relative rounded-lg justify-between flex flex-row md:flex-row h-10  w-full md:w-auto">
        <IconButton
          className="relative rounded-lg md:w-auto"
          variant="contained"
        >
          <MenuIcon />
        </IconButton>
        <div>
          {/* <Button
            className="relative rounded-lg md:w-auto"
            variant="contained"
            onClick={() => {}}
          >
            Set Current
          </Button> */}
          <IconButton
            className="relative rounded-lg md:w-auto"
            variant="contained"
            onClick={getCurLocation}
          >
            <LocationSearchingSharpIcon />
          </IconButton>
          <PetrolSelect
            className="relative rounded-lg h-4 w-8 md:w-auto"
            petrol={petrol}
            setPetrol={setPetrol}
          />

          <ServoBrandSelect
            className="relative rounded-lg h-4 w-8 md:w-auto"
            servoBrand={brand}
            setServoBrand={setBrand}
          ></ServoBrandSelect>
        </div>
      </div>
      {/* <Button
        className="relative rounded-lg m-1 w-full md:w-auto"
        variant="contained"
        startIcon={<SearchIcon />}
      >
        Search
      </Button>
      */}
    </div>
  );
};

export default Header;
