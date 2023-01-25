<?php 
session_start();
if(isset($_SESSION['loginId'])){
	require 'db.php';
	$gender = $_GET['gender'];
	$dob = $_GET['dob'];
		$dbc = mysqli_connect($host,$user,$pass,$db);
		$gender = mysqli_real_escape_string($dbc,$gender);
		$dob = mysqli_real_escape_string($dbc,$dob);

		$query = "UPDATE registered SET  gender = ".$gender." ,  dob = '".$dob."' WHERE loginid = '".$_SESSION['loginId']."' ";

		if(mysqli_query($dbc,$query)){
			echo 'Data saved sucessfully';
		}
		else{
			echo mysqli_error($dbc);
		}
}
 ?>