function setStatusMessage(status,msg,persistence){

	var previousMsgs = document.getElementsByClassName('statusMsgHolder');

	for(var i=0;i<previousMsgs.length;i++){
		previousMsgs[i].remove()
	}

	let newDiv = document.createElement('div');
	newDiv.className="statusMsgHolder"

	let newTable = document.createElement('table')
	newTable.className="statusMsg";
	var newRow =document.createElement('tr');
	var newHeading = document.createElement('th');
	var newIcon =document.createElement('i');
	switch(status){
		case 'progress':
		newIcon.className="fa fa-spinner fa-spin";
		break;
		case 'success':
		newIcon.className="fa fa-check success";
		break;
		case 'sad':
		newIcon.className = "fas fa-sad-tear fa-3x"
		break;
		case 'happy':
		newIcon.className = "fas fa-grin-hearts fa-3x";
		break;
		case 'info':
		newIcon.className = "fa fa-info-circle";
	}
	newHeading.appendChild(newIcon);
	var newHeading2 = document.createElement('td');
	newHeading2.innerText= msg+'...';

	if(!persistence){
		setTimeout(function(){
			newDiv.classList.add('removeAnimation');
			setTimeout(function(){
				newDiv.remove()
			},800)
		},4000)
	}

	newRow.appendChild(newHeading)
	newRow.appendChild(newHeading2)

	if(persistence){
		var newHeading3 = document.createElement('th');
		var newIcon = document.createElement('i');
		newHeading3.appendChild(newIcon);
		newIcon.className="fa fa-close close "
		newHeading3.onclick=function(){
			newDiv.classList.add('removeAnimation');
			setTimeout(function(){
				newDiv.remove()
			},800)
		}
		newRow.appendChild(newHeading3)
	}

	newTable.appendChild(newRow);
	newDiv.appendChild(newTable);

	document.body.appendChild(newDiv);
	newDiv.classList.add('incomingAnimation');

}


var policyNoti =document.getElementById('policyNoti');

var actionBtn = document.getElementById('actionBtn');

var actionBtnInfo =document.getElementById('btnInfo');

var actionBtnIcon = document.getElementById('actionBtnIcon');

function closeVideoCall(){

fetch('insertmeintowaitinglist.php?mySocketId='+socketId)

if (myPeerConnection) {
    myPeerConnection.ontrack = null;
    myPeerConnection.onicecandidate = null;
    myPeerConnection.onnegotiationneeded = null;

    if (remoteVideo.srcObject) {
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
    }

    if (ownVideo.srcObject) {
      ownVideo.srcObject.getTracks().forEach(track => track.stop());
    }
    console.log('closing connection..');
    myPeerConnection.close();
    myPeerConnection =null;
  }

  remoteVideo.removeAttribute("src");
  remoteVideo.removeAttribute("srcObject");
  ownVideo.removeAttribute("src");
  remoteVideo.removeAttribute("srcObject");

  otherPeerSocketId = null;
  videosContainer.style.display="none";


	actionBtnInfo.innerText = "Retry";
	actionBtnIcon.className="fa fa-caret-right";
	actionBtn.style.backgroundColor="green";
	actionBtn.onclick=function(){initiateCallProcess()}
	setStatusMessage('info','Connection closed. You are now on waiting list. Someone can call you automatically. So, stay here for sometime.', true);
	actionBtn.style.display="block";

}


function handleGetUserMediaError(e) {
	switch(e.name) {
	case "NotFoundError":
	  alert("Unable to open your call because no camera and/or microphone " +
	        "were found.");
	  break;
	case "SecurityError":
	case "PermissionDeniedError":
	  // Do nothing; this is the same as the user canceling the call.
	  break;
	default:
	  alert("Error opening your camera and/or microphone: " + e.message);
	  break;
	}
	socket.emit('myCameraError',{to:otherPeerSocketId});
	closeVideoCall();
	}



function initiateCallProcess(){

	policyNoti.style.display="none";

	actionBtn.style.display = "none";

	setStatusMessage('progress','Searching users',true);
	fetch('sendwaitinguser.php?itsSocketId='+socketId)
	.then(function(response){
		return response.json()
	})
	.then(function(data){
		if(data.socketId!=''){
			setStatusMessage('happy','A user found. Please wait....',true);
			proceedCall(data.socketId);
		}
		else{
			setStatusMessage('sad','No users right now. You are now on waiting list. Someone can call you automatically. So, stay here for sometime..',true);
			actionBtnInfo.innerText = "Retry";
			actionBtnIcon.className="fa fa-refresh";
			actionBtn.style.display="block";
		}
	})
}

const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

var videosContainer = document.getElementById('videosContainer');

var ownVideo  =document.getElementById('ownVideo');

var remoteVideo = document.getElementById('remoteVideo');


var mediaConstraints = {
  audio: true, // We want an audio track
  video: true // ...and we want a video track
};


function handleICECandidateEvent(event) {
  //console.log('own icecandidate');
  if (event.candidate) {
   // 	console.log(event.candidate);
    	var msg = {to:otherPeerSocketId,iceCandidate:event.candidate}
        socket.emit('iceCandidate',msg);
  }
}

function handleTrackEvent(event) {
//  remoteVideo.srcObject = event.streams[0];
	var [remoteStream] = event.streams;
    remoteVideo.srcObject = remoteStream;

}

function handleNegotiationNeededEvent() {
	myPeerConnection.createOffer().then(function(offer) {
		return myPeerConnection.setLocalDescription(offer);
	})
	.then(function() {
		var msg = {
		  to: otherPeerSocketId,
		  offer: myPeerConnection.localDescription
		}
		socket.on('answer',function(message){
		//	console.log('answer to an offer: '+message.answer);
			var desc = new RTCSessionDescription(message.answer);
			myPeerConnection.setRemoteDescription(desc);
		})
		socket.emit('offer',msg);

	})
	.catch(reportError);
}

function handleConnectionStateChangeEvent(event){
	switch(myPeerConnection.connectionState){
		case 'connecting':
		setStatusMessage('progress','connecting....',true);
		break;
		case 'connected':
		setStatusMessage('success','connected',false);
		actionBtnInfo.innerText = "Stop";
		actionBtnIcon.className  ="fa fa-phone";
		actionBtn.style.backgroundColor = "red";
		actionBtn.onclick=function(){closeVideoCall()}
		actionBtn.style.display="block";
		break;
		
		case 'disconnected':
		closeVideoCall();
		//alert('disconnected');
		break;
	}
}


var myPeerConnection = null;

function createPeerConnection() {
	myPeerConnection = new RTCPeerConnection({
	  iceServers: [     // Information about ICE servers - Use your own!
	    {
	      urls: "stun:stun.l.google.com:19302"
	    },
		{
	      urls: "stun:openrelay.metered.ca:80",
	    },
	    {
	      urls: "turn:openrelay.metered.ca:80",
	      username: "openrelayproject",
	      credential: "openrelayproject",
	    },
	    {
	      urls: "turn:openrelay.metered.ca:443",
	      username: "openrelayproject",
	      credential: "openrelayproject",
	    },
	    {
	      urls: "turn:openrelay.metered.ca:443?transport=tcp",
	      username: "openrelayproject",
	      credential: "openrelayproject",
	    }
	  ]
	});

	myPeerConnection.onicecandidate = handleICECandidateEvent;
	myPeerConnection.ontrack = handleTrackEvent;
	myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
	myPeerConnection.onconnectionstatechange = handleConnectionStateChangeEvent;
}

var otherPeerSocketId;

async function proceedCall(withh){

otherPeerSocketId = withh;

if(myPeerConnection){
	alert('you can\'t start a call. Already on a call.');
}
else{
	createPeerConnection();
	navigator.mediaDevices.getUserMedia(mediaConstraints)
	.then(function(localStream) {
	  ownVideo.srcObject = localStream;
	  localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
		videosContainer.style.display = "block";
		window.scrollBy({
		  top: window.innerHeight,
		  left: 0,
		  behavior: 'smooth'
		});

	})
	.catch(handleGetUserMediaError);
	}

}



async function processIncomingOffer(message){

if(!myPeerConnection){

	actionBtn.style.display="none";

	var localStream = null

	otherPeerSocketId = message.from;	

	createPeerConnection();

	setStatusMessage('progress','Incoming call. Please wait',true);

	//console.log('incoming offer: '+message.offer);

	var desc = new RTCSessionDescription(message.offer);

	myPeerConnection.setRemoteDescription(desc).then(function () {
		return navigator.mediaDevices.getUserMedia(mediaConstraints);
	})
	.then(function(stream) {
		localStream = stream;
		ownVideo.srcObject = localStream;
		localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
		videosContainer.style.display = "block";
		window.scrollBy({
		  top: window.innerHeight,
		  left: 0,
		  behavior: 'smooth'
		});
	})
	.then(function() {
		return myPeerConnection.createAnswer();
	})
	.then(function(answer) {
		return myPeerConnection.setLocalDescription(answer);
	})
	.then(function() {
		var msg = {
		  to: otherPeerSocketId,
		  answer: myPeerConnection.localDescription
		};
		socket.emit('answer',msg);
	})
	.catch(handleGetUserMediaError);
}

}


async function  processIncomingIceCandidates(message){
	if(message.iceCandidate){
		await myPeerConnection.addIceCandidate(message.iceCandidate);
		//console.log('incoming candindate: ');
		//console.log(message.iceCandidate)
	}
}
