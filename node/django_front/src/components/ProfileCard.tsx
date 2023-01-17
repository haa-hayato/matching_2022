import { Card, CardContent, CircularProgress, Fade } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTagDisplay } from "../hooks/useTagDisplay";
import { useEffect } from "react";

type recommendUser = {
  userData: {
    id: number;
    name: string;
    tags: { name: string; similar: boolean }[];
  };
  isProcessing: boolean;
};

export const ProfileCard = (props: recommendUser) => {
  const { render: TagDisplay, setChipData } = useTagDisplay();
  useEffect(() => {
    const sortedTagList: { name: string; similar: boolean }[] = [];
    props.userData.tags.forEach((tag) => {
      if (tag.similar) {
        sortedTagList.unshift(tag);
      } else {
        sortedTagList.push(tag);
      }
    });

    const userTagListWithKey = sortedTagList.map((elem, idx) => {
      return { tagId: 0, key: idx, label: elem.name, similar: elem.similar };
    });

    setChipData(userTagListWithKey);
  }, [props]);
  return (
    <>
      {props.isProcessing ? (
        <Fade
          in={props.isProcessing}
          style={{
            transitionDelay: props.isProcessing ? "10ms" : "0ms",
          }}
          unmountOnExit
        >
          <CircularProgress size={446} />
        </Fade>
      ) : (
        <Card sx={{ minHeight: 450 }}>
          <AccountCircleIcon style={{ fontSize: 300, padding: 0 }} />
          <CardContent>
            <h2 style={{ marginTop: -20 }}>{props.userData.name}</h2>
            {TagDisplay()}
          </CardContent>
        </Card>
      )}
      {/* <Card sx={{ minHeight: 450 }}>
        <AccountCircleIcon style={{ fontSize: 300, padding: 0 }} />
        <CardContent>
          <h2 style={{ marginTop: -20 }}>{props.userData.name}</h2>
          {TagDisplay()}
        </CardContent>
      </Card> */}
    </>
  );
};
