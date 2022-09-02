import React, { useContext } from "react";
import "./App.css";
import NavBar from "./components/NavBar";

import { Navigate, Route, Routes } from "react-router-dom";
import FunCat from "./components/FunCat";
import Promotion from "./components/Promotion";
import About from "./components/About";
import Register from "./components/Register";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import CatAdoptionDetail from "./components/CatAdoptionDetail";
import { GlobalContext } from "./components/GlobalStore";

const App = () => {
    const { info } = useContext(GlobalContext);
    return (
        <div>
            <NavBar />

            <div className="container">
                <Routes>
                    <Route path="/" exact element={<Home />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/funcat" element={<FunCat />} />
                    <Route path="/promotion" exact element={<Promotion />} />
                    <Route path="/promotion/:slug" element={<CatAdoptionDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute user={info.userid}>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
