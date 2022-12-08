import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TokenExpired from "./Auth"
import jwt_decode from "jwt-decode";

const Home = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('default');
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);


  var ws = new WebSocket(`ws://localhost:8000/ws/${name}`);
  useEffect(() => {
    try {
      if (sessionStorage.getItem('token')) {
        const { sub } = jwt_decode(sessionStorage.getItem('token'));
        setName(sub)
        ws = new WebSocket(`ws://localhost:8000/ws/${sub}`);
        ws.onopen = () => {
          setWsConnected(true)
        };

        ws.onmessage = (message) => {
          console.log(message);
          setMessages((messages) => [...messages, message]);
        }

      }

    } catch (err) {
      setWsConnected(false)
    }
  }, []);

  const isOpen = (ws) => { return ws.readyState === ws.OPEN }

  const sendMessage = (e) => {
    e.preventDefault()

    try {
      if (!isOpen(ws)) {
        alert('wait and retry')
        return;
      }
      console.log(msg);
      msg.trim().toString()
      ws.send(msg);
      console.log('cv', messages)
      // ws.onerror = (error) => {
      //   console.warn(error);
      // };
    } catch (err) {
      console.log(err);
    }
  }


  if (!sessionStorage.getItem('token')) {
    return (
      <>
        <h1>Please login before access this page</h1>
        <button type="submit" onClick={() => navigate('/')} style={{ margin: "25px", width: "80px" }}>Login Page</button>
      </>
    )
  }
  // if (TokenExpired(sessionStorage.getItem('token'))) {
  //   return (
  //     <>
  //       <h1>Token Expired. Please login again before access this page</h1>
  //       <button type="submit" onClick={() => navigate('/')} style={{ margin: "25px", width: "80px" }}>Login Page</button>
  //     </>
  //   )
  // }
  return (<>

    {
      !sessionStorage.getItem('token') ?
        <>
          <h1>Please login before access this page</h1>
          <button type="submit" onClick={() => navigate('/')} style={{ margin: "25px", width: "80px" }}>Login Page</button>
        </>
        :
        <div>
          <h1>Welcome {name}</h1>
          <p> WebSocket Connection is <b>{wsConnected ? 'ONLINE' : 'OFFLINE'}</b></p>
          <div style={{ marginTop: "25px" }}>
            <form>
              <input
                type="text"
                onChange={(e) => setMsg(e.target.value)} />
              <button onClick={(e) => sendMessage(e)}>Send</button>

              <button
                onClick={() => {
                  sessionStorage.removeItem('token');
                  navigate(0)
                }}
                style={{ marginLeft: "25px" }}>Log out</button>
            </form>
            <hr />
            {messages.reverse() && messages.map((val, i) => {
              return (
                <div key={i}>
                  <br />
                  <p>
                    <b>{val.data}</b>
                  </p>
                </div>
              );
            })}

          </div>
        </div>
    }

  </>
  );
};

export default Home;
