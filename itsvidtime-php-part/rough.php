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

/*
$query= "SELECT *from waiting,registered";

$result = mysqli_query($dbc,$query) or die(mysqli_error($dbc));

while($row = mysqli_fetch_assoc($result)){
	print_r($row);
	echo '<br>';
}
*/

/*
$query = "ALTER TABLE registered DROP COLUMN socketid";

mysqli_query($dbc,$query) or die(mysqli_error($dbc));
*/
/*


*/

/*

$query = "ALTER TABLE waiting
ADD COLUMN loginid VARCHAR(20)";

mysqli_query($dbc,$query) or die(mysqli_error($dbc));

*/

$query = "select * 
  from information_schema.columns 
 where table_schema = 'itsvidtime' 
   and table_name = 'oncall'";

$result = mysqli_query($dbc,$query);


while($row=mysqli_fetch_assoc($result)){
	print_r($row['COLUMN_NAME']);
	echo '<br>';
}





 ?>