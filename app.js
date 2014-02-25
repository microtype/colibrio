var express = require('express'),
	app = express(), ////creating variable called app and using the express function, bundles together everything in express
	server = require('http').createServer(app), //create a http server, passing the app variable
	io = require('socket.io').listen(server), //we need a http server to be able to listen with socket.io(it listens to a http server)
	nicknames = []; //keep track of the nicknames. creating an array called nicknames, to put all the users currently connected to the chat
	
server.listen(3000); //what port (number) to listen on

//create a route, express makes this easier
//what the client is trying to access route directory '/' have a function with the http request/response as parameters
//we are going to create a file index.html that the client will get whenever it goes to localhost3000
app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

//receive the event on server side.
// this is the first thing that happens when a client connects to a socket.io application. they turn on a connection event takes a function of the socket that the user it self is using, ALL YOUR SOCKET CODE GOES INSIDE THIS FUNCTION
io.sockets.on('connection', function(socket){
	socket.on('new user', function(data, callback){ //let's receive our event, having callback here since we are sending data back to the client from this function
		if (nicknames.indexOf(data) != -1){ //check if the nickname entered is already in the array is not equal to -1, send the callback data back as false. -1 means that that the nickname exists in the array.
			callback(false); //send back the boolean false
		} else{
			callback(true); //need to set the callback as true
			socket.nickname = data; //each user has it's own socket, add the nickname to the socket as a property of the socket
			nicknames.push(socket.nickname); //we push that value onto the array
			updateNicknames(); //update the clients with the nicknames
		}
	});
	
	function updateNicknames(){
		io.sockets.emit('usernames', nicknames);
	}
//receive messages on server side. LOOK AT THE NAME YOU USED TO SEND DATA ON THE CLIENT SIDE, 'send message' as a first parameter, we can do something with our data by using a function
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, nick: socket.nickname}); 
		//we want to send the message to all the users, name the event you are broadcasting to all users
		//can also send the user name called nick, convenient to store the variable nick name in socket.nickname, stored in every single socket, when a single user sends a message we can just get that property from their own socket.
	});
	
	socket.on('disconnect', function(data){ //when users disconnect
		if(!socket.nickname) return; //if they didn't provide one, just exited
		nicknames.splice(nicknames.indexOf(socket.nickname), 1); //remove the disconnecting user's nickname on the server
		updateNicknames(); //update the clients
	});
});