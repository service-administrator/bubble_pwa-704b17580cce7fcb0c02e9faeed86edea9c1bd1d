import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';  // 스타일 시트 임포트
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import NavBar from '../../Components/NavBar/NavBar';
import Modal from "../../Components/Modal/Modal";
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';

function ProfilePage({
  loggedIn,
  ws
}) {
  const params = useParams();
  let profile_username = ( params.id == 0 || params.id == undefined ) ? "me" : params.id;

  useEffect(() => {
    profile_username = ( params.id == 0 || params.id == undefined ) ? "me" : params.id;
    loadProfile();
  }, [params.id])

  const [modal, modalUpdate] = useState(
    {
      show: false,
      title: "",
      content: "",
      button: (close) => {}
    }
  )
  const showModal = (title, content, button) => {
    modalUpdate({
      show: true,
      title, content,
      button: button
    });
  }

  const closeModal = () => {
    modalUpdate({
      ...modal,
      show: false,
    });
  }
  
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friends, setFriends] = useState([]);
  
  const openFriendsModal = () => {
    setShowFriendsModal(true);
  };
  
  const closeFriendsModal = () => {
    setShowFriendsModal(false);
  };
  
  const delfriend = async (username) => {
    const res = await fetch(`/bubble/api/member/delFriend`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "username": username
      })
    });
    let json = await res.json();
    console.log(json)
    if(json.success){
        updateProfile({...profile, friendStatus: 1});
    }else{
      alert(json.message);
    }
  };

  const navigator = useNavigate();
  const token = localStorage.getItem("token");
  const [profile, updateProfile] = useState(
    {
      "name": "이름",
      "username": "username",
      "bio": "로딩중..",
      "grade": "1",
      "class": "1",
      "gender": "0",
      "friendCnt": "로딩중..",
      "friendStatus": 1,
      "favBubbles": [],
      "pfimg": "default"
    }
  );

  async function loadProfile(){
    const res = await fetch(`/bubble/api/member/profile`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "username": profile_username
      })
    });
    let json = await res.json();
    console.log(json)
    if(json.success){
      console.log(profile_username,json.data.username)
        updateProfile(json.data);
    }else{
      alert(json.message);
    }
  }

  
  useEffect( () => {
    loadProfile();
  }, []);

  const addFriend = async () => {
    const res = await fetch(`/bubble/api/member/addFriend`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "username": profile_username
      })
    });
    let json = await res.json();
    console.log(json)
    if(json.success){
        updateProfile({...profile, friendStatus: 2});
        showModal("친구 요청이 전송되었어요!", `${profile.name}님의 수락을 기다려주세요!`);
    }else{
      alert(json.message);
    }
  }

  useEffect(() => {
    if(!showFriendsModal){
      return;
    }
    loadFriends();
  }, [showFriendsModal]);

  const loadFriends = async () => {
    const res = await fetch(`/bubble/api/member/friends`, {
      "method": "GET",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      }
    });
    let json = await res.json();
    console.log(json)
    if (json.success) {
      setFriends(json.data.friendList);
    } else {
      alert(json.message);
    }
  }

  return (
    <div class="ViewScreen">
    <div class="ProfilePage">
      <div class="container">
        <div class="header">
          
            { profile_username != "me" ? <a onClick={() => navigator(-1)}><BackIcon/></a> : null}
            <h1>@{profile.username}</h1>
            
        {profile_username == "me" && <SettingsIcon onClick={() => navigator("/profile_edit")} fontSize='large'/>}
        </div>
        <div class="profile-info">
            <div class="logo-container">
                {
                    profile.pfimg == "default" ?
                    <DefaultAvatar
                className="logo"
              /> :
              <img
              src={profile.pfimg}
              alt="Profile"
              class="logo"
            />}
                <div class="status-message">{profile.bio}</div>
            </div>
            <div class="profile-details">
                <p>{profile.name} {profile.gender==0?<MaleIcon/>:<FemaleIcon/>}</p>
                <p>{profile.grade}-{profile.class}반</p>
                <p class="friends">친구 수 <span class="count" onClick={profile.isMe ? openFriendsModal : () => {}}>{profile.friendCnt}</span></p>
            </div>
        </div>
        {!profile.isMe && (
            <div className="friend-actions">
              <button
                className={`add-friend-bar ${
                  profile.friendStatus === 2 ? "pending" : profile.friendStatus === 3 ? "unfriend" : ""
                }`}
                onClick={profile.friendStatus === 1 ? addFriend : profile.friendStatus === 3 ? () => delfriend(profile.username) : () => {}}
                disabled={profile.friendStatus === 2}
              >
                {["본인", "친구 추가하기!", "수락 대기중..", "친구 끊기"][profile.friendStatus]}
              </button>
              {profile.friendStatus === 3 && (
                <button className="message-button" onClick={() => navigator(`/message/${profile.username}`)}>
                  대화하기
                </button>
              )}
            </div>
          )}

<div className="section-separator">{profile.name}님의 최애 Bubbles!</div>
{profile.favBubbles.length > 0 ? (
  profile.favBubbles.map(bubble => (
    <div key={bubble.id} className="questions">{bubble.ask}</div>
  ))
) : (
  <div className="no-fav-bubbles">아직 최애 Bubble이 없어요!</div>
)}
        {showFriendsModal && (
  <div className="friends-modal">
    <div className="modal-content">
      <div className="modal-header">
        <h2>친구 목록</h2>
        <button onClick={closeFriendsModal}>닫기</button>
      </div>
      <div className="modal-body">
        {friends.map(friend => (
          <div key={friend.id} className="friend-item">
            <div className="friend-info">
            {
                    friend.pfimg == "default" ?
                    <DefaultAvatar
                onClick={() => {navigator(`/profile/${friend.username}`);}}
                style={{ marginRight: '10px' }}
              /> :
              <img
              src={friend.pfimg}
              alt="Profile"
              class="friend-avatar"
              onClick={() => {navigator(`/profile/${friend.username}`);}}
            />}
              <div className="friend-details">
                <span className="friend-name">{friend.name}</span>
                <span className="friend-username">@{friend.username}</span>
              </div>
            </div>
            <button onClick={() => delfriend(friend.username)}>친구 끊기</button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{modal.show && <Modal title={modal.title} body={modal.content} onClose={closeModal} customFooter={modal.button}/>}
        
    </div>
    <NavBar/>

    </div>
    </div>
  );
}

export default ProfilePage;
