import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { GlobalContext } from "./GlobalStore";
import axios from "axios";
import Modal from "react-modal";
import keys from "./keys";
import { useNavigate } from "react-router-dom";

const { WEB_BASE_URL, API_UPDATE_USER, API_DELETE_USER } = keys;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#264653",
  },
};
Modal.setAppElement("#root");

const Profile = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm();

  const { info, updateInfo, catsAdoption } = useContext(GlobalContext);
  console.log("Profile", info);
  const { userid, name, email, memtype, adoptedCats } = info;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  let adoptionList = [];
  catsAdoption.forEach(({ id, name, img }) => {
    if (adoptedCats.includes(id)) {
      adoptionList.push(
        <li key={id}>
          <h3 className="pname">{name} </h3>
          <img src={img} alt={name} className="promo-img" />
        </li>
      );
    }
  });

  // console.log('chk > ', email, memtype );

  // if ( email !== null ) {

  //     // console.log('here ', email )
  //   setValue( 'name', name, {validate:true} );
  //   setValue( 'email', email, {validate:true} );
  //   setValue( 'memtype', memtype, {validate: true} );
  // }

  const onSubmitForm = async (data) => {
    if (!data.name.trim()) {
      setError("name", { type: "focus" }, { shouldFocus: true });
    }
    if (!data.email.trim()) {
      setError("email", { type: "focus" }, { shouldFocus: true });
    }
    if (!data.memtype.trim()) {
      setError("memtype", { type: "focus" }, { shouldFocus: true });
    }

    const pskey = JSON.parse(localStorage.getItem("PSInfoKey"));
    const psjwt = pskey;

    const UPDATE_URL = `${WEB_BASE_URL}${API_UPDATE_USER}${userid}`;

    let config = {
      headers: {
        authorization: "Bearer " + psjwt,
      },
    };
    try {
      console.log(adoptedCats);
      const response = await axios.put(
        UPDATE_URL,
        {
          name: data.name,
          email: data.email,
          memtype: data.memtype,
          adoptedCats,
          psjwt: psjwt,
        },
        config
      );

      const { success } = response.data;
      const { _id, name, email, memtype } = response.data.data;
      updateInfo({
        userid: _id,
        name,
        email,
        memtype,
        adoptedCats: response.data.data.adoptedCats,
      });

      if (success === true) {
        alert(`Update success: ${name} with email ${email}`);
      }

      reset();

      const newmem = {
        userid: _id,
        name: name,
        email: email,
        memtype: memtype,
        adoptedCats: response.data.data.adoptedCats,
      };

      console.log("NEWMEM", newmem);

      localStorage.setItem("PSInfo", JSON.stringify(newmem));

      navigate("/");
    } catch (err) {
      console.log("User update failed >", err.message);
    }
  };

  const onDelete = async () => {
    const localcheck = JSON.parse(localStorage.getItem("PSInfoKey"));

    const psjwt = localcheck;

    let config = {
      headers: {
        authorization: "Bearer " + psjwt,
      },
    };

    const DELETE_URL = `${WEB_BASE_URL}${API_DELETE_USER}${userid}`;

    try {
      const response = await axios.delete(DELETE_URL, config);

      console.log("member deleted ");

      const { success } = response.data;
      const { name, email } = response.data.data;
      if (success === true) {
        alert(`Deleted: ${name} with email ${email}`);
      }

      reset();

      const initmem = {
        userid: null,
        name: null,
        email: null,
        memtype: null,
        adoptedCats: [],
      };

      localStorage.removeItem("PSInfo");
      localStorage.removeItem("PSInfoKey");

      updateInfo(initmem);

      navigate("/");
    } catch (err) {
      console.log("User delete failed >", err.message);
      alert(`Delete failed: ${err.message}. Please logout / login again.`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={name}
            {...register("name", { required: true })}
          />
          {errors.name ? (
            <span className="err"> name is required! </span>
          ) : null}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={email}
            {...register("email", { required: true })}
          />
          {errors.email ? (
            <span className="err"> email is required!</span>
          ) : null}

          <div className="member">
            <label htmlFor="memtype">Membership</label>
            <select
              name="memtype"
              id="memtype"
              defaultValue={memtype}
              {...register("memtype", { required: true })}
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div className="btngroup">
            <button type="submit" className="btn2">
              Update
            </button>
            <button
              type="button"
              onClick={() => {
                setModalIsOpen(true);
              }}
              className="btn2"
            >
              Delete{" "}
            </button>
          </div>
        </div>
      </form>

      <div className="productlist">
        <ul>{adoptionList}</ul>
      </div>

      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <h3>Member's Pet Store</h3>
        <br />
        <hr />
        <p>
          hi <span className="memname"> {name}</span>,{" "}
        </p>
        <p> are you sure you want to delete membership?</p>
        <div className="btngroup">
          <button
            className="btn2"
            onClick={() => {
              onDelete();
              setModalIsOpen(false);
            }}
          >
            Yes
          </button>
          <button className="btn2" onClick={() => setModalIsOpen(false)}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
