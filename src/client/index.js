(function(){
    const socket = io.connect('http://127.0.0.1:5000');
    const ids = ['input', 'submit', 'output', 'refresh' ,'exit','username','signin','signin-btn','users'];

    const createDOM = (arr, fn) => {
        let o = {};
        arr.forEach((el) => {
            o[el] = document.getElementById(el);
        });
        return o;
    }

    const createElement = (type, attrs) => {
        let el = document.createElement(type);
        attrs.forEach((attr) => {
            el.setAttribute(attr[0], attr[1]);
        });

        return el;
    }

    const renderUser = (id) => {
        let user = createElement('div',[['class','user']]);
        user.setAttribute('data-user', id);

        let icon = createElement('img',[['class','user_icon'],['src','assets/user-icon.png']]);

        let name =  createElement('span',[['class','user_name']]);
        name.textContent = id;

        user.appendChild(icon);
        user.appendChild(name);
        dom['users'].appendChild(user);
    }

    const signin = () => {
        let username = dom['username'].value;
        if(username){
            dom['username'].value = '';
            dom['input'].setAttribute('data-user', username);
            dom['signin'].classList.add('hidden');
            dom['users'].classList.remove('hidden');
            dom['input'].classList.remove('hidden');

            socket.emit('new user', {
                user: username,
            });

            socket.emit('new message', {
                user: username,
                message: 'joined the chat...'
            });
        }

    }


    const emitMessage = () => {
        let user = dom['input'].getAttribute('data-user');
        if(user){
            socket.emit('save message', {
                user: user,
                message: dom['input'].value,
            });

            dom['input'].value = '';
        }
    }

    const scrollDown = () => {
        dom['output'].scrollTop = dom['output'].scrollHeight - dom['output'].clientHeight;
    }

    const dom = createDOM(ids, createElement);

    let activeUsers = [];

    if(socket){

        dom['username'].onkeypress = (e) => {
            let keyCode = e.keyCode || e.which;
            if(keyCode === 13 && !e.shiftKey){
                signin();
            }
        };

        dom['signin-btn'].onclick = () => {
            signin();
        };

        dom['input'].onkeypress = (e) => {
            let keyCode = e.keyCode || e.which;
            if(keyCode === 13 && !e.shiftKey){
                emitMessage();
            }
        };

        dom['submit'].onclick = () => {
            emitMessage();
        };

        dom['refresh'].onclick = () => {
            dom['username'].value = '';
            dom['input'].value = '';
            dom['output'].innerHTML = '';
        };

        dom['exit'].onclick = () => {
            let user = dom['input'].getAttribute('data-user');
            if(user){
                dom['users'].classList.add('hidden');
                dom['username'].value = '';
                dom['signin'].classList.remove('hidden');
                dom['input'].classList.add('hidden');
                dom['input'].value = '';
                dom['input'].setAttribute('data-user','');


                socket.emit('new message', {
                    user: user,
                    message: 'left the chat...',
                    user_left: true,
                });

                socket.emit('user left', {
                    user : user,
                });
                dom['users'].innerHTML = '';

                activeUsers = [];
            }
        };

        window.onpopstate = () => {
            dom['exit'].click();
        };

        window.onbeforeunload = () => {
            dom['exit'].click();
        }

        socket.on('load messages', (data) => {
            // console.log(data);
            if(data.length){
                data.forEach((record) => {
                    let message, user, text;
                    message = createElement('div', [['class', 'users-message']]);
                    user = createElement('span',[['class','users-message_from']]);
                    text = createElement('p',[['class', 'users-message_text']]);

                    user.textContent = record.user;
                    text.textContent = record.message;
                    message.appendChild(user);
                    message.appendChild(text);
                    dom['output'].appendChild(message);
                });

                scrollDown();
            }
        });

        socket.on('new user', (data) => {
            if(!activeUsers.includes(data.user.toLowerCase())){
                renderUser(data.user);
                activeUsers.push(data.user.toLowerCase());
            }
        });

        socket.on('user left', (data) => {
            if(activeUsers.includes(data.user.toLowerCase())){
                dom['users'].querySelector(`.user[data-user="${data.user}"]`).remove();
                activeUsers.pop(data.user.toLowerCase());
            }
        });

        socket.on('message saved', (data) => {
            socket.emit('new message', data);
        });

        socket.on('new message', (data) => {
            if(data){
                if(typeof data.user_left === "undefined"){
                    socket.emit('new user', {
                        user: data.user
                    });
                }

                let isFromThisUser = (dom['input'].getAttribute('data-user') === data.user);
                let message, user, text;
                if(isFromThisUser){
                    message = createElement('div', [['class', 'user-message']]);
                    user = createElement('span',[['class','user-message_from']]);
                    text = createElement('p',[['class', 'user-message_text']]);
                }else{
                    message = createElement('div', [['class', 'users-message']]);
                    user = createElement('span',[['class', 'users-message_from']]);
                    text = createElement('p',[['class', 'users-message_text']]);
                }

                user.textContent = data.user;
                text.textContent = data.message;
                message.appendChild(user);
                message.appendChild(text);
                dom['output'].appendChild(message);
                dom['input'].value = '';
                scrollDown();
            }

        });
    }
})();