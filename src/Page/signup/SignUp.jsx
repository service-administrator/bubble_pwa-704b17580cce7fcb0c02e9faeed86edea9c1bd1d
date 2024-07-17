// SignUp.jsx

import React, { useState, useEffect } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

const stepTitles = [
    "이름을 실명으로 입력해 주세요!",
    "학년과 반을 선택해주세요!",
    "아이디를 입력해주세요!",
    "비밀번호를 입력해주세요!",
    "전화번호를 인증해주세요!"
  ];

  const initialFormData = {
    name: '',
    gender: 0,
    grade: 1,
    classNum: 1,
    username: '',
    password: '',
    phone: '',
    verificationCode: ''
  };
  
  function SignUp({setLoginState}) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');
    const [codeSent, setVerifyStatus] = useState(false);
    const navigator = useNavigate();
  
    const totalSteps = 5;
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };
  
    useEffect(() => {
        validateStep(true)
    }, [formData]);
  
    const validateStep = (live = false) => {
        setError('');
        switch(step) {
          case 0:
            if (!live && !formData.name.trim()) {
              setError('이름을 입력해주세요.');
              return false;
            }
            break;
          case 1:
            // 학년과 반은 기본값이 있으므로 검사 불필요
            break;
          case 2:
            if (!live && !formData.username.trim()) {
              setError('아이디를 입력해주세요.');
              return false;
            }else if(!/^[A-Za-z0-9]{4,12}$/.test(formData.username)){
              setError('아이디는 4~12자의 영어 대소문자, 숫자로만 이루어져야 합니다.');
              return false;
            }
            break;
          case 3:
            if (!live && !formData.password.trim()) {
              setError('비밀번호를 입력해주세요.');
              return false;
            }else if(!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,10}$/.test(formData.password)){
                setError('비밀번호는 6~10자의 영어 대소문자, 숫자로만 이루어져야 합니다');
                return false;
              }
            break;
          case 4:
            if (codeSent && (!live && !formData.phone.trim() || !live && !formData.verificationCode.trim())) {
              setError('전화번호와 인증번호를 모두 입력해주세요.');
              return false;
            }else if(!/^010\d{8}$/.test(formData.phone)){
                setError('전화번호는 010XXXXXXXX형식이어야 해요!');
                return false;
            }else if(codeSent && !/^\d{6}$/.test(formData.verificationCode)){
                setError('인증번호는 6자리 숫자에요!');
                return false;
            }
            break;
          default:
            break;
        }
        return true;
      };
  
    const handleNext = () => {
      if (validateStep() && !error) {
        setStep(step + 1);
      }
    };
    const handlePrev = () => {
        setError('')
        setStep(step-1)
    };

    const sendCode = async () => {
        if(step == 4 && !error){
          const res = await fetch(`/bubble/api/auth/code`, {
            "method": "POST",
            "headers": {
              "Content-Type": "application/json"
            },
            "body": JSON.stringify(
              {
                phone: formData.phone
              }
            )
            
            
          });
          let json = await res.json();
          console.log(json)
          if(json.success){
            setVerifyStatus(true);
            
          }else{
            alert(json.message);
          }
        }
    }

  const handleSignUp = async () => {
    if(step == 4 && !error){
      const res = await fetch(`/bubble/api/auth/signup`, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(
          {
            username: formData.username,
            name: formData.name,
            pw: formData.password,
            gender: formData.gender,
            grade: formData.grade,
            class: formData.classNum,
            phone: formData.phone,
            code: formData.verificationCode
          }
        )
        
        
      });
      let json = await res.json();
      console.log(json)
      if(json.success){
        localStorage.setItem("token", json.data.token);
        setLoginState(true);
      }else{
        alert(json.message);
      }
      
    }
  };
  return (
    <div className="ViewScreen">
      <div className="SignUp">
        <div className="container">
          <h1>Bubble에서 학교 친구들을 만나보세요!</h1>
          <div className="step-info">
            <p className="step-title">{stepTitles[step]}</p>
            <p className="step-progress">{["시작해 볼까요!", "허위 기재 시 이용이 제한돼요!", "로그인, 프로필 창에 표시돼요!", "거의 다 왔어요!", "마지막 단계에요!"][step]} {step + 1}/{totalSteps}</p>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-container" style={{ transform: `translateX(-${(100 / totalSteps) * step}%)` }}>
            <div className="form-step">
              <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} />
              <div className="gender-radio">
                <input
                  id="male"
                  type="radio"
                  name="gender"
                  value={0}
                  checked={formData.gender === '0'}
                  onChange={handleChange}
                />
                <label htmlFor="male">남자</label>
                <input
                  id="female"
                  type="radio"
                  name="gender"
                  value={1}
                  checked={formData.gender === '1'}
                  onChange={handleChange}
                />
                <label htmlFor="female">여자</label>
              </div>
            </div>
            <div className="form-step">
              <select name="grade" value={formData.grade} onChange={handleChange}>
                <option value={1}>1학년</option>
                <option value={2}>2학년</option>
                <option value={3}>3학년</option>
              </select>
              <select name="classNum" value={formData.classNum} onChange={handleChange}>
                {
                  new Array(11).fill(1).map((_, i) => (
                    <option key={(i+1).toString()} value={(i+1)}>{(i+1).toString()}반</option>
                  ))
                }
              </select>
            </div>
            <div className="form-step">
              <input type="text" name="username" placeholder="아이디" value={formData.username} onChange={handleChange} />
            </div>
            <div className="form-step">
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-step">
              <div className="phone-verification">
                <input type="text" name="phone" placeholder="전화번호 (숫자만!)" value={formData.phone} onChange={handleChange} />
                <button onClick={sendCode}>인증번호 전송</button>
              </div>
              <input
                type="text"
                name="verificationCode"
                placeholder="인증번호"
                value={formData.verificationCode}
                onChange={handleChange}
                disabled={!codeSent}
              />
            </div>
          </div>
          {step < totalSteps - 1 && (
            <div className="navigator">
              {
                step > 0 ?
                <button onClick={handlePrev}>
                  이전
                </button>
                : <button onClick={() => navigator(-1)}>
                  로그인으로 돌아가기
                </button>
              }
              <button onClick={handleNext}>
                다음
              </button>
            </div>
          )}
          {step === totalSteps - 1 && (
            <div className="navigator">
              <button onClick={handlePrev}>
                이전
              </button>
              <button onClick={handleSignUp}>
                가입하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;