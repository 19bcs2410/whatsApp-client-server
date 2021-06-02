const { resolveInclude } = require('ejs');
var express = require('express');
var fs = require('fs');
var readline = require('readline');
var socketio = require('socket.io');
const { runInNewContext } = require('vm');
var app = express();

app.use(express.static('public'));

var server = app.listen(process.env.PORT || 3030, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});


var user_mobile_sid = {};
var user_mobile_password = { '12345': '123' };

var user_mobile_friends = { '12345': ['123456', '1234567', '12345678', '123456789'] };

var io = socketio(server);

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('send_msg', function(data) {

        socket.broadcast.emit('take_msg', data);

    });

    socket.on('user_mobile_no', function(data) {

        if (data['mobile_no'] in user_mobile_sid) {

            if (data['password'] == user_mobile_password[data['mobile_no']]) {

                socket.emit('correct_password', { 'mobile_no': data['mobile_no'] });


            } else {
                socket.emit('wrong_password');

            }

        } else {

            user_mobile_sid[data['mobile_no']] = socket.id;
            user_mobile_password[data['mobile_no']] = data['password'];
            user_mobile_friends[data['mobile_no']] = [];

        }



    })

});