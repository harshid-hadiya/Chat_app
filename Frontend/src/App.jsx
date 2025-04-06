import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import {useNavigate} from 'react-router-dom'

function App() {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [preview, setpreview] = useState("");
  const [upload, setUpload] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  let data1 = "";

 

  const handleSubmit = async () => {
    setLoader(true)
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    if (!name && !login) {
      alert("Please enter name");
      return;
    }
    const data = new FormData();

    // whenver you have to upload your data on the other database like cloudinary then below set has been called

    if (preview !== "") {
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dbkpefi7d");
      await fetch("https://api.cloudinary.com/v1_1/dbkpefi7d/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          setUpload(res.url.toString());
          data1 = res.url.toString();
          console.log(res.url.toString());
        });
    }
    if (login) {
        
        const response = await axios.post(
          "http://localhost:8900/api/user/login",
          {
            email,
            password,
          }
        ).then((response) => {
          
          toast.success("Login")
          console.log(response.data);
          let responses=response.data;
          responses=JSON.stringify(response.data);
          localStorage.setItem("userInfo",responses);
          navigate("/chat");
        }).catch((err) => {
          toast.warn(err.response.data.message)
          setLoader(false)
        });
      
    } else {
      try {
        
        const response = await axios.post(
          "http://localhost:8900/api/user/signup",
          {
            name,
            email,
            password,
            profilePic: data1,
          }
        );
        toast.success("You Registerd successfully")
        console.log(response.data);
        let responses=response.data;
        responses=JSON.stringify(response.data);
        localStorage.setItem("userInfo",responses);
        navigate("/chat");
      } catch (error) {
        setLoader(false)
        toast.warn(error.response.data.message);
        return ;
        
      }
    }
    setLoader(false);
    
  };

  return (
    <div className="loginpage">
      <div className="loginbox">
        <h2 className="loginheader">Live-Chat</h2>

        <div className="buttonofsignup">
          <button
            className={login ? "loginButton active" : "loginButton"}
            onClick={() => setLogin(true)}
          >
            Log In
          </button>
          <button
            className={!login ? "signupButton active" : "signupButton"}
            onClick={() => setLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="loginform">
          {login == true && (
            <>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          {login == false && (
            <>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className="uploadimg" htmlFor="file">
                <div>upload Profile Pic</div>
                <img className="urlimg" src={preview} alt="" />
              </label>
              <input
                className="file"
                type="file"
                name="file"
                id="file"
                onChange={(e) => {
                  const data = e.target.files[0];
                  setFile(data);
                  const url = URL.createObjectURL(data);
                  setpreview(url);
                }}
              />
            </>
          )}

          <button className={!loader ? "submitButton":"loaderbutton"} onClick={handleSubmit}>
            {!loader ? (
              <>{login ? "Log In" : "Sign Up"}</>
            ) : (
             
                <div className="loader"></div>
            
            )}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
