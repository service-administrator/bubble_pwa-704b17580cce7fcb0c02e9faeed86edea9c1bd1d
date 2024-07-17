import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';  // 스타일 시트 임포트
import NavBar from '../../Components/NavBar/NavBar';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';

function WriteFeed({
  loggedIn,
  ws
}) {
    const navigator = useNavigate();

    const [files, setFiles] = useState([]);

  const [feed, update] = useState(
    {
      "content": "",
      "media": [],
    }
  )
  const uploadFiles = async () => {
    const formData = new FormData();

    files.map((file) => {
      formData.append("files", file);
    });

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
      return json.data.files
    }else{
      return [];
    }

  }

  const write = async () => {

    let files = await uploadFiles();
    console.log(feed)
    const res = await fetch(`/bubble/api/feed/writeFeed`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        ...feed,
        "media": files
      })
      
      
    });
    let json = await res.json();
    console.log(json)
    if(json.success){
      back();
    }else{
      alert(json.message);
      back();
    }
  }

  const back= () => {
    navigator(-1);
  }

  const onChange = (e) => {
    const {name, value} = e.target;
    update((p) => ({...p, [name]:value}));
  }


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
};

const removeFile = (file) => {
    setFiles(files.filter(f => f !== file));
};
  return (
    <div class="ViewScreen">
    <div class="writeFeed">
        
    
        <div class="container">
        <div class="header">
            <a onClick={back}><BackIcon/></a>
            <h1>게시글 작성</h1>
        </div>
            <div class="form-group">
                <label htmlFor="content" >내용</label>
                <textarea id="content" name="content" value={feed.content} onChange={onChange}></textarea>
            </div>
            <div className="form-group">
                    <label htmlFor="media" className="file-label">미디어 추가</label>
                    <input
                        type="file"
                        id="media"
                        name="media"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
            
            <div className="preview">
                    {files.map((file, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt={`preview-${index}`}
                            onClick={() => removeFile(file)}
                        />
                    ))}
                </div>
            <button onClick={write} class="submit-button">게시</button>
    </div>
    <NavBar/>
    </div>
    </div>
    
  );
}

export default WriteFeed;
