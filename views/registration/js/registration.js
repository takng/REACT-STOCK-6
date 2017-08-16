$(document).ready(function(){

$("#register").click(function(){

	var name = $("#name").val();
	var email = $("#email").val();
	var password = $("#password").val();
	var cpassword = $("#cpassword").val();

	if( name =='' || email =='' || password =='' || cpassword =='')
		{
		  alert("Please fill all fields...!!!!!!");
		}
	else if((password.length)<8)
		{
			alert("Password should atleast 8 character in length...!!!!!!");
		}

	else if(!(password).match(cpassword))
		{
			alert("Your passwords don't match. Try again?");
		}

	else
	   {
	     $.post("register.php",{ name1: name, email1: email, password1:password},
		  function(data) {
		   if(data=='You have Successfully Registered.....')
		   {
			$("form")[0].reset();
		   }
		   alert(data);
		});
	   }

	});

});

// Register
app.post("/register",
  (req, res) => {
    knex("users")
    .count("name")
    .where("name", req.body.name)
    .then((results) => {
      if(results[0].count == 0){
        knex("users")
        .insert({
          name: req.body.name,
          email: req.body.email,
          password: req.body.email,
        })
        .returning("id")
        .then((results) => {
          // Attempt to login
          res.redirect(307, '/login')
        })
      }
    })
  })


