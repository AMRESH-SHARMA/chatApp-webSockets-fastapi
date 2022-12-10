import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        "email": email,
        "password": password
      }
      let resapi = await axios.post(`http://localhost:8000/api/r`, payload, {
      });
      console.log(resapi);
      if (resapi.data.SUCCESS) {
        localStorage.setItem('token', resapi.data.DATA)
        navigate('/login')
      }
    }
    catch (err) {
        console.warn(err);
        alert(err.response.data.MSG)
      }
    }

    return (<>
      <div style={{display:"flex", flexDirection:"column"}}>
        <h1 style={{margin:"25px"}}>Please Register</h1>
        <div>
          <input
            placeholder="email"
            type="text"
            onChange={(event) => setEmail(event.target.value)}
          required
          style={{margin:"25px"}}
        />
      </div>
      <div>
        <input
          placeholder="password"
          type="text"
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{margin:"25px"}}
        />
      </div>
      <button type="submit" onClick={handleRegister} style={{margin:"25px",width:"80px"}}>Sign Up</button>
      <button type="button" onClick={()=>navigate('/')} style={{margin:"25px",width:"80px"}}>Login</button>
    </div>
  </>
  );
};

export default Register;
