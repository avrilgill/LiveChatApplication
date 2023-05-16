//Libraries
const http = require('http');
const sockets = require('socket.io');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5225
const server = http.createServer(app);
const io = sockets(server);
app.use(cors());
const bodyParser = require("body-parser");

//Local imports
const { addConnection, removeConnection, userDetails, roomUserDetails } = require('./chat-controller');

app.use((req, res, next) => {
    //TODO:Change allow origin to our website only 
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Accept,Origin,X-Requested-With,Content-Type,Authorization,CSRF-TOKEN")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH")
    next();
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// check if server alive
app.get('/', (req, res) => {
    res.json({
      message: 'Server is Alive!',
    });
  });


//CHAT CODE START
io.on('connect', (socket) => {
    socket.on('newConnection', ({ name, room }, callback) => {
        const { error, tempUser } = addConnection({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.join(tempUser.room);

        io.to(tempUser.room).emit('onlineUserDetails', { room: tempUser.room, users: roomUserDetails(tempUser.room) });

        callback();
    });

    socket.on('newMessageAction', (message, callback) => {
        const user = userDetails(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeConnection(socket.id);

        if (user) {
            io.to(user.room).emit('onlineUserDetails', { room: user.room, users: roomUserDetails(user.room) });
        }
    })
});


//CHAT CODE ENDS

app.use((err, req, res, next) => {

    if (res.headerSend) {
        return next(err)
    } else {
        console.log("err catcher", err.message);
        if (err.message) {
            res.status(500).json({ message: err.message })
        } else {
            res.status(500).json({ message: "Server error occured" })
        }
    }

})


server.listen(port, (err) => {
    if (err) {
        console.log(err, "Listening error")
    } else {
        console.log("Listening at", port, "...")
    }
})