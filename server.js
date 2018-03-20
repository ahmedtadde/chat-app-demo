const Express = require('express');
const App = Express();
const Server = App.listen(5000, () => {
    console.log('listenning on port 5000');
});

App.use(Express.static('public'));







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