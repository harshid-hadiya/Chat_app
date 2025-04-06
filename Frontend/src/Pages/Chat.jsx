import React from "react";
import { useState } from "react";
import { getContext } from "../Context/Context";
import TItlebar from "../components/compo/TItlebar";
import "./chat.css";
import Left from "../components/compo/Left";
import Right from "../components/compo/Right";
import Drawer from "../components/Drawer/Drawer";

const Chat = () => {
  const { user } = getContext();
  const [isdrwaer, setisdrawer] = useState(false);

  return (
    <>
      <div className="chatwrappermain">
        <TItlebar
          handledrawer={() => {
            setisdrawer(true);
            console.log("enter");
          }}
        />
        <div className="containerofchat">
          <Left />
          <Right />
          <Drawer isdrwaer={isdrwaer} setisdrawer={setisdrawer} />
        </div>
      </div>
    </>
  );
};

export default Chat;
