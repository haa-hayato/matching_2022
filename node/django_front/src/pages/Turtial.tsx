import {
  Autocomplete,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useCheckSignIn } from "../hooks/useCheckSignIn";
import { useTagRegister } from "../hooks/useTagRegister";
import { jaJP } from "@mui/material/locale";

export const TurtrialPage = () => {
  const { checkSignIn } = useCheckSignIn();
  const { render } = useTagRegister();
  useEffect(() => {
    checkSignIn();
  }, []);
  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    jaJP
  );
  return (
    <div>
      {/* <ThemeProvider theme={theme}> */}
      <Grid>{render()}</Grid>
      {/* </ThemeProvider> */}
    </div>
  );
};
