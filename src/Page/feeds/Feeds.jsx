// Feeds.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import socket from './../../Websocket/socket';
import NavBar from '../../Components/NavBar/NavBar';
import LikeIcon_Off from '@mui/icons-material/FavoriteBorder';
import LikeIcon_On from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import NotiIcon_Off from '@mui/icons-material/NotificationsNone';
import NotiIcon_On from '@mui/icons-material/Notifications';
import FriendsIcon from '@mui/icons-material/GroupOutlined';
import { timeAgo } from '../../Utils/timeago';
import DefaultAvatar from '../../Components/DefaultAvatar/DefaultAvatar';
import AddIcon from '@mui/icons-material/ControlPoint';

function Feeds({
  loggedIn,
  ws
}) {
  const navigator = useNavigate();

  const [feedlist, feedupdater] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newNoti, setNotiState] = useState(false);

  const [feedReplies, setFeedReplies] = useState([]);

  const [replyContent, setReplyContent] = useState("");

  const openCommentModal = (feed) => {
    setSelectedFeed(feed);
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setSelectedFeed(null);
    setShowCommentModal(false);
  };

  useEffect(() => {
    console.log(selectedFeed)
    if(!showCommentModal || selectedFeed == null){
      setReplyContent("");
      setFeedReplies([]);
      return;
    }
    loadReplies();
  }, [showCommentModal]);

  const [loadState, updater] = useState({
    "last": new Date().getTime(),
    "cnt": 3
  });

  const loadFeed = async () => {
    const res = await fetch(`/bubble/api/feed/loadFeeds`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(loadState)
    });
    let json = await res.json();
    console.log(json)
    if (json.success) {
      
        
      feedupdater(Array.from([...feedlist,...json.data.feedList, ]));
      if(json.data.last){
        updater({...loadState, last: json.data.last});
      }
      //feedupdater(json.data.feedList);
    } else {
      alert(json.message);
    }
  }

  const loadReplies = async () => {
    const res = await fetch(`/bubble/api/feed/loadReplies`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        feed: selectedFeed.id,
      })
    });
    let json = await res.json();
    console.log(json)
    if (json.success) {
      setFeedReplies(json.data.replyList);
    } else {
      alert(json.message);
    }
  }

  const toFeedWrite = () => {
    navigator("/write")
  }

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    console.log(socket);
    socket.sethandler((data) => {
      if(data.method == "notification"){
        setNotiState(true);
      }
  });
  }, [feedlist]);

  const toNoti = () => {
    navigator("/notification")
  }

  const onReplyContentChange = (e) => {
    const {id, value} = e.target;
    setReplyContent(value);
  }
  
  const writeReply = async () => {
    const res = await fetch(`/bubble/api/feed/writeReply`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        feed: selectedFeed.id,
        content: replyContent
      })
    });
    let json = await res.json();
    console.log(json)
    if (json.success) {
      setFeedReplies([json.data.reply, ...feedReplies, ]);
      setReplyContent("");
    } else {
      alert(json.message);
    }
  }

  const likeFeed = async (id) => {
    let feed = feedlist.find((f) => f.id == id);
    if(!feed){
      return;
    }
    const res = await fetch(`/bubble/api/feed/likeFeed`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        id: id
      })
    });
    let json = await res.json();
    console.log(json)
    if (json.success) {
      feedupdater(feedlist.map((f) => f.id == id ? {...f, like: f.like+(json.data.like?(+1):(-1)), liked: json.data.like} : f))
    } else {
      alert(json.message);
    }
  }

  const likeReply = async (id) => {
    let reply = feedReplies.find((f) => f.id == id);
    if(!reply){
      return;
    }
    const res = await fetch(`/bubble/api/feed/likeReply`, {
      "method": "POST",
      "headers": {
        "Authorization": localStorage.getItem("token") || "",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        id: id
      })
    });
    let json = await res.json();
    console.log(json)
    if (json.success) {
      setFeedReplies(feedReplies.map((f) => f.id == id ? {...f, like: f.like+(json.data.like?(+1):(-1)), liked: json.data.like} : f))
    } else {
      alert(json.message);
    }
  }
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (image) => {
    setSelectedImage(image);
  };
  
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  

  return (
    <div class="ViewScreen">
    <div class="Feeds">
      <div class="container">
        <div class="header">
          <h1>홈</h1>
          <div class="icons">
            <FriendsIcon fontSize='large' onClick={() => navigator("/friends")} />
            {newNoti ? <NotiIcon_On fontSize='large' onClick={toNoti}/> : <NotiIcon_Off fontSize='large' onClick={toNoti}/>}
          </div>
        </div>
        <div class="post-container">
          {[feedlist.map((feed) => (
            <div class="post" key={feed.id}>
              <div class="profile">
              {
                    feed.writer.pfimg == "default" ?
                    <DefaultAvatar
                onClick={() => {navigator(`/profile/${feed.writer.username}`)}}
                style={{ marginRight: '10px' }}
              /> :
              <img
              src={feed.writer.pfimg}
              alt="Profile"
              class="avatar"
              onClick={() => {navigator(`/profile/${feed.writer.username}`)}}
            />
                  }
                <div class="details">
                  <p>{feed.writer.name}</p>
                  <p>@{feed.writer.username}</p>
                </div>
              </div>
              <div class="content">
                {feed.content}
              </div>
              {feed.media.length > 0 ? (
  <div className="media">
    {feed.media.slice(0, 2).map((media, index) => (
      <div key={index} className="media-item" onClick={() => openImageModal(media)}>
        <img src={media} alt="Media" />
      </div>
    ))}
  </div>
) : null}
              <div class="interaction">
                <div class="likes">
                  {feed.liked ? <LikeIcon_On onClick={() => likeFeed(feed.id)}/> : <LikeIcon_Off onClick={() => likeFeed(feed.id)}/>}
                  <span>{feed.like}</span>
                </div>
                <div class="comments" onClick={() => openCommentModal(feed)}>
                  <CommentIcon />
                  <span>댓글</span>
                </div>
              </div>
              <div class="time">
                {timeAgo(feed.createdAt)}
              </div>
            </div>
          )),
          <button class="load-more" onClick={loadFeed}>이전 게시글 더보기</button>]}
          {showCommentModal && (
            <div class="comment-modal">
              <div class="modal-content">
                <div class="modal-header">
                  <h2>댓글</h2>
                  <button onClick={closeCommentModal}>닫기</button>
                </div>
                <div class="modal-body">
                  <div class="comment-list">
                  {
                    feedReplies.length > 0 ? 
                    feedReplies.map((reply) => (
                      <div class="comment" key={reply.createdAt}>
                            {
                    reply.writer.pfimg == "default" ?
                                  <DefaultAvatar
                              onClick={() => {navigator(`/profile/${reply.writer.username}`)}}
                              style={{ marginRight: '10px' }}
                            /> :
                            <img
                            src={reply.writer.pfimg}
                            alt="Profile"
                            class="comment-profile"
                            onClick={() => {navigator(`/profile/${reply.writer.username}`)}}
                          />}
                        <div class="comment-details">
                          <div class="comment-writer">
                            <span class="name">{reply.writer.name}</span>
                            <span class="username">@{reply.writer.username}</span>
                          </div>
                          <div class="comment-content">{reply.content}</div>
                          <div class="comment-info">
                            <span class="comment-time">{timeAgo(reply.createdAt)}</span>
                            <span class="comment-likes">
                            {reply.liked ? <LikeIcon_On onClick={() => likeReply(reply.id)}/> : <LikeIcon_Off onClick={() => likeReply(reply.id)}/>}</span>
                          </div>
                        </div>
                      </div>
                    ))
                    :(
                      <div class="no-comments">
                        댓글이 없어요..
                      </div>
                    )}
                  </div>
                  <div class="comment-form">
                    <input type="text" placeholder="댓글을 작성해주세요!" value={replyContent} onChange={onReplyContentChange} />
                    <button onClick={writeReply}>작성</button>
                  </div>
                </div>
              </div>
            </div>
          )}{selectedImage && (
            <div className="image-modal" onClick={closeImageModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={selectedImage} alt="Selected Media" />
                <button className="close-button" onClick={closeImageModal}>
                  닫기
                </button>
              </div>
            </div>
          )}
          
        </div>
        <a onClick={() => navigator("/write")} class="create-post-button"><AddIcon/></a>
      </div>
      <NavBar />
    </div>
    </div>
  );
}

export default Feeds;