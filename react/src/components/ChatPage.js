import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import TokenExpired from "./Auth"
import jwt_decode from "jwt-decode";
import { io } from "socket.io-client";

const Home = () => {
  const navigate = useNavigate()
  var socket = io('http://localhost:8000', { transports: ["websocket", "polling"] });

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [name, setName] = useState('');
  // const [pongRes, setPongRes] = useState('');
  const [messages, setMessages] = useState([]);



  useEffect(() => {

    if (sessionStorage.getItem('token')) {
      var { sub } = jwt_decode(sessionStorage.getItem('token'));
      setName(sub)

      socket.on('connect', () => {
        console.log('Connection STATUS', socket.connected);
        setIsConnected(socket.connected)
        socket.emit('constatus', `${sub}`);
      });

      socket.on('chatfrmServer', (data) => {
        console.log(data);
        setMessages((messages) => [...messages, data]);
      })

      socket.on('disconnect', () => {
        console.log('Disconnection STATUS', socket.connected);
        setIsConnected(socket.connected)
        socket.emit('disconstatus', `${name}`);
      });

    }

  }, []);


  // const sendPing = () => {
  //   socket.emit('ping', "RESPONSE FROM REACT");
  //   console.log('SEND RESPONSE TO SERVER');
  // }


  const sendMessage = (e) => {
    e.preventDefault()
    try {
      console.log(e.target.inptxt.value);
      const payload = e.target.inptxt.value
      payload.trim().toString()
      socket.emit('chats', `${name} says: ${payload}`);
    } catch (err) {
      console.log(err);
    }

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
          <h1>{name}</h1>
          <div>
            <p> WebSocket Connection is <b>{isConnected ? 'ONLINE' : 'OFFLINE'}</b></p>
            {/* <button onClick={sendPing}>Send ping</button>
            <p>{pongRes}</p> */}
          </div>


          <div style={{ marginTop: "25px" }}>
            <form onSubmit={sendMessage}>
              <input
                id="inptxt"
                name="inptxt"
                type="text"
              />
              <button type="submit">Send</button>
            </form>
            <br />
            <button
              onClick={() => {
                sessionStorage.removeItem('token');
                navigate(0)
              }}
              style={{ marginLeft: "25px" }}>Log out</button>

            <hr />
            {messages.reverse() && messages.map((val, i) => {
              return (
                <div key={i}>
                  <br />
                  <p>
                    <b>{val}</b>
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
