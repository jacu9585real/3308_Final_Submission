/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// imports the pg-promise module and assigns it to the pgp variable.
// creates Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'micro_db',
	user: 'postgres',
	password: 'dbpass1'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



/*********************************
 Below we'll add the get & post requests which will handle:
   - Database access
   - Parse parameters from get (URL) and post (data package)
   - Render Views - This will decide where the user will go after the get/post request has been processed

 Web Page Requests:

  Login Page:        Provided For your (can ignore this page)
  Registration Page: Provided For your (can ignore this page)
  Home Page:
  		/home - get request (no parameters) 
  				This route will make a single query to the favorite_colors table to retrieve all of the rows of colors
  				This data will be passed to the home view (pages/home)

  		/home/pick_color - post request (color_message)
  				This route will be used for reading in a post request from the user which provides the color message for the default color.
  				We'll be "hard-coding" this to only work with the Default Color Button, which will pass in a color of #FFFFFF (white).
  				The parameter, color_message, will tell us what message to display for our default color selection.
  				This route will then render the home page's view (pages/home)

  		/home/pick_color - get request (color)
  				This route will read in a get request which provides the color (in hex) that the user has selected from the home page.
  				Next, it will need to handle multiple postgres queries which will:
  					1. Retrieve all of the color options from the favorite_colors table (same as /home)
  					2. Retrieve the specific color message for the chosen color
  				The results for these combined queries will then be passed to the home view (pages/home)

  		/team_stats - get request (no parameters)
  			This route will require no parameters.  It will require 3 postgres queries which will:
  				1. Retrieve all of the football games in the Fall 2018 Season
  				2. Count the number of winning games in the Fall 2018 Season
  				3. Count the number of lossing games in the Fall 2018 Season
  			The three query results will then be passed onto the team_stats view (pages/team_stats).
  			The team_stats view will display all fo the football games for the season, show who won each game, 
  			and show the total number of wins/losses for the season.

  		/player_info - get request (no parameters)
  			This route will handle a single query to the football_players table which will retrieve the id & name for all of the football players.
  			Next it will pass this result to the player_info view (pages/player_info), which will use the ids & names to populate the select tag for a form 
************************************/

// home page
app.get('/', function(req, res) {
    console.log('hello');
	res.render('pages/home',{
		local_css:"signin.css", 
		my_title:"Login Page"
	});
});

// registration page 
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});

// login page 
app.get('/login', function(req, res) {
	res.render('pages/login',{
		my_title:"Login Page"
	});
});

// map page 
app.get('/worldMap', function(req, res) {
    var coords = 'select * from rock_attributes;';
    //var two = 'select id, name from football_players;'
    db.task('get-everything', task => {
        return task.batch([
            task.any(query),
            //task.any(two)
        ]);
    })
    .then(rows=>{
	res.render('pages/worldMap',{
		my_title:"World Map"
	});
});

// gallary page 
app.get('/Gallery', function(req, res) {
	res.render('pages/Gallery',{
		my_title:"Micro Gallery"
	});
});

// home page 
//app.get('/home', function(req, res) {
//	res.render('pages/home',{
//		my_title:"home"
//	});
//});
//
// submit page 
app.get('/newMeteoriteSubmissionForm', function(req, res) {
	res.render('pages/newMeteoriteSubmissionForm',{
		my_title:"Submit Meteorite"
	});
});



/*Add your other get/post request handlers below here: */
// below is current work jk
app.get('/home', function(req, res) {
	var query = 'select * from end_usr;';
	db.any(query)
        .then(function (rows) {
            console.log(rows); 
            res.render('pages/home',{
				my_title: "Home Page",
				data: rows,
				color: '',
				color_msg: ''
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            res.render('pages/home', {
                title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
        });db.any('CREATE TABLE IF NOT EXISTS testtable(someID integer PRIMARY KEY);')
});

app.get('/newMeteoriteSubmissionForm/submit', function(req, res) {
    res.render('pages/newMeteoriteSubmissionForm',{
         my_title:"Submit Meteorite"
     });
});

app.post('/login/submit', function(req, res) {
    var usernameField = req.body.usernameField;
    var passwordField = req.body.passwordField;
    console.log(usernameField);
    console.log(passwordField);
    var okField = 'ok';
    var get_users = "SELECT * FROM end_usr;"
    db.task('get-everything',task => {
        return task.batch([
            task.any(get_users)
        ]);
    })
    .then(info => {
        console.log(info);
        console.log(info.name);
        console.log(usernameField);
        if (info.name == usernameField){
            res.render('pages/home');
        }
        else{
            res.render('pages/login',{
                data: okField
            })
        }
    })
    .catch(err => {
        console.log('login error',err);
        res.render('pages/login', {
            title: 'login Page'})
    });
}); 

app.post('/newMeteoriteSubmissionForm/submit', function(req, res) {
    var meteor_type = req.body.meteor_type;
    console.log(meteor_type);
    console.log(req.body);
//    con.connect(function(err) {
//  if (err) throw  err;
//  console.log("connected");
//  var sql = "INSERT INTO `form`(`name`,`email`, `description`) VALUES ('"+req.body.name+"','"+req.body.email+"','"+req.body.description+"')";
//  con.query(sql, function(err, result)  {
//   if(err) throw err;
//   console.log("table created");
//  });
});
app.post('/home/pick_color', function(req, res) {
	var color_hex = req.body.color_hex;
	var color_name = req.body.color_name;
	var color_message = req.body.color_message;
	var insert_statement = "INSERT INTO favorite_colors(hex_value, name, color_msg) VALUES('" + color_hex + "','" +
							color_name + "','" + color_message +"') ON CONFLICT DO NOTHING;";

	var color_select = 'select * from favorite_colors;';
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(color_select)
        ]);
    })
    .then(info => {
    	res.render('pages/home',{
				my_title: "Home Page",
				data: info[1],
				color: color_hex,
				color_msg: color_message
			})
    })
    .catch(err => {
        // display error message in case an error
            console.log('error', err);
            response.render('pages/home', {
                title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });
});

// TEAM STATS PAGE //
app.get('/team_stats', function(req, res) {

	var viewAllGames = 'select * from football_games;';
	var winCount = 'select count(*) from football_games where home_score > visitor_score;';
	var lossCount = 'select count(*) from football_games where home_score < visitor_score;';
	db.task('get-everything', task => {
	    return task.batch([
		task.any(viewAllGames),
		task.any(winCount),
		task.any(lossCount)
	    ]);
	})
	.then(data => {
		res.render('pages/team_stats',{
				my_title: "Season Statistics",
				result_1: data[0],
				result_2: data[1][0],
				result_3: data[2][0]
			})
	})
	.catch(err => {
	    // display error message in case an error
		console.log('error', err);
		res.render('pages/team_stats',{
				my_title: "Season Statistics",
				result_1: '',
				result_2: '',
				result_3: ''
			})
	});

});



// FOOTBALL PLAYER PAGE //
app.get('/player_info', function(req, res) {

	var nameId = 'select id, name from football_players;';
	db.any(nameId).then(function(rows){
		res.render('pages/player_info',{
				my_title: 'Player Information',
				result_1: rows,
				result_2: '',
				result_3: ''
			})
	})
	.catch(err => {
	    // display error message in case an error
		console.log('error', err);
		res.render('pages/player_info',{
				my_title: 'Player Information',
				result_1: '',
				result_2: '',
				result_3: ''
			})
	});

});

app.get('/player_info/post', function(req, res) {
	var playerChoice = req.query.player_choice;
	var nameId = 'select id, name from football_players;';
	var player = 'select * from football_players where id = ' + playerChoice + ';';
	var gamesCount = 'select count(*) from football_games inner join football_players on football_players.id = any(football_games.players) where football_players.name = '+ playerChoice +';';
console.log(player);
	db.task('get-everything', task => {
	    return task.batch([
		task.any(nameId),
		task.any(player),
		task.any(gamesCount)
	    ]);
	})
	.then(data => {
		res.render('pages/player_info',{
				my_title: "Player Information",
				result_1: data[0],
				result_2: data[1][0],
				result_3: data[2][0]
			})
	})
	.catch(err => {
	    // display error message in case an error
		console.log('error', err);
		res.render('pages/player_info',{
				my_title: "Player Information",
				result_1: '',
				result_2: '',
				result_3: ''
			})
	});

});

app.listen(8080);
console.log('8080 is the magic port');
