// Importing necessary libraries.
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { Client } = require('pg');
const moment = require('moment-timezone');


// Intializing some variables app,server and local.
const app = express();
const server = http.createServer(app);
const local = moment.utc();

// Intializing connection with database.
const connection = new Client({
	connectionString: 'postgres://root:J0UqbqGH5JGGBUcwIVnNwSat3civEEPa@dpg-cgqgnmm4dad5es0nv26g-a.oregon-postgres.render.com/dbnotes',
	ssl: {
	  rejectUnauthorized: false,
	},
});

// Making connection with database.
connection.connect((error)=>{
	if(!error){
		console.log("Database connected successfully")
	}
	else{
		console.error(error);	
	}
});

// Intializing socket known domain from where socket can connect.
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000','https://online-chat-frontend.onrender.com','https://chat.amanshakya.tech'],
    methods: ['GET', 'POST']
  }
});


const user = [{'email':'amanshakya360@gmail.com','password':'12345678','name':'Aman Shakya','isActive':false},{'email':'asthaverma@gmail.com','password':'12345678','name':'Astha Verma','isActive':false}]

io.on('connection', (socket) => {
  	console.log('A user connected with',socket.id);
	// Get User data when first time login
	socket.on('user_login_first_time',(data)=>{
		connection.query(`Insert into chatusers(email,name,image,isactive,socketid) values('${data.email}','${data.name}','${data.image}',true,'${socket.id}');`,(error, results) => {
			console.log(data.email,"logined as",socket.id)
			socket.broadcast.emit('profile_change',{'email':data.email,'name':data.name,'image':data.image,'isActive':true});
			connection.query(`select email,name,image from chatusers where  email !='${data.email}' and isactive = true;`,(error, results) => {
				socket.emit('user_data',results.rows);
			});
		});
	});

	// Get user active when user login 
	socket.on('user_login',(data)=>{
		console.log(data.email,"logined as",socket.id)
		connection.query(`UPDATE chatusers SET isactive = true, socketid = '${socket.id}' WHERE email = '${data.email}';`,(error, results) => {
			connection.query(`select email,name,image from chatusers where socketid = '${socket.id}';`,(error, results) => {
				let user = results.rows[0];
				socket.broadcast.emit('profile_change',{'email':user.email,'name':user.name,'image':user.image,'isActive':true});
			});
			connection.query(`select email,name,image from chatusers where  email !='${data.email}' and isactive = true;`,(error, results) => {
				socket.emit('user_data',results.rows);
			});
		});
	});
	
  socket.on('message',(message)=>{
	connection.query(`select socketid from chatusers where  email = '${message.sender}';`,(error, results) => {
		let socketid = results.rows[0].socketid;
		connection.query(`select name,email from chatusers where  socketid = '${socket.id}';`,(error, results) => {
			let sender = results.rows[0];
			socket.to(socketid).emit("incomingMsg",{'email':sender.email,'sender':sender.name,'message':message.msg,'type':'incoming'});
		});
	});
  });
  
	socket.on('disconnect', () => {
		try {
			connection.query(`UPDATE chatusers SET isactive = false WHERE socketid = '${socket.id}';`,(error, results) => {
				if(error){
					throw new Error('No Record Find');
				}
				connection.query(`select email,name,image from chatusers where socketid = '${socket.id}';`,(error, results) => {
					let user = results.rows[0];
					if(error || user.email == undefined){
						throw new Error('No Record Find');
					}
					socket.broadcast.emit('profile_change',{'email':user.email,'name':user.name,'image':user.image,'isActive':false});
				});
				console.log("Diconnect",socket.id)
			});
		} 
		catch (error) {
			console.log('An error Occured',error);
		}
	});
});

server.listen(8080, () => {
  console.log('Signaling server listening on port 8080');
});


