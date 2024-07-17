// Notification.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import NavBar from '../../Components/NavBar/NavBar';
import { timeAgo } from '../../Utils/timeago';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';

import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';

const resources = {
  "message": {
    "title": "새로운 메세지",
    "desc": "$USER$님에게서 새로운 메세지가 왔어요!"
  },
  "new_bubble": {
    "desc": "새로운 Bubble이 도착했어요!",
  },
  "bubble_reveal_accept": {
    "title": "누군가가 모습을 드러냈어요!",
    "desc": "Bubble의 수신자는 $USER$님이었어요!"
  },
  "bubble_reveal_req": {
    "title": "Bubble 수신자 공개 요청",
    "desc": "$USER$님이 모습을 드러내길 바라고 있어요!"
  },
  "bubble_addfav": {
    "desc": "$USER$님이 내가 보낸 Bubble를 최애로 등록했어요!"
  },
  "feed_reply": {
    "title": "새로운 댓글",
    "desc": "$USER$님이 내 글에 댓글을 작성했어요!"
  },
  "reply_like": {
    "title": "댓글 좋아요",
    "desc": "$USER$님이 내 댓글을 좋아해요!"
  },
  "feed_like": {
    "title": "게시물 좋아요",
    "desc": "$USER$님이 내 글을 좋아해요!"
  },
  "friend_req": {
    "title": "새로운 친구 요청",
    "desc": "$USER$님의 친구 요청이 도착했어요!"
  },
  "friend_accept": {
    "title": "친구 요청 수락",
    "desc": "$USER$님과 친구가 되었어요!"
  },
  "default": {
    "title": "알림",
    "desc": "$CONTENT$"
  }
}

function Notification({
  loggedIn,
  ws
}) {
    const navigator = useNavigate();

  const acceptRequest = (id) => {
    let noti = notilist.find((noti) => noti.id == id);
    if(!noti){ return; }
    if(noti.type == "friend_req"){
      addFriend(noti.user.username, noti.id);
    }else if(noti.type == "bubble_reveal_req"){
      acceptBubble(noti.link, noti.id)
    }
  };

  const acceptBubble = async (link, id) => {
    const res = await fetch(`/bubble/api/bubble/reveal`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "id": link.replace("/bubble_info/", ""),
        "noti_id": id
      })
    });
    let json = await res.json();
    console.log(json)
    if(json.success){
        //updateProfile({...profile, friendStatus: 2});
        alert(json.message)
    }else{
      alert(json.message);
    }
  }

  const addFriend = async (username, id) => {
    const res = await fetch(`/bubble/api/member/addFriend`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "username": username,
        "noti_id": id
      })
    });
    let json = await res.json();
    console.log(json)
    if(json.success){
        //updateProfile({...profile, friendStatus: 2});
        alert(json.message)
    }else{
      alert(json.message);
    }
  }

  const back= () => {
    navigator(-1);
  }

  const [notilist, listupdater] = useState([]);
  
  const [loadState, updater] = useState({
    "last": new Date().getTime(),
    "cnt": 99999999
  });

  const loadNotification = async () => {
    const res = await fetch(`/bubble/api/notification/load`, {
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
      listupdater(json.data.notiList);
      updater({...loadState, last: json.data.last});
    }else{
      alert(json.message);
    }
  }

  useEffect(() => {
    loadNotification();
    ws.newNoti = false;
  }, [])

  return (
    <div class="ViewScreen">
    <div class="Notification">
      <div class="container">
        <div class="header">
        <a onClick={back}><BackIcon/></a>
        <h1>알림</h1>
        </div>
        <div class="notification-list">
          {notilist.map((noti) => (
            <div key={noti.createdAt} class="notification-item">
              {noti.user.need ? (
            noti.user.pfimg === 'default' ? (
              <DefaultAvatar
                onClick={() => {navigator(`/profile/${noti.user.username}`)}}
                style={{ marginRight: '10px' }}
              />
            ) : (
              <img
                src={noti.user.pfimg}
                alt="Profile"
                class="notification-avatar"
                onClick={() => {navigator(`/profile/${noti.user.username}`)}}
              />
            )
          ) : null}
              <div class="notification-content" >
                <div class="notification-header">
                {resources[noti.type].title ? <div class="notification-text" onClick={noti.link.length > 0 ? () => navigator(noti.link) : () => {}}>
                <span class="notification-title">{resources[noti.type].title.replace("$USER$", noti.user.name)}</span>
                <span class="notification-desc">{resources[noti.type].desc.replace("$USER$", noti.user.name)}</span>
              </div>: (<span class="notification-text" onClick={noti.link.length > 0 ? () => navigator(noti.link) : () => {}}>{resources[noti.type].desc.replace("$USER$", noti.user.name)}</span>)}
              
                  {(noti.type.endsWith("_req")) && (
                    <div class="notification-actions">
                      <button onClick={() => acceptRequest(noti.id)}>수락</button>
                    </div>
                  )}
                </div>
              </div>
              <div class="notification-time">{timeAgo(noti.createdAt)}</div>
            </div>
          ))}
        </div>
      </div>
      <NavBar />
    </div>
    </div>
  );
}

export default Notification;