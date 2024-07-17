import React, { useState } from 'react';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import { useNavigate } from 'react-router-dom';
import "./style.css";

export default function Navbar() {

  const navigator = useNavigate();

  const toHome = () => navigator("/feeds");
  const toBubbles = () => navigator("/bubbles");
  const toMessages = () => navigator("/messages");
  const toProfile = () => navigator("/profile");
  
  return (
    <div class="nav">
        <button onClick={toHome}><HomeOutlinedIcon/></button>
        <button onClick={toBubbles}><BubbleChartOutlinedIcon/></button>
        <button onClick={toMessages}><MarkunreadOutlinedIcon/></button>
        <button onClick={toProfile}><AccountCircleOutlinedIcon/></button>
    </div>
  );
}

