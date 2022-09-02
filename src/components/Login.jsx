import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import { GlobalContext } from "./GlobalStore";
import "./Register.css";
import keys from "./keys";

const { WEB_BASE_URL, API_LOGIN } = keys;

const Login = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm();

    const { updateInfo } = useContext(GlobalContext);

    const onSubmitForm = async (data) => {
        console.log(data);

        if (!data.email.trim()) {
            setError("email", { type: "focus" }, { shouldFocus: true });
        }
        if (!data.password.trim()) {
            setError("password", { type: "focus" }, { shouldFocus: true });
        }

        const LOGIN_URL = `${WEB_BASE_URL}${API_LOGIN}`;
        try {
            const response = await axios.post(LOGIN_URL, {
                email: data.email,
                password: data.password,
            });

            console.log(response.data.data);

            const { _id, name, email, memtype, adoptedCats } = response.data.data;
            const { token } = response.data;

            const newmem = {
                userid: _id,
                name,
                email,
                memtype,
                adoptedCats,
            };

            updateInfo(newmem);

            localStorage.setItem("PSInfo", JSON.stringify(newmem));
            localStorage.setItem("PSInfoKey", JSON.stringify(token));

            reset();
            navigate("/");
        } catch (err) {
            console.log(err);
            console.error("error in Login >", err.response.data);
            alert(err.response.data.error);
        }
    };

    return (
        <div>
            <h2>
                Please Login{" "}
                <span className="register">
                    <i className="fa fa-paw" aria-hidden="true"></i>
                </span>
                to Member's Page
            </h2>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        {...register("email", { required: true })}
                    />
                    {errors.email ? <span className="err"> email is required!</span> : null}

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        {...register("password", {
                            required: true,
                            minLength: 6,
                            maxLength: 10,
                        })}
                    />

                    {errors.password ? (
                        <span className="err">invalid password (length: 6 to 10 )</span>
                    ) : null}

                    <button type="submit" className="btn">
                        Login <i className="fa fa-paw" aria-hidden="true"></i>
                    </button>
                </div>
            </form>
            <br /> <br />
            <Link to="/register">
                <h3>
                    Not member? Click <span className="register">Register</span> to sign up
                </h3>
            </Link>
        </div>
    );
};

export default Login;
