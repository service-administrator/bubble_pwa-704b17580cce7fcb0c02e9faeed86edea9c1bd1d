import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Page_signup from "./../Page/signup/SignUp";
import Page_signin from "./../Page/signin_new/SignIn";
import Page_feeds from "./../Page/feeds/Feeds";
import Page_profile from "./../Page/profile/ProfilePage";
import Page_write from "./../Page/write/writeFeed";
import Page_bubbles from "./../Page/bubbles/Bubbles";
import Page_bubble_info from "./../Page/bubble_info/Bubble_Info";
import Page_bubble_new from "./../Page/bubble_new/Bubble_New";
import Page_messages from "./../Page/messages/Messages";
import Page_message from "./../Page/message/Message";
import Page_notification from "./../Page/notification/Notification";
import Page_friends from "./../Page/friendSuggestion/FriendSuggestion";
import Page_editProfile from "./../Page/profile_edit/editProfile";
import "./default.css";

export default function Router({ setLoginState, loggedIn, ws }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/feeds" /> : <Page_signin setLoginState={setLoginState} />}
        />
        <Route
          path="/signup"
          element={loggedIn ? <Navigate to="/feeds" /> : <Page_signup setLoginState={setLoginState} />}
        />
        <Route
          path="/profile/:id?"
          element={
            loggedIn ? (
              <Page_profile ws={ws} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/friends"
          element={loggedIn ? <Page_friends ws={ws} /> : <Navigate to="/" />}
        />
        <Route
          path="/feeds"
          element={loggedIn ? <Page_feeds ws={ws} /> : <Navigate to="/" />}
        />
        <Route
          path="/write"
          element={loggedIn ? <Page_write ws={ws} /> : <Navigate to="/" />}
        />
        <Route
          path="/messages"
          element={loggedIn ? <Page_messages ws={ws} /> : <Navigate to="/" />}
        />
        <Route
          path="/message/:id"
          element={loggedIn ? <Page_message ws={ws} /> : <Navigate to="/" />}
        />
        <Route
          path="/bubble_info/:id"
          element={loggedIn ? <Page_bubble_info ws={ws} /> : <Navigate to="/" />}
        />
        <Route
          path="/bubble_new"
          element={loggedIn ? <Page_bubble_new ws={ws}  /> : <Navigate to="/" />}
        />
        <Route
          path="/bubbles"
          element={loggedIn ? <Page_bubbles ws={ws} /> : <Navigate to="/" />}
        />
        <Route
          path="/notification"
          element={loggedIn ? <Page_notification ws={ws} /> : <Navigate to="/" />}
        />
        <Route
          path="/profile_edit"
          element={loggedIn ? <Page_editProfile ws={ws} setLoginState={setLoginState}/> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}