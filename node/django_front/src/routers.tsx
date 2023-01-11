import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./pages/SignIn";
import { TurtrialPage } from "./pages/Turtial";
import { TopPage } from "./pages/Top";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignInPage />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route
          path="/turtrial"
          element={
            <>
              <TurtrialPage />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route
          path="/top"
          element={
            <>
              <TopPage />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
