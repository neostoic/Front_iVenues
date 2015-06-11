<?php


$db_server["host"] = "Localhost"; //database server
$db_server["username"] = "root"; // DB username
$db_server["password"] = ""; // DB password
$db_server["database"] = "likeit";// database name


//Connection with database
$connection = mysqli_connect($db_server["host"], $db_server["username"], $db_server["password"],$db_server["database"] );


//$firstname = $_POST['fname'];
$firstname = "takis";

//$lastname = $_POST['lname'];
$lastname = "takoglous";

//$email = $_POST['email'];
$email = "trolis";

//$username = $_POST['username'];
$username = "testtest";

//$pass = $_POST['pass'];
$pass = "testpass21";






$data = new stdclass();
$data->response = array();


$query5 = "INSERT into users (firstname,lastname,username,email,password)VALUES ('$firstname','$lastname' ,'$username' , '$email' , '$hash')";

$result8 = mysqli_query($connection,$query5);

$result = new stdclass();
$result->status = "OK" ;

$data->response[] = $result;

echo json_encode($data);



?>
