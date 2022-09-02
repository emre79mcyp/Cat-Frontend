import React, { useState, createContext, useEffect } from "react";
import catsAdoption from "./CatAdoption";

let initialInfo = {
    userid: null,
    name: null,
    email: null,
    memtype: null,
    adoptedCats: [],
};

const checklocal = localStorage.getItem("PSInfo");

if (checklocal && Object.entries(checklocal).length > 0) {
    initialInfo = JSON.parse(checklocal);
}

export const GlobalContext = createContext(initialInfo);

export const GlobalStore = ({ children }) => {
    const [info, setInfo] = useState(initialInfo);

    const updateInfo = (newInfo) => {
        setInfo(newInfo);
    };

    useEffect(() => {
        updateInfo(initialInfo);
    }, []);

    return (
        <GlobalContext.Provider value={{ info, updateInfo, catsAdoption }}>
            {children}
        </GlobalContext.Provider>
    );
};
