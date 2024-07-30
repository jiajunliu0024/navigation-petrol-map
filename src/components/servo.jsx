import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

export default function ServoSelect({ servo, setServo }) {
  const servoTypes = ["All", "Shell", "Carltex", "BP", "United", "7-11"];

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setServo(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    console.log(servo);
  };

  return (
    <FormControl sx={{ minWidth: 200 }} size="small">
      <InputLabel id="servo-select-input">Servo Type</InputLabel>
      <Select
        labelId="servo-select-input"
        id="servo-select"
        multiple
        value={servo}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
      >
        {servoTypes.map((type) => (
          <MenuItem key={type} value={type}>
            <Checkbox checked={servo} />
            <ListItemText primary={type} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
