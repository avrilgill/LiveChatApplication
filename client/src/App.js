import React ,{useState}from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {JoinChat} from "./Chat/JoinChat";
import {Chat} from "./Chat/Chat";
function App() {

    return (
        <>
        <Router>
          <Switch>
            <Route exact path="/joinchat" component={JoinChat} />
            <Route exact path="/chat" component={Chat} />

          </Switch>
        </Router>
        </>
    );
}
export default App;
