
// SignIn.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function SignIn({setLoginState}) {
  const [formData, setFormData] = useState({
    username: '',
    pw: ''
  });
  const [error, setError] = useState('');
  const navigator = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.pw.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return false;
    }
    return true;
  };
  
  
  const signin = async () => {
    if(!validateForm()){
      return;
    }
    const res = await fetch(`/bubble/api/auth/signin`, {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(formData)
      
      
    });
    let json = await res.json();
    console.log(json)
    if(json.success){
      localStorage.setItem("token", json.data.token);
      setLoginState(true);
      navigator("/profile");
      
    }else{
      alert(json.message);
    }
  }

  

  return (
    <div className="ViewScreen">
      <div className="SignIn">
        <div className="container">
          <h1>Bubble에 오신 것을 환영합니다!</h1>
            <input 
              type="text" 
              name="username" 
              placeholder="아이디" 
              value={formData.username} 
              onChange={handleChange} 
            />
            <input 
              type="password" 
              name="pw" 
              placeholder="비밀번호" 
              value={formData.pw} 
              onChange={handleChange} 
            />
            {error && <p className="error-message">{error}</p>}
            <div className="navigator">
              <button onClick={signin} type="submit">로그인</button>
            </div>
          <p className="signup-link">
            계정이 없으신가요? <span onClick={() => navigator('/signup')}>회원가입</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;