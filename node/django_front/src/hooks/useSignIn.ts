import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useSignIn = () => {
  const navigate = useNavigate();
  const [signInValues, setSignInValues] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [signUpValues, setSignUpValues] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const setSignInValue = (key: string, value: string) => {
    setSignInValues(
      (current) =>
        ({ ...current, [key]: value } as { email: string; password: string })
    );
  };

  const setSignUpValue = (key: string, value: string) => {
    setSignUpValues(
      (current) =>
        ({ ...current, [key]: value } as {
          name: string;
          email: string;
          password: string;
        })
    );
  };

  const signIn = async () => {
    setIsProcessing(true);
    try {
      if (!signInValues?.email.match(/.+@.+\..+/)) {
        window.alert("メースアドレスの形式が異なります");
        return;
      }

      const response: { isLogin: boolean; userId: number } = await axios
        .post("http://localhost:8000/app/signin/", signInValues)
        .then((res) => res.data)
        .catch((err) => console.log("err", err));

      if (response.isLogin) {
        sessionStorage.setItem("id", String(response.userId));
        navigate("/top");
      } else {
        window.alert("メールアドレスまたはパスワードが異なります");
      }
    } catch (e) {
      window.alert(`通信エラー: ${e}`);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  };

  const signUp = async () => {
    setIsProcessing(true);
    try {
      if (!signUpValues?.email.match(/.+@.+\..+/)) {
        window.alert("メースアドレスの形式が異なります");
        return;
      }

      const emailValidation: { result: boolean } = await axios
        .post("http://localhost:8000/app/validate-email/", {
          email: signUpValues.email,
        })
        .then((res) => res.data)
        .catch((err) => console.log("err", err));

      if (emailValidation.result === false) {
        window.alert("既に使用されているメールアドレスです");
        return;
      }

      const response: { userId: number } = await axios
        .post("http://localhost:8000/app/signup/", signUpValues)
        .then((res) => res.data)
        .catch((err) => console.log("err", err));

      sessionStorage.setItem("id", String(response.userId));
      navigate("/turtrial");
    } catch (e) {
      window.alert(`通信エラー: ${e}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    signInValues,
    setSignInValue,
    setSignUpValue,
    signIn,
    signUp,
    isProcessing,
  };
};
