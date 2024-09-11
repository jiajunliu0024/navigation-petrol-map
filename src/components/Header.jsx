import "./style.css";
import * as React from "react";
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
  updatePosition,
}) => {
  const getCurLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updatePosition({ lat: latitude, lng: longitude });
          setSrc({ lat: latitude, lng: longitude });
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
      className="h-auto my-2 md:h-auto lg:h-auto relative flex flex-col xl:flex-row items-center justify-between"
    >
      <div className="relative h-auto flex flex-col md:flex-row mx-2 ">
        <GooglePlacesAutocomplete
          Icon={PanoramaFishEyeIcon}
          inputValue={src}
          setInputValue={setSrc}
          className="relative w-full md:flex-initial sm:w-auto"
          label={"Your location"}
        ></GooglePlacesAutocomplete>
        <GooglePlacesAutocomplete
          Icon={RoomIcon}
          inputValue={des}
          setInputValue={setDes}
          label={"Choose destination"}
          className="relative w-full md:flex-initial sm:w-auto"
        ></GooglePlacesAutocomplete>
      </div>

      <div className="relative flex items-center justify-between h-auto w-full p-2">
        {/* Left section: IconButton on the left for small screens */}
        <div className="flex-grow-0 block xl:hidden">
          <IconButton className="rounded-full" variant="contained">
            <MenuIcon />
          </IconButton>
        </div>

        {/* Right section: Other items, aligned to the right */}
        <div className="flex flex-row items-center space-x-2 justify-end flex-grow">
          <div className="rounded-full hidden xl:block">
            <IconButton
              className="rounded-full hidden xl:block"
              variant="contained"
            >
              <MenuIcon />
            </IconButton>
          </div>
          <IconButton
            className="rounded-full"
            variant="contained"
            onClick={getCurLocation}
          >
            <LocationSearchingSharpIcon />
          </IconButton>

          <PetrolSelect
            className="rounded-full h-10 w-full md:w-auto"
            petrol={petrol}
            setPetrol={setPetrol}
          />

          <ServoBrandSelect
            className="rounded-full h-10 w-full md:w-auto"
            servoBrand={brand}
            setServoBrand={setBrand}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
