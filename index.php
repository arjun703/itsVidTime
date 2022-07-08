<?php 
session_start();
// check whethere the user is previously logged in 
// if yes. then login now as welll

 ?>

 <!DOCTYPE html>
 <html>
 <head>
 	<title>itsVidTime</title>
 	<meta name="viewport" content="width=device-width, initial-scale=1.0">
 	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
 	<link rel="stylesheet" type="text/css" href="stylee.css">
 	<script type="text/javascript" src="miscfunctions.js"></script>
 		<script src="https://cdn.socket.io/4.5.0/socket.io.min.js" integrity="sha384-7EyYLQZgWBi67fBtVxw60/OWl1kjsfrPFcaU0pp0nAh+i8FD068QogUvg85Ewy1k" crossorigin="anonymous"></script>
 	<script type="text/javascript" src="totalcountries.js"></script>
 	<script type="text/javascript" src="globalvars.js"></script>
 </head>
 <body>
 <div  class="hdr">
 	<table class="fixedTable">
 		<tr>
 			<th><span class="siteName">itsVidTime</span></th>
 			<?php if(!isset($_SESSION['loginId'])){
 				echo '<th><a href="login.php" class="btn loginBtn">Login</a></th>';
 			}
 			else{
 				echo '<th  onclick="showUserDetails()"><i style="font-size:35px" class="fa fa-user-circle"></i></th>';
 			 }
 			 ?>
 			<th id="noOfActiveUsers" class="animated"></th>
 		</tr>
 	</table>
 </div>
 <h3 class="divTitle">Your Preferences</h3>
<script type="text/javascript">
	createSetPreferencesForm();
</script>



<script type="text/javascript">

var boundingRect = ageSelector.getBoundingClientRect();
var sliderX = boundingRect.x;

//lower and upper age containers in UI
var lowerHolder =document.getElementById('lowerHolder')
var upperHolder = document.getElementById('upperHolder')

//contains values of initially lowar and uppper

var lower = readCookie('lowerAgeLimit');
var upper  = readCookie('upperAgeLimit');

if(lower==''){
	lower = 25;
}
if(upper==''){
	upper=40;
}


displayThumbs(lower,upper);


displayHintSpan(lower,upper);


filloutAges();

</script>

<h3 class="divTitle">Video Chat With Strangers</h3>

<p id="policyNoti">By clicking start button below, you agree to our <a style="padding: 5px;border-bottom: 3px solid skyblue" href="termsofservice.html"> Terms of Service</a>.</p>

<div id="videosContainer">
<video id="ownVideo" autoplay="autoplay" muted="muted" ></video>
<video id="remoteVideo" autoplay="autoplay" ></video>
</div>
<button class="btn startBtn" id="actionBtn" onclick="initiateCallProcess()">
	<span id="btnInfo">Start</span>
	<i class="fa fa-caret-right " id="actionBtnIcon"></i>
</button>


 	<script type="text/javascript" src="videocall.js"></script>


<script type="text/javascript">
	
	const socket = io(socketURL);

	var socketId;

	socket.on("connect",function(){
		socketId = socket.id;
	})


	fetch('sendloginstatus.php')
	.then(function(response){
		return response.json();
	})
	.then(function(data){
		userDetails=data;
		console.log(userDetails);
		var totalActiveUsers = data.totalActiveUsers;
		var noOfActiveUsersHolder = document.getElementById('noOfActiveUsers');
		noOfActiveUsersHolder.innerText = totalActiveUsers+'  active';
		noOfActiveUsersHolder.classList.remove('animated');
	})

	socket.on('otherPeerCameraError',function(message){
		closeVideoCall();
	})

	socket.on('offer',function(message){
		processIncomingOffer(message);
	})

	socket.on('iceCandidate',function(message){
		processIncomingIceCandidates(message);
	})

	socket.on('otherPeerDisconnected',function(message){
		closeVideoCall()
	})

</script>


 </body>
 </html>