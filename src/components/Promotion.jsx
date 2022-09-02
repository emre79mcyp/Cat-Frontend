import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";

import { GlobalContext } from "./GlobalStore";

const Promotion = () => {
    const { info, catsAdoption } = useContext(GlobalContext);
    const { email } = info;

    return (
        <>
            <div>
                <h1> Promotion - Cats for Adoption </h1>

                {email === null ? <Navigate to="/login" /> : null}

                <div className="productlist">
                    <ul>
                        {catsAdoption.map(({ id, name, img }) => {
                            return (
                                <li key={id}>
                                    <Link to={`/promotion/${id}`}>
                                        <h3 className="pname">{name} </h3>
                                        <img src={img} alt={name} className="promo-img" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <Link to="/">
                        <button className="btn2">
                            Home <i className="fa fa-paw" aria-hidden="true"></i>
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Promotion;
