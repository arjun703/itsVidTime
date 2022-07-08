<?php
session_start();
require 'db.php';

$dbc = mysqli_connect($host,$user,$pass,$db);

$query = "SELECT COUNT(socketid) as total FROM waiting ";

$result = mysqli_query($dbc,$query);

$row = mysqli_fetch_assoc($result);

$totalActiveUsers  = $row['total'];

if(isset($_SESSION['loginId'])){
	$query = "SELECT  gender, dob FROM registered WHERE loginId = '".$_SESSION['loginId']."' ";

	$result = mysqli_query($dbc,$query);

	$row = mysqli_fetch_assoc($result);

	echo json_encode(array('totalActiveUsers'=>$totalActiveUsers,'loginId'=>$_SESSION['loginId'],'gender'=>$row['gender'],'dob'=>$row['dob']));

}
else{
	echo json_encode(array('totalActiveUsers'=>$totalActiveUsers));
}



 ?>