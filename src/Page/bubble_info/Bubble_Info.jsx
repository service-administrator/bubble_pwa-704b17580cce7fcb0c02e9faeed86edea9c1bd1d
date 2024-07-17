import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';  // 스타일 시트 임포트
import NavBar from '../../Components/NavBar/NavBar';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import Modal from "../../Components/Modal/Modal";

function Bubble_Info({
  loggedIn,
  ws
}) {
    const params = useParams();
    const bubble_id = params.id;

    const navigator = useNavigate();

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
  
    const [bubble, update] = useState({
      sender: {
        anon: true,
        grade: 0,
        gender: 0
      },
      others: [],
      id: "1",
      "ask": "로딩중.."
    });
  
    const loadBubble = async () => {
      const res = await fetch(`/bubble/api/bubble/info`, {
        "method": "POST",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "id": bubble_id
        })
        
        
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        update(json.data);
      }else{
        alert(json.message);
      }
    }
  
    useEffect(() => {
      loadBubble();
    }, []);

    const addFav = async () => {
      const res = await fetch(`/bubble/api/bubble/addFav`, {
        "method": "POST",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "id": bubble_id
        })
        
        
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        showModal("최애 Bubble로 등록되었어요!", `이제 프로필에 이 Bubble이 표시돼요.`);
        update({...bubble, isFav: true})
      }else{
        alert(json.message);
      }
    }

    const delFav = async () => {
      const res = await fetch(`/bubble/api/bubble/delFav`, {
        "method": "POST",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "id": bubble_id
        })
        
        
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        update({...bubble, isFav: false})
      }else{
        alert(json.message);
      }
    }
    
    const reveal = async () => {
      const res = await fetch(`/bubble/api/bubble/request_reveal`, {
        "method": "POST",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "id": bubble_id
        })
        
        
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        showModal("익명 해제 요청을 보냈어요!", `요청 수락을 기다려 주세요 :D`);
      }else{
        alert(json.message);
      }
    }
  return (
    <div class="ViewScreen">
    <div class="Bubble_Info">
        
    <div class="container">
        <div class="header">
            <a onClick={() => navigator(-1)}><BackIcon/></a>
            <h1>{bubble.sender.anon?"익명의 친구":`@${bubble.sender.username}`}에게서 온 Bubble</h1>
        </div>
        <div class="question-from">
            {bubble.sender.grade}학년 {["남","야"][bubble.sender.gender]}학생이 보낸 Bubble
        </div>
        <div class="question-content">
            {bubble.ask}
        </div>
        <div class="button-container">
            <button class="button" onClick={bubble.sender.anon ? reveal : () => {navigator(`/profile/${bubble.sender.username}`)}}>{bubble.sender.anon ? "보낸 사람 확인하기!" : "보낸 사람 보러가기!"}</button>
            <button class={"button"+(bubble.isFav ? " delFav" : "")} onClick={bubble.isFav ? delFav : addFav}>{bubble.isFav ? "최애 질문 해제" : "최애 질문 등록"}</button>
        </div>
        <div class="others-profile">
            {
              bubble.others.map((user) => {
                return <div class={"profile "+ (user.me ? "clicked": "")} onClick={() => navigator(`/profile/${user.username}`)}>
                  {
                    user.pfimg == "default" ?
                    <DefaultAvatar
                onClick={() => {navigator(`/profile/${user.username}`)}}
                className='avatar'
              /> :
              <img
              src={user.pfimg}
              alt="Profile"
              class="avatar"
              onClick={() => {navigator(`/profile/${user.username}`)}}
            />}
                <p>{user.grade == 0 ? "" : `${user.grade}학년 `}{user.name}</p>
            </div>
              })
            }
        </div>
        
{modal.show && <Modal title={modal.title} body={modal.content} onClose={closeModal} customFooter={modal.button}/>}
    </div>
    <NavBar/>
    </div>
    </div>
  );
}

export default Bubble_Info;
