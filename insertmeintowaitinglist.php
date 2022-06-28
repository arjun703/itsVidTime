<?php 
session_start();
require 'db.php';
$dbc = mysqli_connect($host,$user,$pass,$db);
$mySocketId = $_GET['mySocketId'];
if(isset($_SESSION['loginId'])){
	$query = "UPDATE registered SET socketid = '".$mySocketId."' WHERE loginid = '".$_SESSION['loginId']."'  ";
}
else{
	$query = "INSERT INTO waiting VALUES ('".$mySocketId."') ";
}

mysqli_query($dbc,$query);


 ?>