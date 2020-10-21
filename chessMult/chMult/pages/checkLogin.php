<?php
session_start();
include_once("../connectToDB.php");
	
if (isset($_POST['username'])) {	
	$username = $_POST['username'];
	$sql = $_db->query("SELECT * FROM users WHERE UserName='$username' AND userauth='1' LIMIT 1"); // query the person

// ------- MAKE SURE PERSON EXISTS IN DATABASE ---------
	$existCount = $sql->rowCount(); // count the row nums
	if ($existCount == 0) { // evaluate the count
		 $_SESSION['username'] = false;
		 $output = array('msg'=>'Hello $uname  with id $id', 'loggedin'=>'false');
	}

	if ($existCount > 0) {
	    while($row = $sql->fetch(PDO::FETCH_ASSOC)){ 
             $id = $row["UserId"];
			 $uname = $row["UserName"];
			 $pword = $row["UserPassword"];
			 //$pword = $row["password"];
			 
        }
    $_SESSION['username'] = $uname; // the seesions user name and password is set and we can use it in another pagges
	$_SESSION['userpassword'] =$pword;
		$output = array("msg"=>"Hello $uname! ", "loggedin"=>"true");
    } 
	echo json_encode($output);
}
?>