import "./user.css";
import React from "react";

const User = ({name="",email="",pic,onClick=undefined,onClick1}) => {
  console.log(name,"name");
  
  return (
    <div className="user user1" onClick={onClick || onClick1}>
      <div className="name name1">
        <img className="searchuserimg" src={pic || ""} alt="" />
        <span>{name}</span>
      </div>

      <div>
        <span className="guest">Email : </span>
        <span className="message">{email}</span>
      </div>
    </div>
  );
};

export default User;
