(function(){
    const socket = io.connect('http://127.0.0.1:5000');
    const ids = ['input', 'output', 'exit','username','signin','join','users'];

    const getElement = id => document.getElementById(id);

    const buildDOM = (arr, fn) => {
        let o = {};
        arr.forEach((el) => {
            o[el] = getElement(el);
        });
        return o;
    }

    const buildElement = (type, attrs) => {
        let el = document.createElement(type);
        attrs.forEach((attr) => {
            el.setAttribute(attr[0], attr[1]);
        });

        return el;
    }

    // const renderUser = (id) => {
    //     let user = buildElement('div',[['class','user']]);
    //     user.setAttribute('data-user', id);

    //     let icon = buildElement('img',[['class','user_icon'],['src','assets/user-icon.png']]);

    //     let name =  buildElement('span',[['class','user_name']]);
    //     name.textContent = id;

    //     user.appendChild(icon);
    //     user.appendChild(name);
    //     dom['users'].appendChild(user);
    // }

    const join = () => {
        let username = dom['username'].value;
        if(username === ''){
            return false;
        }

        dom['input'].setAttribute('data-user', username);
        // renderUser(username);
        dom['signin'].classList.add('hidden');
        dom['input'].classList.remove('hidden');
    }

    const dom = buildDOM(ids, getElement);

    if(socket){

        dom['join'].onclick = () => {
            join();
            socket.emit('new message', [{
                user: dom['input'].getAttribute('data-user'),
                message: 'joined the chat...'
            }]);
        };

        dom['input'].onkeypress = (e) => {
            let keyCode = e.keyCode || e.which;
            if(keyCode === 13 && !e.shiftKey){
                // console.log('message submitted...');
                socket.emit('save message', {
                    user: dom['input'].getAttribute('data-user'),
                    message: dom['input'].value,
                });

                dom['input'].value = '';
            }
        };

        socket.on('message saved', (data) => {
            socket.emit('new message', data);
        })

        socket.on('new message', (data) => {
            console.log(data);
        });
    }

    // console.log(dom);

    // if(socket !== undefined){
    //     console.log('socket.io activated on client side...');

    //     dom['join'].onclick = () => {
    //         console.log(' new user joined ... ');
    //         addUser();
    //         socket.emit('new user', {
    //             user: dom['input'].getAttribute('data-user'),
    //             message: 'joined the chat...'
    //         });
    //     };

    //     dom['exit'].onclick = () => {
    //         dom['signin'].classList.remove('hidden');
    //         dom['input'].classList.add('hidden');
    //         dom['input'].value = '';
    //         let user = dom['input'].getAttribute('data-user');
    //         dom['input'].setAttribute('data-user','');

    //         Array.from(dom['users'].children).forEach((el) => {
    //             if(el.getAttribute('data-users') === user){
    //                 el.remove();
    //             }
    //         });
    //     }

    //     socket.on('output', (data) => {
    //         if(data.updateAll){
    //             dom['output'].innerHTML = '';
    //         }

    //         if(data.data.length){
    //             let usernames = [];
    //             data.data.forEach((record) => {
    //                 let isFromThisUser, message, user, text;
    //                 isFromThisUser = (record.user === dom['input'].getAttribute('data-user'));
    //                 if(data.updateAll){
    //                     if(!usernames.includes(record.user)){
    //                         renderUser(record.user);
    //                         usernames.push(record.user);
    //                     }
    //                 }
    //                 if(isFromThisUser){
    //                     message = buildElement('div', [['class', 'user-message']]);
    //                     user = buildElement('span',[['class','user-message_from']]);
    //                     text = buildElement('p',[['class', 'user-message_text']]);
    //                 }else{
    //                     message = buildElement('div', [['class', 'users-message']]);
    //                     user = buildElement('span',[['class', 'users-message_from']]);
    //                     text = buildElement('p',[['class', 'users-message_text']]);
    //                 }

    //                 user.textContent = record.user;
    //                 text.textContent = record.message;
    //                 message.appendChild(user);
    //                 message.appendChild(text);
    //                 dom['output'].appendChild(message);
    //             });
    //         }
    //     });

    //     dom['input'].onkeypress = (e) => {
    //         let keyCode = e.keyCode || e.which;
    //         if(keyCode === 13 && !e.shiftKey){
    //             console.log('message submitted...');
    //             socket.emit('input', {
    //                 user: dom['input'].getAttribute('data-user'),
    //                 message: dom['input'].value,
    //             });

    //             dom['input'].value = '';
    //         }
    //     };

    //     socket.on('status', (data) => {
    //         if(data.code === 404){
    //             alert(data.message);
    //         }else{
    //             console.log(data.message);
    //         }
    //     });
    // }

})();