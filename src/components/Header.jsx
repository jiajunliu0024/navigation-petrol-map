import "./style.css";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider, IconButton } from "@mui/material";
import PetrolSelect from "./PetrolSelect";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";
import LocationSearchingSharpIcon from "@mui/icons-material/LocationSearchingSharp";
import RoomIcon from "@mui/icons-material/Room";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import ServoBrandSelect from "./ServoBrandSelect";
import { useMediaQuery } from "@mui/material";

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
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <div
      id="menu"
      className="h-40 my-2 md:h-20 lg:h-15 relative flex flex-col md:flex-row items-center justify-between"
    >
      <GooglePlacesAutocomplete
        Icon={PanoramaFishEyeIcon}
        inputValue={src}
        setInputValue={setSrc}
        className="relative w-full md:w-auto"
        label={"Your location"}
      ></GooglePlacesAutocomplete>
      <GooglePlacesAutocomplete
        Icon={RoomIcon}
        inputValue={des}
        setInputValue={setDes}
        label={"Choose destination"}
        className="relative w-full md:w-auto"
      ></GooglePlacesAutocomplete>
      <Divider
        orientation={isSmallScreen ? "horizontal" : "vertical"}
        flexItem
        sx={{
          height: isSmallScreen ? "auto" : "80%", // Height for vertical mode
          width: isSmallScreen ? "100%" : "auto", // Width for horizontal mode
          backgroundColor: "#d3d3d3",
        }}
      />
      <div className="relative rounded-full justify-between flex flex-row md:flex-row h-10 w-full md:w-auto">
        <IconButton
          className="relative rounded-full md:w-auto"
          variant="contained"
        >
          <MenuIcon />
        </IconButton>
        <div>
          <IconButton
            className="relative rounded-full md:w-auto"
            variant="contained"
            onClick={getCurLocation}
          >
            <LocationSearchingSharpIcon />
          </IconButton>
          <PetrolSelect
            className="relative rounded-full h-4 w-8 md:w-auto"
            petrol={petrol}
            setPetrol={setPetrol}
          />
          <ServoBrandSelect
            className="relative rounded-full h-4 w-8 md:w-auto"
            servoBrand={brand}
            setServoBrand={setBrand}
          ></ServoBrandSelect>
        </div>
      </div>
    </div>
  );
};

export default Header;
