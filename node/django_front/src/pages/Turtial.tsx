import {
  Autocomplete,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  createTheme,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useCheckSignIn } from "../hooks/useCheckSignIn";
import { useTagRegister } from "../hooks/useTagRegister";
import { jaJP } from "@mui/material/locale";
import { useNavigate } from "react-router-dom";

export const TurtrialPage = () => {
  const { checkSignIn } = useCheckSignIn();
  const { render } = useTagRegister();
  const navigate = useNavigate();
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
      <Grid>
        <Button
          sx={{ marginLeft: 88, marginTop: 7 }}
          variant="contained"
          onClick={() => {
            navigate("/top");
          }}
        >
          次へ
        </Button>
        {render()}
      </Grid>
      {/* </ThemeProvider> */}
    </div>
  );
};
