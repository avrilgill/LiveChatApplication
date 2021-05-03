import React, { useState } from 'react';
import { Link } from "react-router-dom";

import './Join.css';

export const JoinChat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');


  return (
    <div style={{margin: "auto",
      width: "60%",
      border: "5px solid #cc99ff",
      padding: "10px"}}>
      <div>
        <h1>Welcome to Join Chat</h1>
        <div>
          <input
              style={{margin: "auto",
                width: "60%",
                border: "5px solid #cc99ff",
                padding: "10px"}}
              placeholder={"Please enter your name here!"} type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <h2>Select a Chatroom Please</h2>
          <select size="4" onChange={(event) => setRoom(event.target.value)}>
            <option value="Group 1">Group 1</option>
            <option value="Group 2">Group 2</option>
            <option value="Group 3">Group 3</option>
            <option value="Group 4">Group 4</option>
          </select>
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
          <button className={'button mt-20'} type="submit">Sign In</button>
        </Link>
      </div>
    </div>
  );
}