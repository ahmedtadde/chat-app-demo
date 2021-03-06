require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongo = require('mongodb').MongoClient;
const URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));

mongo.connect(URI, (err, connection) => {
    if (err) throw err;
    // console.log('MongoDB connection established ...');
    const db = connection.db('prototyping_db').collection('messages');

    io.on('connection', (socket) => {
        // console.log('made socket connection ...');

        (() => {
            db.find().limit(100).sort({
                _id: 1
            }).toArray((err, data) => {
                if (err) throw err;
                socket.emit('load messages', data);
            });
        })();


        socket.on('new message', (data) => {
            io.sockets.emit('new message', data);
        });


        socket.on('save message', (data) => {
            let user = data.user;
            let message = data.message;
            try {
                if (user !== '' && message !== '') {
                    db.insert({
                        user: user,
                        message: message
                    }, (err, data) => {
                        if (err) throw err;
                        socket.emit('message saved', data.ops[0]);
                    });
                }
            } catch (err) {
                throw err;
            }
        });


        socket.on('new user', (data) => {
            io.sockets.emit('new user', data);
        });

        socket.on('user left', (data) => {
            io.sockets.emit('user left', data);
        });
    });

});

server.listen(PORT);