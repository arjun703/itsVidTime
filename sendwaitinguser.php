<?php 
session_start();
require 'db.php';

$itsSocketId = $_GET['itsSocketId'];

$dbc = mysqli_connect($host,$user,$pass,$db);

if(isset($_SESSION['loginId'])){

	$preferredCountry = '';$preferredGender='';
	if(isset($_COOKIE['preferredCountry'])){
		$preferredCountry = $_COOKIE['preferredCountry'];
	}
	if(isset($_COOKIE['preferredGender'])){
		$preferredGender = $_COOKIE['preferredGender'];
	}
	
	$lowerAgeLimit = $_COOKIE['lowerAgeLimit'];
	$upperAgeLimit = $_COOKIE['upperAgeLimit'];

	$filters = array();

	if($preferredGender!=''){
		if($preferredGender=='Male'){
			$filters[0] = " gender = 1 ";
		}
		else{
			$filters[0] =  " gender = 0 ";
		}
	}

	if($lowerAgeLimit!=''&&$upperAgeLimit!=''){
		$lowerAgeLimit = 86400*$lowerAgeLimit*365;
		$upperAgeLimit = 86400*$upperAgeLimit*365;
		$filters[1] = " TIMESTAMPDIFF(SECOND,dob,NOW()) BETWEEN ".$lowerAgeLimit." AND ".$upperAgeLimit."  ";
	}


/*
	if($preferredCountry!=''){
		$filters[2] = " country like '%".$preferredCountry."%' ";
	}
*/
	$filter = "";

	for($i=0;$i<sizeof($filters);$i++){
		if(isset($filters[$i])){
			$filters[$i]= " AND ".$filters[$i];
			$filter.=" ".$filters[$i]." ";
		}
	}

	//echo 'size of filter: '.sizeof($filters);

	$filter = trim($filter);
	//echo 'filter: '.$filter;

	$query  = "SELECT socketid FROM waiting,registered WHERE registered.loginid = waiting.loginid AND  socketid NOT IN (".$itsSocketId."') ".$filter."  UNION SELECT socketid FROM waiting WHERE socketid NOT IN(".$itsSocketId."') LIMIT 1";

	//echo $query;

	$result = mysqli_query($dbc,$query) or die(mysqli_error($dbc));

	if(mysqli_num_rows($result)==0){		
			$socketid = '';
			$query  = "INSERT INTO waiting (socketid,loginid) VALUES
											('".$itsSocketId."','".$_SESSION['loginId']."')  ";
			mysqli_query($dbc,$query);
	}
	else{
		$row = mysqli_fetch_assoc($result);
		$socketid = $row['socketid'];
		$query = "INSERT INTO oncall VALUES ('".$itsSocketId."','".$socketid."') ";

		mysqli_query($dbc,$query);
	}
}
else{

	$query = "SELECT socketid FROM waiting WHERE socketid NOT IN ('".$itsSocketId."') AND loginid = '' limit 1 ";

	$result = mysqli_query($dbc,$query);

	if(mysqli_num_rows($result)==1){
		$row= mysqli_fetch_assoc($result);
		$socketid = $row['socketid'];
		
		$query = "DELETE FROM waiting WHERE socketid = '".$socketid."' OR socketid = '".$itsSocketId."' ";
		mysqli_query($dbc,$query);

		$query = "INSERT INTO oncall VALUES ('".$socketid."','".$itsSocketId."') ";
		mysqli_query($dbc,$query) or die(mysqli_error($dbc));
	}
	else{
		$socketid = '';
		$query = "INSERT INTO waiting(socketid,loginid) VALUES ('".$itsSocketId."','') ";
		mysqli_query($dbc,$query);
	}
}

echo json_encode(array('socketId'=>$socketid));

 ?>