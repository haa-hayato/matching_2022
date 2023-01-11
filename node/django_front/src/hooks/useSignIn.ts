import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useSignIn = () => {
  const navaigate = useNavigate();
  const [values, setValues] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const setValue = (key: string, value: string) => {
    setValues(
      (current) =>
        ({ ...current, [key]: value } as { email: string; password: string })
    );
  };

  const signIn = async () => {
    setIsProcessing(true);
    try {
      if (!values?.email.match(/.+@.+\..+/)) {
        window.alert("メースアドレスの形式が異なります");
        return;
      }

      const response: { isLogin: boolean; userId: number } = await axios
        .post("http://localhost:8000/app/signin/", values)
        .then((res) => res.data)
        .catch((err) => console.log("err", err));

      if (response.isLogin) {
        window.alert("ログイン成功");
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

  const signUp = () => {
    console.log("サインアップ");
  };

  return { values, setValue, signIn, signUp, isProcessing };
};
