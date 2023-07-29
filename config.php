<?php
$db_host = "us-cdbr-east-06.cleardb.net";
$db_user = "b00f58f2d57c0a";
$db_pass = "ced41a47";
$db_name = "heroku_ed9831413433ec2";

$connect = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$connect) {
    die("Database connection error: " . mysqli_connect_error());
}
?>