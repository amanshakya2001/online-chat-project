// Importing necessary libraries.
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { Client } = require('pg');
const moment = require('moment-timezone');
const { instrument } = require("@socket.io/admin-ui");


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
    origin: ['http://localhost:3000','https://online-chat-frontend.onrender.com','https://chat.amanshakya.tech','https://admin.socket.io'],
    methods: ['GET', 'POST']
  }
});


instrument(io, {
	auth: false
});


io.on('connection', (socket) => {
	try{
		console.log('A user connected with',socket.id);
		// Get User data when first time login
		socket.on('user_login_first_time',(data)=>{
			connection.query(`Insert into chatusers(email,name,image,isactive,socketid) values('${data.email}','${data.name}','${data.image}',true,'${socket.id}');`,(error, results) => {
				console.log(data.email,"logined as",socket.id)
				try{
					socket.broadcast.emit('profile_change',{'email':data.email,'name':data.name,'image':data.image,'isActive':true});
				}
				catch(error){
					console.log('An error Occured',error.message)
				}
				connection.query(`select email,name,image from chatusers where  email !='${data.email}' and isactive = true;`,(error, results) => {
					try{
						socket.emit('user_data',results.rows);
					}
					catch(error){
						console.log('An error Occured',error.message)
					}
				});
			});
		});

		// Get user active when user login 
		socket.on('user_login',(data)=>{
			console.log(data.email,"logined as",socket.id)
			connection.query(`UPDATE chatusers SET isactive = true, socketid = '${socket.id}' WHERE email = '${data.email}';`,(error, results) => {
				connection.query(`select email,name,image from chatusers where socketid = '${socket.id}';`,(error, results) => {
					let user = results.rows[0];
					// Broadcast that profile all user
					try{
						socket.broadcast.emit('profile_change',{'email':user.email,'name':user.name,'image':user.image,'isActive':true});
					}
					catch(error){
						console.log('An error Occured',error.message)
					}
				});
				connection.query(`select email,name,image from chatusers where  email !='${data.email}' and isactive = true;`,(error, results) => {
					// send all user, who are online ,data to the socket
					try{
						socket.emit('user_data',results.rows);
					}
					catch(error){
						console.log('An error Occured',error.message)
					}
				});
			});
		});
		
		// Getting message from a user
		socket.on('message',(message)=>{
			connection.query(`select socketid,connect_user from chatusers where  email = '${message.sender}';`,(error, results) => {
				let socketid = results.rows[0].socketid;
				let connect_user = results.rows[0].connect_user;
				connection.query(`select name,email from chatusers where  socketid = '${socket.id}';`,(error, results) => {
					let sender = results.rows[0];
					if(connect_user !== sender.email){
						// if user is not active for that chat send notification too
						try{
							socket.to(socketid).emit("notification",sender.email);
						}
						catch(error){
							console.log('An error Occured',error.message)
						}
					}
					// Broadcast that to to specific user socket
					try{
						socket.to(socketid).emit("incomingMsg",{'email':sender.email,'sender':sender.name,'message':message.msg,'type':'incoming'});
					}
					catch(error){
						console.log('An error Occured',error.message)
					}
				});
			});
		});

		// set a user active with which user
		socket.on('set_online_user',(email)=>{
			connection.query(`UPDATE chatusers SET connect_user = '${email}' WHERE socketid = '${socket.id}';`,(error, results) => {
				if(error){
					console.log(error)
				}
			});
		})

		// When user calls
		socket.on('callUser',(email)=>{
			connection.query(`select socketid from chatusers where email = '${email}';`,(error, results) => {
				let calledSocketId = results.rows[0].socketid;
				connection.query(`select email,name from chatusers where socketid = '${socket.id}';`,(error, results) => {
					let {email,name} = results.rows[0];
					socket.to(calledSocketId).emit('incomingCall',{'callerEmail':email,'callerName':name});
				});
			});
		})

		// When call Ended
		socket.on('callEnded',(email)=>{
			connection.query(`select socketid from chatusers where email = '${email}';`,(error, results) => {
				let calledSocketId = results.rows[0].socketid;
				try{
					connection.query(`select email from chatusers where socketid = '${socket.id}';`,(error, results) => {
						let callerEmail = results.rows[0].email;
						try{
							socket.to(calledSocketId).emit('callEnded',callerEmail);
						}
						catch(error){
							console.log('An error occure',error.message)
						}
					});
				}
				catch(error){
					console.log('An Error Occure',error.message)
				}
			});
		})
		
		// When user get disconnect
		socket.on('disconnect', () => {
			try {
				connection.query(`UPDATE chatusers SET isactive = false,connect_user = NULL WHERE socketid = '${socket.id}';`,(error, results) => {
					connection.query(`select email,name,image from chatusers where socketid = '${socket.id}';`,(error, results) => {
						let user = results.rows[0];
						// Broadcast to all user that socket get offline
						try{
							socket.broadcast.emit('profile_change',{'email':user.email,'name':user.name,'image':user.image,'isActive':false});
						}
						catch(error){
							console.log('An error Occured',error.message)
						}
					});
					console.log("Diconnect",socket.id)
				});
			} 
			catch (error) {
				console.log('An error Occured',error.message);
			}
		});
	}
	catch(error){
		console.log('An Error Occure',error.message)
	}
});

server.listen(8080, () => {
  console.log('Server Start at 8080 Port');
});


