import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import {UserMessages} from './UserMessages'
import './Chat.css';

let socket;

export const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5000/';


  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
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
      socket.emit('sendMessage', message, () => setMessage(''));
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