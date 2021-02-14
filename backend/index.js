const express = require('express')
const app = express()
app.use(express.json());
const { body, validationResult } = require('express-validator');

//parse
var ParseServer = require('parse-server').ParseServer;
var api = new ParseServer({
    databaseURI: 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
    cloud: './cloud/main.js', // Path to your Cloud Code
    appId: 'myAppId2',
    masterKey: 'myMasterKey2', // Keep this key secret!
    fileKey: 'optionalFileKey2',
    serverURL: 'http://localhost:1337/parse' // Don't forget to change to https if needed
});
app.use('/parse', api);
app.listen(1337, function() {
    console.log('parse-server running on port 1337.');
});

//pars dashboard
var ParseDashboard = require('parse-dashboard'); 
var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": "http://localhost:1337/parse",
      "appId": "myAppId2",
      "masterKey": "myMasterKey2",
      "appName": "MyApp2"
    }
  ]
});
app.use('/dashboard', dashboard);

//api
app.get('/api/', function (req, res) {
  res.send({"message":'Hello World'})
})

// user
app.post('/api/signup',
  //body('username').isLength({ min: 5 }),
  body('password').isLength({ min: 5 }),
  body('email').isEmail(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    let body = req.body
    const user = new Parse.User();
    user.set("username", body.username);
    user.set("password", body.password);
    user.set("email", body.email);
    user.set("highest_score", 0);
    Parse.User.enableUnsafeCurrentUser()
    user.signUp().then(
        value =>{
          res.send({message:"user have been created"})
        },
        reason => {
          res.status(400).send({error:`error in signing up, reason: ${reason}`})
        } 
    )      
})

app.post('/api/signin',(req, res) => {
    let body = req.body
    Parse.User.enableUnsafeCurrentUser()
    Parse.User.logIn(body.username, body.password)
    .then(
        user => {
            res.send({message: `${user.get("username")} logged in successfully`})
        }, 
        reason => {
            res.send({error: reason})
        }
    )
})

app.get("/api/getcurrentuser", (req, res) => {
    const currentUser = Parse.User.current();
    if (currentUser) {
        res.send({message: currentUser})
    } else {
        res.send({error: "no user is logged in"})
    }
})

app.get("/api/logout", (req, res) => {
    Parse.User.logOut().then(() => {
        res.send({message: "logged out successfully"})
    });
})

// game

app.get("/api/gethighestscore", (req, res) => {
    const currentUser = Parse.User.current();
    if (currentUser) {
        res.send({message: currentUser.get("highest_score")})
    } else {
        res.send({error: "no user is logged in"})
    }
})

app.post("/api/newscore", (req, res) => {
    const currentUser = Parse.User.current();
    if (currentUser) {
        let currentscore = currentUser.get("highest_score")
        let newscore = req.body.score
        if (currentscore < newscore) {
            currentUser.set("highest_score", newscore)
            currentUser.save().then(
                (value) => {res.send({message: "done"})},
                (reason) => {res.send({error: reason})}
            )
        } else {
            res.send({message: "done"})
        }
    } else {
        res.send({error: "no user is logged in"})
    }
})

app.put("/api/newscore", (req, res) => {
    
})

app.listen(3000)