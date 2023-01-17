import { Button, IconButton, Modal, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useCheckSignIn } from "../hooks/useCheckSignIn";
import { useShowCandidate } from "../hooks/useShowCandidate";
import { useTagRegister } from "../hooks/useTagRegister";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export const TopPage = () => {
  const { render: Candidates } = useShowCandidate();
  const { checkSignIn } = useCheckSignIn();
  const { render: EditTag } = useTagRegister();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);
  const navigate = useNavigate();
  useEffect(() => {
    checkSignIn();
  }, []);
  return (
    <div>
      {/* <Button
        sx={{ marginLeft: 78, marginTop: 3, marginBottom: -10 }}
        variant="contained"
        size="large"
        onClick={handleOpenModal}
      >
        趣味タグ編集
      </Button>
      <IconButton sx={{ marginLeft: 78, marginTop: 3, marginBottom: -10 }}>
        <LogoutIcon />
      </IconButton> */}

      <Stack
        direction="row"
        spacing={73}
        justifyContent="center"
        sx={{ marginTop: 3 }}
      >
        <IconButton
          onClick={() => {
            navigate("/");
          }}
        >
          <LogoutIcon fontSize="large" />
        </IconButton>

        <Button variant="contained" size="large" onClick={handleOpenModal}>
          趣味タグ編集
        </Button>
      </Stack>

      <Modal
        open={isOpenModal}
        onClose={handleCloseModal}
        style={{ marginTop: 30 }}
      >
        {EditTag()}
      </Modal>
      {Candidates()}
    </div>
  );
};
