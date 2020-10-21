<!-- Login------------------------------------------------------------>	
<div class="container" >
	<div type="text" id="log">
		<div type="text" id="logform">
		<form action="chMult/pages/UserLogin.php">
			<input class="form-control"  placeholder="username" type="text" id="username" name="username" />
			<br/>
			<input class="btn btn-primary" type="submit" id="submit" value="login">
			<br/>
                </div>	
		<input type="submit" id="logout_submit" value="logout" style="display:none">
		</form>
		<div id="infoSQL" ></div>
	</div>
	</div>
<!-- Form------------------------------------------------------------>	
<div type="text" id="form_container" method="post" style="display:none">
	<div class="field">
		<label for="regusername">Choose a username</label>
		<input type="text" name="regusername" id="regusername" value="">
	</div>
	<div class="field">
		<label for="regpassword">Choose a password</label>
		<input type="password" name="regpassword" id="regpassword">
	</div>
	<div class="field">
		<label for="regpassword_again">Enter your password again</label>
		<input type="password" name="regpassword_again" id="regpassword_again">
	</div>
	
	<input type="submit" id="register_submit" value="Register">
</div>	
<!-- Form------------------------------------------------------------>	