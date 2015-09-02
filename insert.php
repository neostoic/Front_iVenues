<?php


$db_server["host"] = "Localhost"; //database server
$db_server["username"] = "root"; // DB username
$db_server["password"] = ""; // DB password
$db_server["database"] = "ivenues";// database name


//Connection with database
$connection = mysqli_connect($db_server["host"], $db_server["username"], $db_server["password"],$db_server["database"] );



$data = json_decode(file_get_contents("php://input"));


$task = mysql_real_escape_string($data->task);

$query = mysql_real_escape_string($data->query);

$radius = mysql_real_escape_string($data->radius);

$location = mysql_real_escape_string($data->location);

$ivenues = mysql_real_escape_string($data->ivenues);

$foursquare = mysql_real_escape_string($data->foursquare);

$google = mysql_real_escape_string($data->google);

$yelp = mysql_real_escape_string($data->yelp);







$data = new stdclass();
$data->response = array();


$query5 = "INSERT into ivenues_table (task,query,radius,location,iVenues,Foursquare,Google,Yelp)VALUES ('$task','$query' ,'$radius' , '$location' , '$ivenues','$foursquare' , '$google' , '$yelp')";

$result8 = mysqli_query($connection,$query5);

$result = new stdclass();
$result->status = "OK" ;

$data->response[] = $result;

echo json_encode($data);



?>
