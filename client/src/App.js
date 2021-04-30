import React, { useState,useContext } from 'react';
import Button from "@material-ui/core/Button";
import './App.css';

function App() {
  const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    function processInfo(e){
        e.preventDefault();
        alert("Please Enter Name and select a chatroom as well");
    }
  return (
<div style={{
            margin: "auto",
            width: "60%",
            border: "5px solid #cc99ff",
            padding: "10px"
        }}>
            <div>
                <h1>Welcome to Join Chat</h1>
                <div>
                    <input
                        style={{
                            margin: "auto",
                            width: "60%",
                            border: "5px solid #cc99ff",
                            padding: "10px"
                        }}
                        placeholder={"Please enter your name here!"} type="text" onChange={(event) => setName(event.target.value.trim().toLowerCase())} />
                </div>
                <div>
                    <h2>Select a Chatroom Please</h2>
                    <select size="4" onChange={(event) => setRoom(event.target.value)}>
                        <option value="Focus">Focus</option>
                        <option value="Social">Social</option>
                        <option value="Work">Work</option>
                        <option value="Random">Random</option>
                    </select>
                </div>
           
             <Button variant="contained" color="primary" onClick={e => (!name || !room) ? processInfo(e) : null}><a href={`/insidechat?name=${name}&room=${room}`} color="white">JOIN</a></Button>
        
                    
            
            </div>
        </div>
    );
}
export default App;
