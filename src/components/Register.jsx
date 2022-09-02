import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import keys from "./keys";
import { GlobalContext } from "./GlobalStore";
import "./Register.css";

const { WEB_BASE_URL, API_ADD_USER } = keys;

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm();

    const { updateInfo } = useContext(GlobalContext);

    const onSubmit = async (data) => {
        if (!data.firstname.trim()) {
            setError("firstname", { type: "focus" }, { shouldFocus: true });
        }
        if (!data.email.trim()) {
            setError("email", { type: "focus" }, { shouldFocus: true });
        }
        if (!data.password.trim()) {
            setError("password", { type: "focus" }, { shouldFocus: true });
        }

        const ADD_URL = WEB_BASE_URL + API_ADD_USER;
        try {
            const res = await axios.post(ADD_URL, {
                name: data.firstname,
                email: data.email,
                password: data.password,
                memtype: data.memtype,
                adoptedCats: [],
            });

            const { success, token } = res.data;

            if (success === false) {
                alert(res.data.error);

                return null;
            }

            console.log("DATABASE:", res.data.data);
            const { _id, name, email, memtype, adoptedCats } = res.data.data;

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
            console.log("error in Add ", err);
        }
    };

    return (
        <div>
            <h2>
                Member Registration
                <span className="register">
                    <i className="fa fa-paw" aria-hidden="true"></i>
                </span>
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label>First name</label>
                    <input
                        type="text"
                        name="firstname"
                        {...register("firstname", { required: true })}
                    />
                    {errors.firstname ? <span className="err">Name is required</span> : null}
                    <label>Email</label>
                    <input type="email" name="email" {...register("email", { required: true })} />
                    {errors.email ? <span className="err">Email is required</span> : null}
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        {...register("password", { required: true })}
                    />
                    {errors.password ? <span className="err">Password is required</span> : null}
                    <label>Membership</label>
                    <select
                        name="memtype"
                        defaultValue="basic"
                        id="memtype"
                        {...register("memtype")}
                    >
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                    </select>

                    <button type="submit" className="btn">
                        Sign up <i className="fa fa-paw" aria-hidden="true"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;

/* 
res.status(201).json( {
            success: true, 
            data : {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    memtype: user.memtype },
            token:  token 
        });   */
