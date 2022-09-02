import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalStore } from "./components/GlobalStore";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <GlobalStore>
                <App />
            </GlobalStore>
        </Router>
    </React.StrictMode>
);
