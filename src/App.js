import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login/Login";
import SignUp from "./Components/Auth/SignUp/SignUp";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import Home from "./Components/Home/Home"
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import Gk from "./Components/Gk/Gk";
import Points from "./Components/Point/Points";
import { Context } from "./Components/Context/Context";

function App() {
  return (
    <div className="App">
      <Context>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="ResetPassword" element={<ResetPassword />} />
            <Route path="/GK" element={<Gk />} />
            <Route path="/Points" element={<Points />} />
          </Routes>
        </Router>
      </Context>
    </div>
  );
}

export default App;
