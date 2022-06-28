<?php 
session_start();
 ?>
<!DOCTYPE html>
<html>
<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>itsVidTime Login || Register</title>
	<style type="text/css">
		body{
			background:black;
			color:white;
			font-family: arial,sans-serif,serif
		}
		h1{
			color:skyblue;
			text-align: center;
		}
		#formContainer{
				margin-left:50%;
				border:2px solid white;
				padding: 15px;
				transform: translateX(-50%); 
				box-shadow: 5px 8px 8px rgba(0,0,0,0.15);	
		}
		@media only screen and (max-width:2000px){
			#formContainer{
				width:350px;	
			}
		}

		@media only screen and (max-width:500px){
			#formContainer{
				width:90%;	
			}
		}

		table{
			table-layout: fixed;
			width: 100%;
		}
		table th{
			padding: 5px;
			border-radius: 5px;
			font-size: 20px;
		}
		.active{
			color:skyblue;
			border-bottom: 4px solid skyblue;
		}
		.passive{
			background: rgba(0,0,0,0.05);
		}
		.passive:hover{
			color:blue;
			cursor:pointer;
		}
		
		input[type=text],input[type=password],input[type=submit]{
			width:100%;
			padding:8px;
			margin-top: 20px;
			box-sizing: border-box;
		}
		input[type=submit]{
			background: blue;
			color:white;
			transition: all 0.5s;
			font-size: 16px;
			font-weight: bold;
			border:3px solid blue;
		}
		input[type=submit]:hover{
			background: white;
			cursor: pointer;
			color:blue;
		}
		#registerForm{
			display: none;
		}
	</style>
</head>
<body>
	<script type="text/javascript">
		function showLoginForm(){
			loginTab.className = "active";
			registerTab.className="passive";
			registerForm.style.display="none";
			loginForm.style.display="block";
		}
		function showRegisterForm(){
			loginTab.className="passive";
			registerTab.className="active";
			loginForm.style.display="none";
			registerForm.style.display="block";
		}
	</script>
	<h1>itsVidTime</h1>
<div id="formContainer">
	<table id="fixedTable">
		<tr>
			<th id="loginTab" class="active" onclick="showLoginForm()">Login</th>
			<th id="registerTab" class="passive" onclick="showRegisterForm()">Register</th>
		</tr>
	</table>
	<div id="loginForm">
		<form class="formm" method="POST" action="login.php">
			<input required type="text" name="loginId" placeholder="Login_Id">
			<input required type="password" name="password" placeholder="Password">
			<input type="submit" name="submit" value="Login">
		</form>
	</div>
	<div id="registerForm">
		<form class="formm" method="POST" action="register.php">
			<input type="text" required name="loginId" placeholder="Login_Id ( username )">
			<input type="password" required  name="password" placeholder="Password">
			<p>Choose Your Gender</p>
			<input type="radio" name="gender" value="1" id="male" required>
			<label for="male">Male</label>
			<input type="radio" id="female" id="female" name="gender" value="0" required>
			<label for="female">Female</label>
			<p>Enter Date of Birth</p>
			<input type="date" name="dob" required>
			<input type="submit" name="submit" value="Register">
		</form>
	</div>
</div>
</body>
</html>

<?php 
if(isset($_POST['submit'])){
	$loginId = $_POST['loginId'];
	$password = $_POST['password'];
	require 'db.php';
	$dbc = mysqli_connect($host,$user,$pass,$db);
	$query = "SELECT loginid from registered WHERE loginid = '".$loginId."' and password = '".sha1($password)."' ";
	if(mysqli_num_rows(mysqli_query($dbc,$query))==1){
		$_SESSION['loginId']=$loginId;
		header('location: index.php');
	}
	else{
		echo '<h3>Incorrect username or password</h3>';
	}
}
?>