import React, { useState } from 'react';
import './style.css';  // 스타일 시트 임포트
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const navigator = useNavigate();
  
    const [auth, updater] = useState({
      "username": "",
      "pw": ""
    });
  
    const signin = async () => {
      const res = await fetch(`/bubble/api/auth/signin`, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(auth)
        
        
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        localStorage.setItem("token", json.data.token);
        navigator("/profile");
      }else{
        alert(json.message);
      }
    }
  
    const signup = () => navigator("/signup")
  
    const onInputChange = (e) => {
      const {id, value} = e.target;
      updater((p) => ({...p, [id]:value}));
    }
  return (
    <div class="signin">
      
    <div class="container">
        <div class="logo">로고</div>
        <div class="tagline">우리 학교 친구들을 Bubble에서 만나보세요</div>
        <div class="input-group">
            <input id="username" class="id" type="text" placeholder="아이디 입력" value={auth.username} onChange={onInputChange}></input>
        </div>
        <div class="input-group">
            <input id="pw" class="pw" type="password" placeholder="비밀번호 입력" value={auth.pw} onChange={onInputChange}></input>
        </div>
        <button class="btn" onClick={signin}>로그인</button>
        <div class="link-group">
            <a href="#">분실</a>
            <a href="/signup">가입</a>
        </div>
    </div>
    </div>
  );
}

export default SignIn;
