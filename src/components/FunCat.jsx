import axios from "axios";
import React, { useEffect, useState } from "react";

const myCatPath = "https://api.thecatapi.com/v1/images/search/?limit=15&page=100&order=DESC";

const FunCat = () => {
    const [data, setData] = useState(() => ({
        cats: [],
        loading: true,
        error: null,
    }));

    async function getData() {
        try {
            const res = await axios.get(myCatPath);
            const data = res.data;

            setData({ loading: false, cats: data });
        } catch (error) {
            console.error("get error");
            setData({
                loading: false,
                error,
                cats: [],
            });
        }
    }
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div>
                <div className="showlist">
                    {data.loading && <p> loading ... </p>}

                    {data.cats.length &&
                        data.cats.map((cat) => (
                            <div key={cat.id}>
                                <img className="image" src={cat.url} alt="cat img" />
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default FunCat;
