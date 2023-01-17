import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCheckSignIn = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();
  const checkSignIn = async () => {
    const userId = Number(sessionStorage.getItem("id"));
    const response: {
      id: number;
      name: string;
      email: string;
      password: string;
    } = await axios
      .get(`http://localhost:8000/app/users/${userId}/`)
      .then((res) => res.data)
      .catch((err) => console.log("err", err));

    if (!sessionStorage.getItem("id")) {
      navigate("/");
      return;
    }
    if (!!response) {
      setUserId(Number(sessionStorage.getItem("id")));
      return;
    } else {
      sessionStorage.removeItem("id");
      navigate("/");
      return;
    }
  };
  return {
    checkSignIn,
    userId,
  };
};
