<?php 


$host = 'db4free.net';
$user = 'itsvidtime';
$pass = 'Fawcdtgk789!';
$db = 'itsvidtime';






$dbc = mysqli_connect($host,$user,$pass,$db) or die(mysqli_error($dbc));

/*
$file = 'itsvidtime.sql';

if($fp = file_get_contents($file)) {
  $var_array = explode(';',$fp);
  foreach($var_array as $value) {
    mysqli_query($dbc,$value) or die(mysqli_error($dbc));
  }
}

*/

$query= "SELECT *from registered";

$result = mysqli_query($dbc,$query) or die(mysqli_error($dbc));

while($row = mysqli_fetch_assoc($result)){
	print_r($row);//.'<br>';
}




 ?>