import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';  // 스타일 시트 임포트
import NavBar from '../../Components/NavBar/NavBar';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import Modal from "../../Components/Modal/Modal"

function Bubble_New({
  loggedIn,
  ws
}) {

    const navigator = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [modal, modalUpdate] = useState(
      {
        show: false,
        title: "",
        content: "",
        button: (close) => {}
      }
    )
    const [clicked, click] = useState(new Array(4).fill(false));

    const [manager, notifier] = useState({
      "setId": "new",
      "index": 1,
    });

    const [bubble, update] = useState({
      ask: "로딩중",
      others: []
    });

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
  
    const fetchNewBubble = async (skip = false) => {
      setIsLoading(true);
      const res = await fetch(`/bubble/api/bubble/new`, {
        "method": "POST",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            "setId": manager.setId,
            "skip": skip,
          }
        )
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        setIsLoading(false);
        return json.data
      }else if(json.data.cooltime){
        let unlock = new Date(json.data.end);
        showModal("다음 Bubble까지 기다려 주세요!", `${unlock.getHours()}시 ${unlock.getMinutes()}분 ${unlock.getSeconds()}초부터 가능해요!`, (close) => {
          return <div>
          <button className="custom-button" onClick={() => {navigator(-1);}}>뒤로가기</button>
        </div>
        });
        setIsLoading(false);
        return false;
      }else{
        alert(json.message);
        setIsLoading(false);
      }
    }
  
    useEffect(() => {
      loadNewBubble();
    }, []);

    const updateClicked = (idx) => {
      let newclick = new Array(4).fill(false);
      if(idx!=-1){
        newclick[idx] = true;
      }
      click(newclick);
      console.log(clicked)
    }

    const select = async (username, idx) => {
      if(isLoading){
        return;
      }
      setIsLoading(true);
      updateClicked(idx);
      const res = await fetch(`/bubble/api/bubble/answer`, {
        "method": "POST",
        "headers": {
          "Authorization": localStorage.getItem("token") || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username})
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        await loadNewBubble();
      }else{
        alert(json.message);
      }
      setIsLoading(false);
    };

    const loadNewBubble = async (force = false) => {
      if(isLoading){
        return;
      }
      let b = await fetchNewBubble(force);
      if(!b){
        return;
      }
      
      notifier({
        "setId": b.setId,
        "index": b.index
      })
      update(b);
      updateClicked(-1);
    }

    const skip = async () => {
      loadNewBubble(true);
    }

  return (
    <div class="ViewScreen">
    <div class="Bubble_New">
        
    <div class="container">
        <div class="header">
            <a class="back-button" onClick={() => navigator(-1)}><BackIcon/></a>
            <h1>10개 중 {manager.index}번째</h1>
        </div>
        <div class="question-content">
            {bubble.ask}
        </div>
        <div class="button-container">
            <a href="#" class="button">선택지 로딩</a>
            <a href="#" class="button" onClick={skip}>건너뛰기</a>
        </div>
        <div class="others-profile">
            {
              bubble.others.map((user, i) => {
                return <div class={`profile ${clicked[i] ? "clicked" : ""}`} onClick={() => select(user.username, i)}>
                {
                    user.pfimg == "default" ?
                    <DefaultAvatar
                className='avatar'
              /> :
              <img
              src={user.pfimg}
              alt="Profile"
              class="avatar"
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

export default Bubble_New;
