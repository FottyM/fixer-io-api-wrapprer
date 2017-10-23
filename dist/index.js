'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    axios = require('axios'),
    moment = require('moment');

var app = express();
var PORT = 5000;
app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  axios.get('https://api.fixer.io/latest').then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    console.log(error);
  });
});

app.get('/range', function (req, res) {
  res.setHeader('content-type', 'application/json');
  var base = req.query.base;
  var target = req.query.target;
  var endDate = req.query.endDate;
  var startDate = req.query.startDate;
  var promises = [];
  var chunk = [];
  var diff = Math.floor(moment(startDate).diff(endDate, 'weeks'));

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    axios.get('https://api.fixer.io/latest').then(function (response) {
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
    });
  } else {
    for (var i = 1; i <= diff + 1; i++) {
      promises.push(axios.get('https://api.fixer.io/' + startDate + '?' + 'base=' + base + '&' + 'symbols=' + target));
      startDate = moment(startDate).add(-i, 'weeks').format('YYYY-MM-DD');
    }

    axios.all(promises).then(function (responses) {
      var temp = responses.map(function (r) {
        return r.data;
      });
      res.send(temp);
    }).catch(function (errors) {
      res.send(errors);
    });
  }
});

app.listen(app.get('port'), function () {
  console.log('http://localhost:%s  and waiting for requests', PORT);
});