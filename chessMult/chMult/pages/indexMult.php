<?php
	/* 
		If a user chooses to play against someone, the user gets redirected to redirect.php 
		where information is given to the database. Like gameId and who is black who is white and so on
		
		The function DisplayMessage() in chatbox.js is diplaying the chats with a timeinterval. It also checks whether a user has 
		a gameId, if it does the user is also redirected to redirect.php
		If the information is already set it goes on the Ch/index.php and the connection has been made
	*/
	session_start();
	
	
	include "../classes/user.php";
	/* This is to delete gameId if gameId exists for a user and its opponent */
	$user = new user();
	if ($_SESSION['GameId']!=0){
		$user->DeleteGame($_SESSION['GameId']);
		$_SESSION['GameId']="";
	}
?>
<!DOCTYPE html>
<html lang="en">
	<META HTTP-EQUIV=Refresh; 
	<head>
	<link rel="stylesheet" href="../style/Style.css">
		<title>Chat Application Home</title>
		
	
	</head>
	<body>
	<h2>Welcome <span style="color:green"><?php
	echo $_SESSION['UserName'];
	?></span></h2>
	
	
		<div id="AvailablePlayers">
		</div>
		
		<div id="ChatMessages">
		</div>
	<div id="ChatBig"> 
		<span style="color:green">Chat</span><br/>
		<textarea id="ChatText" name="ChatText"></textarea>
	</div>
	
	<script src="../js/jquery.js"></script>	
	<script src="../js/availablePlayers.js"></script>
	<script src="../js/chatbox.js"></script>		
	</body>
</html>


		
	
	
	

