import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import "../GooglePlacesAutocomplete.css";

const GooglePlacesAutocomplete = ({ setInputValue, label, Icon }) => {
  const [options, setOptions] = useState([]);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    if (!autocompleteService && window.google) {
      setAutocompleteService(
        new window.google.maps.places.AutocompleteService()
      );
    }
  }, [autocompleteService]);

  useEffect(() => {
    if (searchValue && autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input: searchValue },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setOptions(predictions.map((prediction) => prediction.description));
          } else {
            setOptions([]);
          }
        }
      );
    } else {
      setOptions([]);
    }
  }, [searchValue, autocompleteService]);

  return (
    <div className="flex flex-row items-center">
      <Icon color="action" className="mx-2"></Icon>
      <Autocomplete
        sx={{
          borderColor: "black",
          borderRadius: "20px", // Set the border radius
        }}
        className="bg-white rounded-none"
        size="small"
        options={options}
        inputValue={searchValue}
        onInputChange={(event, newInputValue) => {
          setSearchValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          setInputValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              border: "none",
              width: {
                xs: "360px", // width for extra-small screens
                sm: "400px", // width for small screens
                md: "400px", // width for medium screens
                lg: "400px", // width for large screens
                xl: "400px", // width for extra-large screens
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "20px",
                  borderColor: "grey",
                },
              },
            }}
            label={label}
          />
        )}
      />
    </div>
  );
};

export default GooglePlacesAutocomplete;
