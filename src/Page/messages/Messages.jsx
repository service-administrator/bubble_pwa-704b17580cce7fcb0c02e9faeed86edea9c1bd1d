
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';  // 스타일 시트 임포트
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import NavBar from '../../Components/NavBar/NavBar';
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import NotiIcon_Off from '@mui/icons-material/NotificationsNone';
import NotiIcon_On from '@mui/icons-material/Notifications';
import { formatTime, timeAgo } from '../../Utils/timeago';

function Inbox({
  loggedIn,
  ws
}) {
    const navigator = useNavigate();
    const newNoti = false;
  
    const [messagelist, listupdater] = useState([]);
  
    const [loadState, updater] = useState({
      "last": new Date().toISOString(),
      "cnt": 10
    });
  
    const loadMessages = async () => {
      const res = await fetch(`/bubble/api/message/inbox`, {
        "method": "POST",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(loadState)
        
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        listupdater(json.data.inboxList);
      }else{
        alert(json.message);
      }
    }
  
    useEffect(() => {
        loadMessages();
        ws.setScreen("inbox");
    }, []);

    useEffect(() => {
      ws.sethandler(syncList);
    }, messagelist);

    const syncList = (json) => {
      if(json.method != "message"){
        return;
      }
      let data = json.data;
      listupdater([{lastMsg: data.message.content,sentAt: data.message.sentAt, user: data.user}, ...messagelist.filter((msg) => msg.user.username != data.user.username  )]);
    }

    const message = (username) => {
      navigator(`/message/${username}`);
    }
  return (
    <div class="ViewScreen">
    <div class="Messages">
        
    <div class="container">
        <div class="header">
            <h1>메세지</h1>
            {newNoti?<NotiIcon_On fontSize='large'/>:<NotiIcon_Off fontSize='large'/>}
        </div>
        <div class="messages-container">
            {
                messagelist.length > 0 ? messagelist.map((msg) => {
                    return <div class="message" onClick={() => { message(msg.user.username) }}>
                    {
                    msg.user.pfimg == "default" ?
                    <DefaultAvatar
                onClick={() => {navigator(`/profile/${msg.user.username}`)}}
                className='avatar'
              /> :
              <img
              src={msg.user.pfimg}
              alt="Profile"
              class="avatar"
              onClick={() => {navigator(`/profile/${msg.user.username}`)}}
            />}
                    <div class="message-info">
                        <p class="name">{msg.user.name} <span class="username">@{msg.user.username}</span></p>
                        <p class="text">{msg.lastMsg}</p>
                    </div>
                    <div class="time">{formatTime(msg.sentAt)}</div>
                </div>
                })
                : <p class="nomsg">아직 받은 메세지가 없어요!</p>
            }
        </div>
    </div>
    <NavBar/>
    </div>
    </div>
  );
}

export default Inbox;
