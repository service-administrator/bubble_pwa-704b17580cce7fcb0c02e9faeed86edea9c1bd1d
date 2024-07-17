// EditProfile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import NavBar from '../../Components/NavBar/NavBar';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import Modal from "../../Components/Modal/Modal"


const initProfile = {
  name: '',
  username: '',
  grade: '',
  class: '',
  gender: '',
  pfimg: "default",
}
function EditProfile({ setLoginState }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initProfile);

  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [profileOG, setOGProfile] = useState(initProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

  const uploadPFImg = async () => {
    const formData = new FormData();
    
    formData.append("files", profile.pfimg);

    console.log(Array.from(formData));

    let res = await fetch('/bubble/api/storage/upload', {
      "method": "POST",
      headers: {
        "Authorization": localStorage.getItem("token") || "",
      },
      "body": formData
    });

    let json = await res.json();
    console.log(json);
    if(json.success){
      console.log(json.data.files);
      return json.data.files[0]
    }else{
      return [];
    }

  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const fetchProfile = async () => {
    const res = await fetch(`/bubble/api/member/profile`, {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'me' }),
    });
    const json = await res.json();
    if (json.success) {
      setProfile(json.data);
      setOGProfile(json.data);
    } else {
      alert(json.message);
    }
  };

  const handleUsernameChange = (e) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      username: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    if(e.target.files[0]){
      setProfile((prevProfile) => ({
        ...prevProfile,
        pfimg: e.target.files[0],
      }));

    }
  };

  const handleSaveProfile = async () => {

    let pfimg;
    if(profileOG.pfimg != profile.pfimg){
      pfimg = await uploadPFImg();
    }
    const res = await fetch(`/bubble/api/member/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') || '',
      },
      body: JSON.stringify(
        {
          username: profileOG.username != profile.username ? profile.username : undefined,
          pfimg: pfimg
        }
      ),
    });
    const json = await res.json();
    if (json.success) {
      localStorage.setItem("token", json.data.token)
      navigate('/profile/me');
    } else {
      showModal("프로필 적용 실패!", json.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoginState(false);
    navigate('/');
  };

  const handleWithdrawal = async () => {
    const confirmed = window.confirm('정말로 탈퇴하시겠습니까?');
    if (confirmed) {
      const res = await fetch(`/bubble/api/member/withdrawal`, {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') || '',
          'Content-Type': 'application/json',
        },
      });
      const json = await res.json();
      if (json.success) {
        localStorage.removeItem('token');
        setLoginState(false);
        navigate('/');
      } else {
        
      }
    }
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setNewPassword('');
  };



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

  

  return (
    <div className="ViewScreen">
      <div className="EditProfile">
        <div className="container">
          <div className="header">
            <BackIcon onClick={() => navigate(-1)} />
            <h1>프로필 수정</h1>
          </div>
          <div className="profile-info">
            <div className="avatar-container">
              {profile.pfimg != "default" ? (
                <img src={profile.pfimg == profileOG.pfimg ? profile.pfimg : URL.createObjectURL(profile.pfimg)} alt="프로필 사진" className="avatar" />
              ) : (
                <DefaultAvatar className="avatar" />
              )}
              <label htmlFor="profile-image" className="change-image-label">
                변경
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="profile-details">
            <p>{profile.name} {profile.gender === 0 ? <MaleIcon /> : <FemaleIcon />}</p>
            <p>{profile.grade}-{profile.class}반</p>
          </div>
          <div className="info-item">
            <label>아이디:</label>
            <input type="text" value={profile.username} onChange={handleUsernameChange} />
          </div>
          {/*<button className="edit-button" onClick={openPasswordModal}>비밀번호 변경</button> */}
          <button className="save-button" onClick={handleSaveProfile}>
            저장
          </button>
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
          {
            /*
            <button className="withdrawal-button" onClick={handleWithdrawal}>
            계정 삭제
          </button>
            */
          }
        </div>
      </div>
      <NavBar />

      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>비밀번호 수정</h2>
              <button className="close-button" onClick={closePasswordModal}>
                닫기
              </button>
            </div>
            <div className="modal-body">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새로운 비밀번호"
              />
            </div>
            <div className="modal-footer">
              <button onClick={handleSaveProfile}>저장</button>
            </div>
          </div>
        </div>
      )}

      
{modal.show && <Modal title={modal.title} body={modal.content} onClose={closeModal} customFooter={modal.button}/>}
    </div>
  );
}

export default EditProfile;