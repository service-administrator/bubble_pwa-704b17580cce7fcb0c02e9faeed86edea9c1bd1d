import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import NavBar from '../../Components/NavBar/NavBar';
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';


function FriendSuggestions({
  loggedIn,
  ws
}) {
  const navigator = useNavigate();
  const [friends, setSuggestedFriends] = useState(
    {
        class: [],
        grade: [],
        others: []
    }
  );

  const addFriend = async (username) => {
    const res = await fetch(`/bubble/api/member/addFriend`, {
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
        setSuggestedFriends(
          {
            "class": friends.class.map((u) => u.username == username ? {...u, isFriend: json.data.accept ? 2 : 1} : u),
            "grade": friends.grade.map((u) => u.username == username ? {...u, isFriend: json.data.accept ? 2 : 1} : u),
            "others": friends.others.map((u) => u.username == username ? {...u, isFriend: json.data.accept ? 2 : 1} : u)
          }
        );
    }else{
      alert(json.message);
    }
  }
  const delFriend = async (username) => {
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
      setSuggestedFriends(
        {
          "class": friends.class.map((u) => u.username == username ? {...u, isFriend: 0} : u),
          "grade": friends.grade.map((u) => u.username == username ? {...u, isFriend: 0} : u),
          "others": friends.others.map((u) => u.username == username ? {...u, isFriend: 0} : u)
        }
      );
    }else{
      alert(json.message);
    }
  };

  const loadFriends = async ()=> {
    
    const res = await fetch(`/bubble/api/member/suggestions`, {
        "method": "GET",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        }
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        console.log(json);
        setSuggestedFriends(json.data);
      }else{
        alert(json.message);
      }
  }

  useEffect(() => {
    loadFriends()
  }, [])
  
  const back= () => {
    navigator(-1);
  }

  return (
    <div className="ViewScreen">
      <div className="FriendSuggestions">
        <div className="container">
          <div className="header">
            
            <a onClick={back}><BackIcon/></a>
            <h1>친구 찾기</h1>
          </div>
          <div className="suggestions-container">
            <div className="category">
              <h2>같은 반</h2>
              {friends.class
                .map((friend) => (
                  <div key={friend.username} className="friend-suggestion-item">
                    <div className="friend-info" onClick={() => navigator(`/profile/${friend.username}`)}>
                      {friend.pfimg != "default" ? (
                        <img src={friend.profileImage} alt="Profile" className="friend-avatar" />
                      ) : (
                        <DefaultAvatar className="friend-avatar" />
                      )}
                  <div className="friend-details">
                      <span className="friend-name">{friend.name}</span>
                      <span className="friend-username">@{friend.username}</span>
                    </div> 
                    </div>
                    <button onClick={[() => addFriend(friend.username), () => {}, () => delFriend(friend.username)][friend.isFriend]}>{["추가", "대기중", "끊기"][friend.isFriend]}</button>
                  </div>
                ))}
            </div>
            <div className="category">
              <h2>같은 학년</h2>
              {friends.grade
                .map((friend) => (
                    <div key={friend.username} className="friend-suggestion-item">
                    <div className="friend-info" onClick={() => navigator(`/profile/${friend.username}`)}>
                      {friend.pfimg != "default" ? (
                        <img src={friend.profileImage} alt="Profile" className="friend-avatar" />
                      ) : (
                        <DefaultAvatar className="friend-avatar" />
                      )}
                   <div className="friend-details">
                      <span className="friend-name">{friend.name} <span className='friend-grade-class'>{friend.class}반</span></span>
                      <span className="friend-username">@{friend.username}</span>
                    </div>
                    </div>
                    <button onClick={[() => addFriend(friend.username), () => {}, () => delFriend(friend.username)][friend.isFriend]}>{["추가", "대기중", "끊기"][friend.isFriend]}</button>
                  </div>
                ))}
            </div>
            <div className="category">
              <h2>같은 학교</h2>
              {friends.others
                .map((friend) => (
                    <div key={friend.username} className="friend-suggestion-item">
                    <div className="friend-info" onClick={() => navigator(`/profile/${friend.username}`)}>
                      {friend.pfimg != "default" ? (
                        <img src={friend.profileImage} alt="Profile" className="friend-avatar" />
                      ) : (
                        <DefaultAvatar className="friend-avatar" />
                      )}
                      <div className="friend-details">
                        <span className="friend-name">{friend.name} <span className='friend-grade-class'>{friend.grade}학년 {friend.class}반</span></span>
                        <span className="friend-username">@{friend.username}</span>
                      </div>
                    </div>
                    <button onClick={[() => addFriend(friend.username), () => {}, () => delFriend(friend.username)][friend.isFriend]}>{["추가", "대기중", "끊기"][friend.isFriend]}</button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
}

export default FriendSuggestions;