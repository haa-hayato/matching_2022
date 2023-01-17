import {
  Autocomplete,
  Button,
  createTheme,
  Grid,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { jaJP } from "@mui/material/locale";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTagDisplay } from "./useTagDisplay";

export const useTagRegister = () => {
  const [inputValue, setInputValue] = useState<string | null>("");
  const [allTag, setAllTag] = useState<{ name: string; id: number }[]>([]);
  const [allTagName, setAllTagName] = useState<string[]>([]);
  const [isReloadTag, setIsReloadTag] = useState<boolean>(false);
  const [allUserTags, setAllUserTags] = useState<
    { id: number; name: string }[]
  >([]);
  const [allUserTagName, setAllUserTagName] = useState<string[]>();
  //   const [userId, setUserId] = useState<number>(0);

  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    jaJP
  );

  const { render: TagDisplay, setChipData } = useTagDisplay();

  useEffect(() => {
    //const userId = 1;
    const fetchAllTagData = async () => {
      const tagData = await axios
        .get("http://localhost:8000/app/tags/")
        .then((res) => res.data);
      setAllTag(tagData);

      const tagNameList = tagData.map((elem: { name: string; id: number }) => {
        return elem.name;
      });
      setAllTagName(tagNameList);
    };
    fetchAllTagData();

    const fetchAllUserTagData = async () => {
      const userId = Number(sessionStorage.getItem("id"));
      const userTags: { id: number; name: string }[] = await axios
        .get(`http://localhost:8000/app/user-tags/${userId}/`)
        .then((res) => res.data);

      const allUserTagNameList = userTags.map((elem) => {
        return elem.name;
      });

      const userTagListWithKey = userTags.map((elem, idx) => {
        return { tagId: elem.id, key: idx, label: elem.name };
      });
      setChipData(userTagListWithKey);
      setAllUserTagName(allUserTagNameList);
    };

    fetchAllUserTagData();
  }, [isReloadTag]);

  const registerTag = async () => {
    console.log(inputValue);

    if (inputValue) {
      if (allUserTagName?.includes(inputValue)) {
        return;
      }

      if (allTagName.includes(inputValue)) {
        //既存タグ追加
        const tagId = allTag.find((elem) => {
          return elem.name == inputValue;
        });
        await axios.post("http://localhost:8000/app/user-tag-relation/", {
          user_id: sessionStorage.getItem("id"),
          tag_id: tagId!.id,
        });
      } else {
        await axios.post("http://localhost:8000/app/create-tag-with-user/", {
          userId: sessionStorage.getItem("id"),
          name: inputValue,
        });
        //タグ新規作成
      }
    }
    setInputValue(null);
    setIsReloadTag(!isReloadTag);
    console.log(allUserTags);
  };
  const render = () => {
    return (
      <>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            height: "70vh",
            width: "700px",
            m: "10px auto",
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="flex-start" //多分、デフォルトflex-startなので省略できる。
            alignItems="center"
            spacing={4}
          >
            <h1>趣味タグ登録</h1>
            <Stack direction="row" spacing={2}>
              <ThemeProvider theme={theme}>
                <Autocomplete
                  sx={{ width: 300 }}
                  freeSolo
                  id="free-solo-2-demo"
                  disableClearable
                  options={allTag.map((option) => option.name)}
                  onInputChange={(e, v) => {
                    setInputValue(v);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="趣味タグ"
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                    />
                  )}
                />
              </ThemeProvider>

              <Button
                variant="contained"
                onClick={() => {
                  registerTag();
                }}
              >
                登録
              </Button>
            </Stack>

            {TagDisplay()}
          </Grid>
        </Paper>
      </>
    );
  };
  return {
    render,
    allUserTags,
  };
};
