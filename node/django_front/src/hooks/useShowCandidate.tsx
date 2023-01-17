import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProfileCard } from "../components/ProfileCard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { pink } from "@mui/material/colors";

type recommendUser = {
  id: number;
  name: string;
  tags: { name: string; similar: boolean }[];
  similarCount: number;
};

export const useShowCandidate = () => {
  const [recommendUsers, setRecommendUsers] = useState<recommendUser[]>([
    { id: 0, name: "", tags: [], similarCount: 0 },
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [userCount, setUserCount] = useState<number>(0);
  const [isReload, setIsReload] = useState<boolean>(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("id");
    const fetchData = async () => {
      try {
        setIsProcessing(true);
        if (userId) {
          const data = await axios
            .get(`http://localhost:8000/app/recommend/${userId}/`)
            .then((res) => res.data)
            .catch((err) => console.log("err", err));
          setRecommendUsers(await data);
        }
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsProcessing(false);
      }
    };
    fetchData();
  }, [isReload]);

  const like = async () => {
    if (userCount === recommendUsers.length - 1) {
      await axios.post(`http://localhost:8000/app/like/`, {
        userId: Number(sessionStorage.getItem("id")),
        targetUserId: recommendUsers[userCount].id,
      });
      setUserCount(0);
      setIsReload(!isReload);
    } else {
      await axios.post(`http://localhost:8000/app/like/`, {
        userId: Number(sessionStorage.getItem("id")),
        targetUserId: recommendUsers[userCount].id,
      });

      setUserCount(userCount + 1);
    }
  };
  const disLike = async () => {
    if (userCount === recommendUsers.length - 1) {
      await axios.post(`http://localhost:8000/app/dislike/`, {
        userId: Number(sessionStorage.getItem("id")),
        targetUserId: recommendUsers[userCount].id,
      });
      setUserCount(0);
      setIsReload(!isReload);
    } else {
      await axios.post(`http://localhost:8000/app/dislike/`, {
        userId: Number(sessionStorage.getItem("id")),
        targetUserId: recommendUsers[userCount].id,
      });
      setUserCount(userCount + 1);
    }
  };

  const render = () => {
    return (
      <>
        {recommendUsers.length > 0 ? (
          <>
            {/* <h1>おすすめユーザー</h1> */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: "75vh",
                width: "700px",
                m: "35px auto",
                justifyContent: "center",
              }}
            >
              <ProfileCard
                userData={recommendUsers[userCount]}
                isProcessing={isProcessing}
              />

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button onClick={disLike}>
                  <ThumbDownIcon fontSize="large" />
                </Button>
                <Button onClick={like}>
                  <FavoriteIcon fontSize="large" sx={{ color: pink[400] }} />
                </Button>
              </Stack>
            </Paper>
          </>
        ) : (
          <>
            <h1>おすすめユーザー</h1>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: "75vh",
                width: "700px",
                m: "35px auto",
                justifyContent: "center",
              }}
            >
              <h2 style={{ marginTop: 100 }}>表示できるユーザーがいません</h2>
            </Paper>
          </>
        )}
      </>
    );
  };

  return {
    render,
  };
};
