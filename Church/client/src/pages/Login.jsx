import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, getUserData } = useContext(AppContext);

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "sign up") {
        const { data } = await axios.post(
          backendUrl + "/api/auth/register",
          { name, email, password, address }
        );


        if (data.success) {
          await getUserData();  
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/auth/login",
          { email, password }
        );
        

        if (data.success) {
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <h1>{state === "sign up" ? "Create account" : "Login"}</h1>

      <form onSubmit={onSubmitHandler}>
        {state === "login" ? (
          <>
          <div className="login-div">

            <input className="logIn-email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
            <input className="logIn-password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
            <p onClick={()=>navigate('/reset-password')} >Forgot password</p>
          </div>
          </>
        ) : (
          <>
          <div className="signin-div">

            <input className="singIn-name" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
            <input className="singIn-email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
            <input className="singIn-password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
            <input className="singIn-address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" required />
          </div>
          </>
        )}

        <button className="Up-Button" type="submit">{state === "sign up" ? "Sign Up" : "Login"}</button>
      </form>

      {state === "sign up" ? (
        <p className="already" onClick={() => setState("login")}>Already have an account? Login</p>
      ) : (
        <p className="create" onClick={() => setState("sign up")}>Create new account</p>
      )}
    </div>
  );
};

export default Login;
