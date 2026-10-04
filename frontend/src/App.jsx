import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Stores from "./pages/Stores";
import Admin from "./pages/Admin";
import Owner from "./pages/Owner";
import Password from "./pages/Password";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      
        <Route path="/admin" element={<Admin />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/password" element={<Password />} />
        
      </Routes>
    </BrowserRouter>
  );
}


export default App;
