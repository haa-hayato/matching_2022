import { useState } from "react";
import { useSignIn } from "../hooks/useSignIn";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import { teal } from "@mui/material/colors";

export const SignInPage = () => {
  const { isProcessing, setValue, signIn, signUp } = useSignIn();
  const [flag, setFlag] = useState<boolean>(true);
  return (
    <div>
      {flag ? (
        <Grid>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: "70vh",
              width: "280px",
              m: "20px auto",
            }}
          >
            <Grid
              container
              direction="column"
              justifyContent="flex-start" //多分、デフォルトflex-startなので省略できる。
              alignItems="center"
            >
              <Avatar sx={{ bgcolor: teal[400] }}>
                <WhatshotOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography variant={"h5"} sx={{ m: "10px" }}>
                マッチングアプリ
              </Typography>
              <Typography variant={"h5"} sx={{ m: "10px" }}>
                Sign In
              </Typography>
            </Grid>
            <TextField
              label="Email"
              variant="standard"
              fullWidth
              required
              onChange={(val) => setValue("email", val.target.value)}
            />
            <TextField
              type="password"
              label="Password"
              variant="standard"
              fullWidth
              required
              onChange={(val) => setValue("password", val.target.value)}
            />
            {/* ラベルとチェックボックス */}
            <Box mt={3}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => {
                  signIn();
                }}
                disabled={isProcessing}
              >
                サインイン
              </Button>

              <Typography variant="caption" display="block">
                アカウントを持っていませんか？
                <Link href="#" onClick={() => setFlag(!flag)}>
                  サインアップ
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ) : (
        <Grid>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: "70vh",
              width: "280px",
              m: "20px auto",
            }}
          >
            <Grid
              container
              direction="column"
              justifyContent="flex-start" //多分、デフォルトflex-startなので省略できる。
              alignItems="center"
            >
              <Avatar sx={{ bgcolor: teal[400] }}>
                <WhatshotOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography variant={"h5"} sx={{ m: "10px" }}>
                マッチングアプリ
              </Typography>
              <Typography variant={"h5"} sx={{ m: "10px" }}>
                Sign Up
              </Typography>
            </Grid>
            <TextField label="Email" variant="standard" fullWidth required />
            <TextField
              type="password"
              label="Password"
              variant="standard"
              fullWidth
              required
            />
            {/* ラベルとチェックボックス */}
            <Box mt={3}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => {
                  signUp();
                }}
                disabled={isProcessing}
              >
                サインアップ
              </Button>

              <Typography variant="caption" display="block">
                アカウントを既に持っていますか？
                <Link href="#" onClick={() => setFlag(!flag)}>
                  サインイン
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
    </div>
  );
};
