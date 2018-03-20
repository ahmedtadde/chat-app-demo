const Express = require('express');
const App = Express();
const Server = require('http').createServer(App);
const IO = require('socket.io')(Server);
const Mongo = require('mongodb').MongoClient;
const URI = 'mongodb://metron-admin:barca4life@ds117749.mlab.com:17749/prototyping_db';


App.use(Express.static('public'));

Mongo.connect(URI, (err, connection) => {
    if(err) throw err;
    console.log('MongoDB connection established ...');
    const db = connection.db('prototyping_db').collection('messages');

    IO.on('connection', (socket) => {
        console.log('made socket connection ...');

        (() => {
            db.find().limit(100).sort({_id:1}).toArray((err, data) => {
                if(err) throw err;
                socket.emit('new message', data);
            });
        })();


        socket.on('new message', (data) => {
            IO.sockets.emit('new message', data);
        });


        socket.on('save message', (data) => {
            let user = data.user;
            let message = data.message;
            try{
                if(user !== '' && message !== ''){
                    db.insert({
                        user: user,
                        message: message
                    }, (err, data) => {
                        if(err) throw err;
                        socket.emit('message saved',data.ops);
                    });
                }
            }
            catch (err){
                throw err;
            }
        });
    });

});
Server.listen(5000);




// const io = require('socket.io')();
// const mongodb = require('mongodb').MongoClient;
// const uri = 'mongodb://metron-admin:barca4life@ds117749.mlab.com:17749/prototyping_db';

// mongodb.connect(uri, (err, connection) => {

//     if(err) throw err;
//     console.log('MongoDB connected ...');

//     let db = connection.db('prototyping_db');
//     io.on('connection', (socket) => {


//         const emitStatus = payload => socket.emit('status', payload);

//         let messages = db.collection('messages');
//         (() => {
//             messages.find().limit(100).sort({_id:1}).toArray((err, arr) =>{
//                 if(err) throw err;
//                 socket.emit('output', {
//                     data: arr,
//                     updateAll: true,
//                 });
//             });
//         })();

//         socket.on('new user', (data) => {
//             socket.broadcast.emit('output', {
//                 data: [data],
//                 updateAll: false,
//             });

//             // emitStatus({
//             //     code: 1,
//             //     message: `${data.user} just joined the chat...`,
//             // });
//         });

//         socket.on('input', (data) => {
//             let user = data.user;
//             let message = data.message;

//             if(message === ''){
//                 emitStatus({
//                     code: 404,
//                     message: 'request has empty message'
//                 });
//             }else{
//                 messages.insert({
//                     user: user,
//                     message: message
//                 }, (err, data) => {
//                     if(err) throw err;
//                     // console.log("new inserted record: ", data);
//                     socket.broadcast.emit('output', {
//                         data: data.ops,
//                         updateAll: false,
//                     });
//                     emitStatus({
//                         code: 200,
//                         message: 'ok'
//                     });
//                 });
//             }
//         });
//     });

//     io.listen(5000);
//     // Only close the connection when your app is terminating.
//     // db.close(function (err) {
//     //     if(err) throw err;
//     // });
// });