import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./pages/SignIn";

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
    </BrowserRouter>
  );
};

export default Routers;
