import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUp from "./pages/SignUp";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}
