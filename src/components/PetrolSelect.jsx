import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function PetrolSelect({ petrol, setPetrol }) {
  const petrolTypes = [
    "E10",
    "U91",
    "U95",
    "U98",
    "LPG",
    "PremDSL",
    "TruckDSL",
    "AdBlue",
    "DIESEL",
  ];

  const handleChange = (event) => {
    setPetrol(event.target.value);
  };

  return (
    <FormControl
      className="rounded-lg bg-white"
      sx={{ minWidth: 80 }}
      size="small"
    >
      <InputLabel id="petrol-select-input">Petrol Type</InputLabel>
      <Select
        placeholder="select petrol"
        labelId="petrol-select-small-label"
        id="petrol-select-small"
        value={petrol}
        label="Petrol"
        onChange={handleChange}
      >
        {petrolTypes.map((pertrol) => (
          <MenuItem key={pertrol} value={pertrol}>
            {pertrol}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
