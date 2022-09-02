import axios from "axios";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "./GlobalStore";
import keys from "./keys";

const { WEB_BASE_URL, API_UPDATE_USER } = keys;

const CatAdoptionDetail = () => {
    const navigate = useNavigate();
    const { info, updateInfo, catsAdoption } = useContext(GlobalContext);
    const { slug } = useParams();

    const cat = catsAdoption && catsAdoption[slug];

    if (!cat) {
        return <h2> Cat not found </h2>;
    }

    const { name, img } = cat;

    const handleAdopt = async () => {
        const UPDATE_URL = `${WEB_BASE_URL}${API_UPDATE_USER}${info.userid}`;
        const pskey = JSON.parse(localStorage.getItem("PSInfoKey"));
        const psjwt = pskey;
        let config = {
            headers: {
                authorization: "Bearer " + psjwt,
            },
        };

        try {
            const response = await axios.patch(
                UPDATE_URL,
                {
                    id: slug,
                },
                config
            );

            const { success } = response.data;
            const data = response.data.data;

            let newInfo = { ...data };
            delete newInfo._id;
            updateInfo(newInfo);

            if (success === true) {
                alert("Adopted Succesfully");
            }

            localStorage.setItem("PSInfo", JSON.stringify(newInfo));

            navigate("/profile");
        } catch (err) {
            console.log(err);
            console.log("User update failed >", err.message);
        }
    };

    return (
        <div>
            <div className="productdetail">
                <h3> {name} </h3>
                <img src={img} alt={name} />
            </div>
            <h5>Favorite Foods</h5>
            <ul>
                {cat.favFoods.map((food) => (
                    <li key={food}>{food}</li>
                ))}
            </ul>

            <button className="btn2" onClick={handleAdopt}>
                Adopt <i className="fa fa-paw" aria-hidden="true"></i>
            </button>
        </div>
    );
};

export default CatAdoptionDetail;
