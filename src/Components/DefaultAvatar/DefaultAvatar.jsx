// src/Components/DefaultAvatar/DefaultAvatar.jsx

import React from 'react';
import './style.css';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';

function DefaultAvatar({ onClick, className = "" , style = {}}) {
  return (
    <div className={`${className} default-avatar`} onClick={onClick} style={style}>
      <PersonIcon fontSize='large' />
    </div>
  );
}

export default DefaultAvatar;