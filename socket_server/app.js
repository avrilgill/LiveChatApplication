//Libraries
const express = require('express');
const app = express();
const PORT = 5225

const http = require('http').Server(app);
const cors = require('cors');
app.use(cors());

const io = require('socket.io')(http, {
    cors: {
        // TODO: change to react server address
        origin: "http://localhost:3000"
    }
});

const bodyParser = require("body-parser");

//Local imports
const { addConnection, removeConnection, userDetails, roomUserDetails } = require('./chat-controller');

// app.use((req, res, next) => {
//     //TODO:Change allow origin to our website only 
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.setHeader("Access-Control-Allow-Headers", "Accept,Origin,X-Requested-With,Content-Type,Authorization,CSRF-TOKEN")
//     res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH")
//     next();
// })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// // check if server alive
// app.get('/', (req, res) => {
//     res.json({
//       message: 'Server is Alive!',
//     });
//   });


//CHAT CODE START
io.on('connect', (socket) => {
    socket.on('newConnection', ({ name, room }, callback) => {
        console.log("New user connection request!");
        const { error, tempUser } = addConnection({ id: socket.id, name, room });
        
        console.log("Room: ", room);
        console.log("Username:", name );
        
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
        console.log("remove connection request!");
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


http.listen(PORT, (err) => {
    if (err) {
        console.log(err, "Listening error")
    } else {
        console.log("Listening at", PORT, "...")
    }
})