import "./drawer.css";
import React from "react";
import User from "./User";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getContext } from "../../Context/Context";

const Drawer = ({ isdrwaer, setisdrawer }) => {
  const [emailname, setemailname] = useState("");
  const [users, setUsers] = useState([]);
  const { changeAdd, setchangeAdd } = getContext();
  useEffect(() => {
    handleGetuser();
  }, [emailname]);
  //  this is for the fetching the user from the server
  async function handleGetuser() {
    if (emailname == "") {
      return;
    }

    const data = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: `Bearer ${data.jsonToken}`,
      },
    };
    try {
      const response = await axios.get(
        `http://localhost:8900/api/user/searc?search=${emailname}`,
        config
      );
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  // this handler for the add user from the server
  async function handleradd(id) {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: `Bearer ${data.jsonToken}`,
      },
    };
    try {
      const response = await axios.post(
        `http://localhost:8900/api/chat/`,
        { userId: id },
        config
      );
      console.log(response.data);
      setchangeAdd(!changeAdd);
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className={`drawercontainer ${isdrwaer ? "opendrawer" : ""}`}>
      <div className="drawerheader">
        <span>Search User </span>
        <span className="closedrawer" onClick={() => setisdrawer(false)}>
          {" "}
          <img src="/assets/close.svg" alt="not" />{" "}
        </span>
      </div>
      <div className="drawerSearch">
        <input
          type="text"
          placeholder="search by name or email"
          value={emailname}
          onChange={(e) => setemailname(e.target.value)}
        />
      </div>
      <div className="wraperofsearchinguser">
        {users.length > 0 &&
          users.map((user) => (
            <User
              key={user._id}
              name={user.name}
              email={user.email}
              pic={user.profilePic}
              onClick={() => handleradd(user._id)}
            />
          ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Drawer;
