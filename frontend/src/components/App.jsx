import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../App.css";
import AuthForm from "./AuthForm";
import Home from "./Home";
import UnAuthorized from "./UnAuthorized";
import PageNotFound from "./PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
