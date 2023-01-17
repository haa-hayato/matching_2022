import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { useState } from "react";
import axios from "axios";

interface ChipData {
  key: number;
  label: string;
  tagId: number;
  similar?: boolean;
}

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export const useTagDisplay = () => {
  const [chipData, setChipData] = useState<
    { key: number; label: string; tagId: number; similar?: boolean }[]
  >([]);

  const handleDelete = (chipToDelete: ChipData) => async () => {
    await axios.delete(
      `http://localhost:8000/app/delete-user-tag/${sessionStorage.getItem(
        "id"
      )}/${chipToDelete.tagId}/`
    );
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  const render = () => {
    return (
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
        }}
        component="ul"
      >
        {chipData.map((data) => {
          let icon;

          if (data.label === "React") {
            icon = <TagFacesIcon />;
          }

          if (data.similar == true) {
            return (
              <ListItem key={data.key}>
                <Chip icon={icon} label={data.label} color="success" />
              </ListItem>
            );
          } else if (data.similar == false) {
            return (
              <ListItem key={data.key}>
                <Chip icon={icon} label={data.label} />
              </ListItem>
            );
          } else {
            return (
              <ListItem key={data.key}>
                <Chip
                  icon={icon}
                  label={data.label}
                  onDelete={handleDelete(data)}
                />
              </ListItem>
            );
          }
        })}
      </Paper>
    );
  };
  return { render, setChipData };
};
