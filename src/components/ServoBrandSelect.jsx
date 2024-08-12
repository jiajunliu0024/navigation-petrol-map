import * as React from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";;

export default function ServoBrandSelect({ servoBrand, setServoBrand }) {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

  function getStyles(name, servoBrand, theme) {
    return {
      fontWeight:
        servoBrand.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const theme = useTheme();
  const servoBrands = [
    "SHELL",
    "BP",
    "UNITED",
    "AMPOL",
    "CALTEX",
    "SEVENELEVEN",
    "METRO",
  ];

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setServoBrand(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormControl sx={{ width: 200 }} size="small">
      <InputLabel id="petrol-multiple-label">Petrol Brand</InputLabel>
      <Select
        multiple
        value={servoBrand}
        onChange={handleChange}
        input={<OutlinedInput label="Petrol Brand" />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>Placeholder</em>;
          }
          return selected.join(", ");
        }}
        MenuProps={MenuProps}
      >
        {servoBrands.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, servoBrand, theme)}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
