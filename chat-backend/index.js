const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000','https://online-chat-frontend.onrender.com','https://chat.amanshakya.tech'],
    methods: ['GET', 'POST']
  }
});


const user = [{'email':'amanshakya360@gmail.com','password':'12345678','name':'Aman Shakya','isActive':false},{'email':'as@gmail.com','password':'12345678','name':'Shivam Shakya','isActive':false}]

io.on('connection', (socket) => {
  console.log('A user connected with',socket.id);
  //Getting data
  socket.on('userlogin',(data)=>{
  	var flag =  false;
	let tempData = [];
	user.map((element)=>{
		if(element.email !== data.email){
			tempData.push({'email':element.email,'name':element.name,'isActive':element.isActive});
		}
	})
  	user.map((element)=>{
  		if(element.email === data.email  && element.password === data.password){
  			element['socketId'] = socket.id;
			element['isActive'] = true;
  			socket.emit('userAuth',{'login':true,'userData':tempData});
  			socket.broadcast.emit('profileChanges',{'email':element.email,'isActive':true});
			console.log(element.name,"Logined using",socket.id)
  			flag = true;
  		}
  	})
  	
  	if(!flag){
  		socket.emit('userAuth',{'login':false});
  	}
  });
  
  socket.on('message',(message)=>{
	user.map((element)=>{
		if(element.socketId === socket.id){
			console.log(message.msg,'by',element.name,'to',message.sender);
			socket.broadcast.emit("incomingMsg",{'sender':element.name,'message':message.msg,'type':'incoming'});
		}
	})
  });
  
  socket.on('disconnect', () => {
	user.map((element)=>{
		if(element.socketId === socket.id){
			element['isActive'] = false;
			console.log(element.name,"Disconnect");
			socket.broadcast.emit('profileChanges',{'email':element.email,'isActive':false});
		}
	})
  });
  
  
  //sending data
});

server.listen(8080, () => {
  console.log('Signaling server listening on port 8080');
});


