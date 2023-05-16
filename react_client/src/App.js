import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { JoinChat } from "./Chat/JoinChat";
import { Chat } from "./Chat/Chat";
function App() {

  return (
    // <BrowserRouter>
    //   <div>
    //     <Routes>
    //       <Route path='/joinchat' component={<JoinChat/>} />
    //       <Route path="/chat" component={Chat} />
    //     </Routes>
    //   </div>
    // </BrowserRouter>
    <Router>
      <Routes>
        <Route path="/joinchat" element={<JoinChat/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
  </Router>
  );
}
export default App;
