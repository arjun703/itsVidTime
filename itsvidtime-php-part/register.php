<?php 
session_start();
if(isset($_POST['submit'])){
	require 'db.php';
	$loginId= trim(htmlspecialchars($_POST['loginId']));
	$password = trim($_POST['password']);
	$gender = $_POST['gender'];
	$dob = $_POST['dob'];
		$dbc = mysqli_connect($host,$user,$pass,$db);
		$loginId =mysqli_real_escape_string($dbc,$loginId);
		$gender = mysqli_real_escape_string($dbc,$gender);
		$dob = mysqli_real_escape_string($dbc,$dob);

		$query = "INSERT INTO registered (loginid,password,gender,dob,country,socketid) VALUES('".$loginId."','".sha1($password)."',".$gender.",'".$dob."','Nepal','') ";

		if(mysqli_query($dbc,$query)){
			$_SESSION['loginId'] = $loginId;
			header('location:index.php');
		}
		else{
			echo mysqli_error($dbc);
		}
}





 ?>