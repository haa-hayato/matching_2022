import { useEffect } from "react";
import { useCheckSignIn } from "../hooks/useCheckSignIn";
export const TopPage = () => {
  const { checkSignIn } = useCheckSignIn();
  useEffect(() => {
    checkSignIn();
  }, []);
  return <div>トップページ</div>;
};
