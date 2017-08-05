var canvas, ctx, loginForm, loginUsername, chatHistory, chatForm, chatMsg;

/* Connect to socket.io */
var socket = io();

var gameState = {
    status: '',
    myTurn: false
};
setupLogin();

socket.on('game:begin', function() {
    setupBoard();
    setupChat();
    changeStatus('STARTING_GAME');
});

socket.on('game:turn', function(myTurn) {
    gameState.myTurn = myTurn;
    changeStatus(myTurn ? 'YOUR_TURN' : 'OPPONENT_TURN');
});

socket.on('game:host', function(game) {
    console.log('created new game id ' + game.id);
    gameState.id = game.id;
    changeStatus('SEARCHING_FOR_OPPONENT');
});

socket.on('game:join', function(game) {
    console.log('joined existing game id ' + game.id);
    gameState.id = game.id;
    changeStatus('JOINED_EXISTING_GAME');
});

socket.on('game:win', function() {
    console.log('Congrats! You win!');
    changeStatus('WINNER');
});

socket.on('game:lose', function() {
    console.log('Oh no, looks like you lost!');
    changeStatus('LOSER');
});

socket.on('game:forfeit', function() {
    console.log('Congrats! Your opponent left, therefore you win!');
    changeStatus('WINNER');
});

function setupLogin() {
    console.log('Setting up login');

    changeStatus('WAITING_FOR_LOGIN');

    loginForm = document.getElementById('login-form');
    loginUsername = document.getElementById('login-name');

    socket.on('player:login:success', function() {
        loginForm.style.display = 'none';
    });

    loginForm.addEventListener('submit', loginSubmit, false);
    function loginSubmit(event) {
        event.preventDefault();
        socket.emit('player:login:attempt', loginUsername.value);
        loginUsername.value = '';
        return false;
    }
}

function setupBoard() {
    console.log('Setting up board');

    canvas = document.getElementById('master-canvas');
    ctx = canvas.getContext('2d');

    /* Display Board */
    canvas.style.display = 'block';

    /* Draws Board Grid */
    bmDraw.init(canvas, ctx, 3);

    socket.on('move:draw:native', function(move) {
        bmDraw.mark(move.col, move.row, 'X');
    });
    socket.on('move:draw:foreign', function(move) {
        bmDraw.mark(move.col, move.row, 'O');
    });

    canvas.addEventListener('click', canvasClick, false);
    function canvasClick(event) {
        if (!gameState.myTurn) return;
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        var pos = bmDraw.identifyGridFromMouse(x, y);
        socket.emit('board:move', {
            col: pos.x,
            row: pos.y
        });
    }
}

function setupChat() {
    console.log('Setting up chat');

    chatHistory = document.getElementById('chat-history');
    chatForm = document.getElementById('chat-form');
    chatMsg = document.getElementById('chat-msg');

    socket.on('chat:msg:native', function(chat) {
        chatHistory.value += chat.speaker + ': ' + chat.msg + "\n";
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });
    socket.on('chat:msg:foreign', function(chat) {
        chatHistory.value += chat.speaker + ': ' + chat.msg + "\n";
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });

    chatForm.addEventListener('submit', chatSubmit, false);
    function chatSubmit(event) {
        event.preventDefault();
        socket.emit('chat:speak', chatMsg.value);
        chatMsg.value = '';
        return false;
    }

    /* Display Chat HTML */
    chatHistory.style.display = 'block';
    chatForm.style.display = 'block';
}

function changeStatus(status) {
    gameState.status = status;
    document.getElementById('game-status').innerText = status;
}