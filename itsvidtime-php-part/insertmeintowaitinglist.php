<?php 
session_start();
require 'db.php';
$dbc = mysqli_connect($host,$user,$pass,$db);
$mySocketId = $_GET['mySocketId'];
if(isset($_SESSION['loginId'])){
	$loginId = $_SESSION['loginId'];
}
else{
	$loginId = '';
}

$query = "INSERT INTO waiting(socketid,loginid) VALUES ('".$mySocketId."','".$loginId."') ";

mysqli_query($dbc,$query);

$query = "DELETE FROM oncall WHERE peer1 = '".$mySocketId."' OR peer2 = '".$mySocketId."' ";

mysqli_query($dbc,$query);


 ?>