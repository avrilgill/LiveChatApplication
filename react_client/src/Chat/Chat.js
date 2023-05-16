import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import {UserMessages} from './UserMessages'
import './Chat.css';

let socket;

export const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5225/';
  const location = useLocation();


  useEffect(() => {

    const search = location.search;
    const name = new URLSearchParams(search).get('name');
    const room = new URLSearchParams(search).get('room');

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    console.log("Room: ", room);
    console.log("Username: ", name);

    socket.emit('newConnection', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(msgs => [ ...msgs, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('newMessageAction', message, () => setMessage(''));
    }
  }

  return (
      <>
        <div className="grid-container" >

          <div className="room-info">
                <h6>Chatroom Name: {room}</h6>
            <h6><a href="/joinchat">CLOSE CHAT</a></h6>
          </div>


          <div className="chat-messages" style={{height: '300px', width:'100%', overflow: 'scroll'}}>


              {messages.map((message, i) => <div key={i}>
                <UserMessages message={message} name={name}/>
              </div>)}

          </div>

          <div className="users-online">

            {users ? (
                <div>
                  <h6>Online Members</h6>
                  <div className='activeContainer'>
                    <h6>
                      {users.map(({ name }) => (
                          <div key={name} className='activeItem'>
                            {name}

                          </div>
                      ))}
                    </h6>
                  </div>
                </div>
            ) : null}

          </div>

          <div className="send-message">
            <form>
              <input type="text" placeholder="Message" value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null } />
              <button onClick={(e) => sendMessage(e)}>SEND</button>
            </form>
          </div>
        </div>
      </>

  );
}