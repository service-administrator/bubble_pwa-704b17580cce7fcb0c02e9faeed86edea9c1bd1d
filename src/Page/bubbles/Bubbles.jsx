import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';  // 스타일 시트 임포트
import AddIcon from '@mui/icons-material/ControlPoint';
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import NavBar from '../../Components/NavBar/NavBar';
import { timeAgo } from '../../Utils/timeago';

function Bubbles({
  loggedIn,
  ws
}) {
    const navigator = useNavigate();
    const newNoti = false;
  
    const [bubblelist, bubbleupdater] = useState([]);
  
    const [loadState, updater] = useState({
      "last": "",
      "cnt": 20
    });
  
    const loadbubble = async () => {
      const res = await fetch(`/bubble/api/bubble/my`, {
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
        
        bubbleupdater(Array.from([...bubblelist,...json.data.bubbleList, ]));
        if(json.data.last){
          updater({...loadState, last: json.data.last});
        }
        //bubbleupdater(json.data.bubbleList);
      }else{
        alert(json.message);
      }
    }
  
    useEffect(() => {
      loadbubble();
    }, [])
  return (
    <div class="ViewScreen">
    <div class="Bubbles">
        
    <div class="container">
        <div class="header">
            <h1>Bubble!</h1>
        </div>
        
        {/*
        <div class="sort-options-container">
            <a href="#" class="sort-options">최신순/오래된순</a>
            <a href="#" class="question-settings">질문 설정</a>
        </div>
        
        */}
        <div class="question-container">
            {
              bubblelist.length > 0 ? 
              [...bubblelist.map((bubble) => {
                return <div class="question">
                <div class="profile">
                {
                    bubble.sender.pfimg == "default" ?
                    <DefaultAvatar
                onClick={bubble.sender.anon ? () => {} : () => {navigator(`/profile/${bubble.sender.username}`)}}
                style={{ marginRight: '10px' }}
              /> :
              <img
              src={bubble.sender.pfimg}
              alt="Profile"
              class="avatar"
              onClick={() => {navigator(`/profile/${bubble.sender.username}`)}}
            />}
                    <div class="details">
                        <p>{bubble.sender.anon?"익명":bubble.sender.name}</p>
                        <p>{bubble.sender.grade}학년 {["남","여"][bubble.sender.gender]}학생</p>
                    </div>
                </div>
                <div class="content" onClick={() => navigator(`/bubble_info/${bubble.id}`)}>
                    {bubble.ask}
                </div>
                <div class="meta">
                    <span class="time">{timeAgo(bubble.sentAt)}</span>
                </div>
            </div>
                
              }), 
              <button class="load-more" onClick={loadbubble}>이전 Bubble 더보기</button>]:
              <p class="nobubble">아직 받은 Bubble이 없어요!</p>
            }
        </div>
        <a onClick={() => navigator("/bubble_new")} class="create-post-button"><AddIcon/></a>
    </div>
    <NavBar/>
    </div>
    </div>
  );
}

export default Bubbles;

/**
 * 
            <div class="question">
                <div class="profile">
                    <div class="avatar">프</div>
                    <div class="details">
                        <p>창조주</p>
                        <p>3학년 여학생</p>
                    </div>
                </div>
                <div class="content">
                    조선 후기의 양반을 풍자하고 당시의 물질만능주의를 표현할것같은 사람은?
                </div>
                <div class="meta">
                    <span class="time">2024-05-19T16:17:34.681Z</span>
                </div>
            </div>
 */