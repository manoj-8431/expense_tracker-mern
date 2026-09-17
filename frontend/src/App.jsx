import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom"

import Register from "./pages/register";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import AddTransaction from "./pages/addTransaction";
import EditTransaction from "./pages/editTransaction";
import NavBar from "./components/NavBar";

function AppRoutes(){
  const location = useLocation();

  const hideNavbar = location.pathname === "/" || location.pathname === "/register";

  return(
    <>
      {!hideNavbar && <NavBar/>}
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/add-transaction" element={<AddTransaction/>} />
        <Route path="/edit-transaction/:id" element={<EditTransaction/>} />
      </Routes>
    </>
  );
}

function App(){
  return(
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  );
}

export default App;