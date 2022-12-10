import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';


const Login = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const responseGoogle = async (response) => {
    console.log(response);
    if (response.credential) {
      try {
        let resapi = await axios.post(`http://localhost:8000/api/auth/`, { token: response.credential }, {
          credentials: true,
        });
        console.log(resapi);
        if (resapi.data.SUCCESS) {
          sessionStorage.setItem('token', resapi.data.DATA)
          navigate('/home')
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        "email": email,
        "password": password
      }
      let resapi = await axios.post(`http://localhost:8000/api/l`, payload, {
      });
      console.log(resapi);
      if (resapi.data.SUCCESS) {
        sessionStorage.setItem('token', resapi.data.DATA)
        navigate('/home')
      }
    }
    catch (err) {
      console.warn(err);
      alert(err.response.data.MSG)
    }
  }

  return (<>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ margin: "25px" }}>Please Login</h1>

      <div>
        <input
          placeholder="email"
          type="text"
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{ margin: "25px" }}
        />
      </div>
      <div>
        <input
          placeholder="password"
          type="text"
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{ margin: "25px" }}
        />
      </div>
      <button type="submit" onClick={handleLogin} style={{ margin: "25px", width: "80px" }}>Sign In</button>
      <button type="submit" onClick={()=>navigate('/register')} style={{ margin: "25px", width: "80px" }}>Register</button>
    </div>
    <hr />
    <div style={{ margin: "25px" }}>


      <div style={{ width: '15rem' }}>
        <GoogleOAuthProvider
          clientId="914599604729-2b4cnghp7bqijv6lb35eqj4pg8lu46s0.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => { alert('Login Failed') }}
          />
        </GoogleOAuthProvider>
      </div>


    </div>


  </>
  );
};

export default Login;
