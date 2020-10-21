<?php
if(!session_id()) session_start();



/* $dbhost 	= '';
$dbname		= '';
$dbuser		= '';
$dbpass		= ''; 
For Live server!!!
*/

$dbhost 	= "localhost";
$dbname		= "chessmult";
$dbuser		= "root";
$dbpass		= "123123";
 
// database connection
try{
	$_db = new PDO("mysql:host=$dbhost;dbname=$dbname",$dbuser,$dbpass, array(
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8", 
					PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_PERSISTENT => true
                ));	
}catch(Excepion $e){
	die("ERROR : ".$e->getMessage());
}
?>