import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import Router from "./Router/router"
import socket from './Websocket/socket';

function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  
  window.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, false);

  useEffect(() => {
    setScreenSize();
    // resize 이벤트가 발생하면 다시 계산하도록 아래 코드 추가
    window.addEventListener('resize', setScreenSize);
    return () => window.removeEventListener('resize', setScreenSize);
  });

  
  const [validToken, setTokenValidation] = useState(false);
  const [websocket, setWS] = useState(null);
  const [loggedIn, setLoginState] = useState(false);

  const checkToken = async () => {
    let res = await fetch("/bubble/api/auth/checktoken", {
      "method": "GET",
      "headers": {
        "Authorization": localStorage.getItem("token") || ""
      }
    });
    let json = await res.json();
    console.log(`token is`,json.data.isValid);
    if(json.data.isValid){
      setLoginState(true);
      setTokenValidation(true);
    }else{
      setTokenValidation(false);
      setLoginState(false);
    }
  }

  useEffect(() => {
    checkToken();
  }, [validToken]);

  useEffect(() => {
    console.log('socket!!');
    
    setWS(socket.instance);
    if(loggedIn){
      socket.connect(loggedIn, setLoginState);
    }
    
  }, [loggedIn]);

  return (
      <div id="App">

        <Router loggedIn={loggedIn} ws={websocket} setLoginState={setLoginState}/>
      </div>
  );
}

export default App;
