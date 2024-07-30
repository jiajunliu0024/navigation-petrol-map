import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import "../GooglePlacesAutocomplete.css";

const GooglePlacesAutocomplete = ({
  inputValue,
  setInputValue,
  label,
  Icon,
}) => {
  const [options, setOptions] = useState([]);
  const [autocompleteService, setAutocompleteService] = useState(null);

  useEffect(() => {
    if (!autocompleteService && window.google) {
      setAutocompleteService(
        new window.google.maps.places.AutocompleteService()
      );
    }
  }, [autocompleteService]);

  useEffect(() => {
    if (inputValue && autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input: inputValue },
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
  }, [inputValue, autocompleteService]);

  return (
    <div className="flex flex-row items-center justify-between">
      <Icon color="action" className="mx-2"></Icon>
      <Autocomplete
        size="small"
        options={options}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            sx={{
              width: {
                xs: "360px", // width for extra-small screens
                sm: "400px", // width for small screens
                md: "400px", // width for medium screens
                lg: "400px", // width for large screens
                xl: "400px", // width for extra-large screens
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
