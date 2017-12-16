const express = require('express')
const app = express()

app.enable('trust proxy');
app.use(function(req, res, next) {
    if (req.secure || req.headers.host == 'localhost:8080'){
        return next();
    }
    res.redirect("https://" + req.headers.host + req.url);
});

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.sendFile("templates/index.html", {"root": __dirname});
});

app.post('/email', function(req, res){
  var ses = require('node-ses'),
   client = ses.createClient({
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
    amazon: 'https://email.us-west-2.amazonaws.com'
  });

  client.sendEmail({
     to: 'a@paradigmwing.com'
   , from: 'a@paradigmwing.com'
   , subject: 'Paradigm Site Email'
   , message: req.body.name + "  " + req.body.email + "<br/><br/>"  +  req.body.message
  }, function (err, data, res) {

  });
  res.send(JSON.stringify({ succes: 1 }));
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})
