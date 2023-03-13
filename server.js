/*********************** socket.io setup *****************************/

const { Server } = require("socket.io");

const io = new Server(
	{
		//cross orignin resource acces
		cors: {
			// the request coming from xampp localhost is not blocked
			//origin: "http://localhost"
			origin: "http://itsvidtime.rf.gd"			
		}
	}
);


/************dsdfs************* database details  ***********************************/

var mysql = require('mysql');

var connected =false;

var dbc = mysql.createConnection({
  host: "db4free.net",
  user: "itsvidtime",
  password: "Fawcdtgk789!",
  database: "itsvidtime"
});


dbc.connect(function(err){
	if(!err){
		//console.log('connected to database');
	}
	else{
		//console.log(err);
	}
})



/*********************** get socket id from given login Id ************/


function getSocketId(loginId){
const mySocketId = new Promise((resolve, reject) => {
	var sql = 'SELECT socketid FROM allusers WHERE loginid =  "'+loginId+'"';
	dbc.query(sql,function(err,result){
		if(!err&&result.length>0){
			//console.log(result);
			resolve(result[0].socketid);
		}
		else{
			resolve('');
		}
	})				
})
return mySocketId;	
}



/********************************* events *******************************/

// when user is conneted
io.on("connection", (socket) => {
  	console.log(socket.id+' connected'); // ojIckSD2jqNzOqIrAGzL
  	//to know when the user is disconnected
  	socket.on("disconnect", () => {
  		//console.log(socket.id+'disconnected')
		var sql = "DELETE FROM waiting WHERE socketid='"+socket.id+"'";
		dbc.query(sql,function(err,result){
			//handle error
			var sql = "SELECT * FROM  oncall  WHERE peer1='"+socket.id+"' OR peer2 = '"+socket.id+"'";
			dbc.query(sql, function (err, result){
				if(result.length>0){
					let otherPeer;
					if(result[0].peer1!=socket.id){
						otherPeer  = result[0].peer1
					}
					else{
						otherPeer  = result[0].peer2
					}
					socket.to(otherPeer).emit('otherPeerDisconnected',{})
					var sql = "DELETE FROM  oncall  WHERE peer1='"+socket.id+"' OR peer2 = '"+socket.id+"'";
					dbc.query(sql, function (err, result){})
				}
			});
		});	
	});

	socket.on("insertIntoWaiting",function(){
		var sql = "INSERT INTO waiting VALUES('"+socket.id+"')";
		dbc.query(sql, function (err, result){});
	})

	socket.on("outgoingMessage",async function(data){
	//	console.log('someone sent a new message');
		var socketIdOfMsgReceiver = await getSocketId(data.to);
		var loginIdOfMsgSender = await getLoginId(socket.id);
	//	console.log('notification sending to receiver: '+socketIdOfMsgReceiver+' by: '+loginIdOfMsgSender);
		if(loginIdOfMsgSender!=''&&socketIdOfMsgReceiver!=''){
			socket.to(socketIdOfMsgReceiver).emit("newMessage",{
				'from':loginIdOfMsgSender,
				'message':data.message
			})
	//		console.log('notification sent to receiver: '+socketIdOfMsgReceiver+' by: '+loginIdOfMsgSender);
		}
	})

	socket.on("isTyping",async function(data){
		//console.log('someone sent a new message');
		var socketIdOfMsgReceiver = await getSocketId(data.to);
		var loginIdOfMsgSender = await getLoginId(socket.id);
	//	console.log('isTyping notification sending to receiver: '+socketIdOfMsgReceiver+' by: '+loginIdOfMsgSender);
		if(loginIdOfMsgSender!=''&&socketIdOfMsgReceiver!=''){
			socket.to(socketIdOfMsgReceiver).emit("isTyping",{
				'from':loginIdOfMsgSender
			})
		//	console.log(' istyping notification sent to receiver: '+socketIdOfMsgReceiver+' by: '+loginIdOfMsgSender);
		}
	})

	socket.on("myCameraError",function(message){
		var to = message.to;
		socket.to(to).emit('otherPeerCameraError',{});
	})

	socket.on('offer',function(message){
		var to = message.to;
		var msg = {from: socket.id, offer:message.offer}
		socket.to(to).emit('offer',msg);
	})

	socket.on('answer',function(message){
		var to = message.to;
		var msg = {from:socket.id,answer:message.answer}
		socket.to(to).emit('answer',message)
	})

	socket.on('iceCandidate',function(message){
		var to = message.to;
		//console.log('incoming ice candeidate: to: '+to);
		var msg = {'iceCandidate':message.iceCandidate}
		socket.to(to).emit('iceCandidate',msg)
	})

});

/****** port at which clients send request / or server listens to*********/ 

// port while deploying

const port = process.env.PORT || 3000;

// port while running program in local machine
//const port = 3000;

io.listen(port);