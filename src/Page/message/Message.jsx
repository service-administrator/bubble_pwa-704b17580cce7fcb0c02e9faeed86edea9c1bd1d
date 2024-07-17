
import React, { useEffect, useState, useRef, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';  // 스타일 시트 임포트
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import NavBar from '../../Components/NavBar/NavBar';
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import { formatTime, timeAgo } from '../../Utils/timeago';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';

function Chat({
  loggedIn,
  ws
}) {
    const params = useParams();
    const scrollRef = useRef();
    const username = params.id;

    const [isLoading, LoadingStateUpdater] = useState(false);
    
    const navigator = useNavigate();
    const newNoti = false;
  
    const [history, listupdater] = useState({
        user: {

        },
        messageList: []
    });
  
    const [loadState, updater] = useState({
      "last": new Date().getTime(),
      "cnt": 30
    });

    const [message, syncer] = useState("");
  
    const loadMessages = async () => {
      if(isLoading){
        return;
      }
      LoadingStateUpdater(true);
      const res = await fetch(`/bubble/api/message/history`, {
        "method": "POST",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({username, last: new Date().getTime(), ...loadState})
        
      });
      let json = await res.json();
      if(json.success){
        listupdater({user: json.data.user, messageList: Array.from([...history.messageList, ...json.data.messageList])});
        
        if(json.data.last){
          updater({...loadState, last: json.data.last});
        }
      }else{
        alert(json.message);
      }
      
      LoadingStateUpdater(false);
    }

    const addMsg = (msg) => {

      listupdater({user: history.user, messageList: Array.from([msg, ...history.messageList, ])});
    }
  
    useEffect(() => {
        loadMessages().then(scrollToBottom);
        ws.setScreen("message");
    }, []);

    useEffect(() => {
      
      if(!history.user){
        return;
      }
      ws.sethandler(function(json){
        if(json.method != "message"){
          return;
        }
        let data = json.data;
        if(data.user.username == username){
          addMsg(data.message);
        }
      });
    }, [history]);

    useEffect(() => {
        scrollToBottom();
    }, [history])

    const SendMessage = async () => {
        const res = await fetch(`/bubble/api/message/send`, {
            "method": "POST",
            "headers": {
              "Authorization": localStorage.getItem("token") || "",
              "Content-Type": "application/json"
            },
            "body": JSON.stringify(
                {
                    username: username,
                    content: message
                }
            )
            
          });
          let json = await res.json();
          if(json.success){
            listupdater({user: history.user, messageList: Array.from([json.data.message, ...history.messageList, ])});
            syncer("");
          }else{
            alert(json.message);
          }
    }

    const onSMsgChange = (e) => {
        const {id, value} = e.target;
        syncer(value);
    }

    
  const back = () => {
    navigator(-1);
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <div class="ViewScreen">
    <div class="Message">
        
    <div class="container">
        <div class="header">
            <a onClick={back}><BackIcon fontSize="small" /></a>
            <div class="profile-info">
            {
                    history.user.pfimg == "default" ?
                    <DefaultAvatar
                onClick={() => {navigator(`/profile/${history.user.username}`)}}
                className='avatar'
              /> :
              <img
              src={history.user.pfimg}
              alt="Profile"
              class="avatar"
              onClick={() => {navigator(`/profile/${history.user.username}`)}}
            />}
                <div class="details">
                    <p class="name">{history.user.name}</p>
                    <p class="username">@{history.user.username}</p>
                </div>
            </div>
        </div>
        <div class="chat-container" ref={scrollRef}>
          <button class="load-more" onClick={(loadMessages)}>이전 메세지 더보기</button>
            {
                history.messageList.map((msg, idx) => {
                    return <div class={`message ${msg.isMe ? "sent" : "received"}`} key={msg.sentAt} >
                        {msg.isMe ? "" : 
                    history.user.pfimg == "default" ?
                    <DefaultAvatar
                onClick={() => {navigator(`/profile/${history.user.username}`)}}
                className='avatar'
              /> :
              <img
              src={history.user.pfimg}
              alt="Profile"
              class="avatar"
              onClick={() => {navigator(`/profile/${history.user.username}`)}}
            />}
                    <div class="message-content">
                        <p class="text">{msg.content}</p>
                        <p class="time">{formatTime(msg.sentAt)}</p>
                    </div>
                </div>
                }).reverse()
            }
        </div>
            <div class="input-container">
            <input /*autoFocus ref={input => input && input.focus()}*/ type="text" id="message" placeholder="메시지를 입력해 주세요!" value={message} onChange={onSMsgChange}/>
            <button onClick={() => {SendMessage()}}>전송</button>
        </div>
        
        
    </div>
    <NavBar/>
    </div>
    </div>
  );
}

export default Chat;
