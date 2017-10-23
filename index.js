const express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  axios = require('axios'),
  moment = require('moment');


const app = express();
const PORT = 5000;
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  axios.get('https://api.fixer.io/latest').then(function(response) {
    res.send(response.data);
  }).catch(function(error) {
    console.log(error)
  })
});

app.get('/range', (req, res) => {
  res.setHeader('content-type', 'application/json');
  const base = req.query.base
  const target = req.query.target
  const endDate = req.query.endDate
  let startDate = req.query.startDate
  let promises = []
  let chunk = []
  const diff = Math.floor(moment(startDate).diff(endDate, 'weeks'));

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    axios.get('https://api.fixer.io/latest').then(function(response) {
      res.send(response.data);
    }).catch(function(error) {
      console.log(error)
    })
  } else {
    for (let i = 1; i <= diff + 1; i++) {
      promises.push(axios.get('https://api.fixer.io/' + startDate + '?' + 'base=' + base + '&' + 'symbols=' + target));
      startDate = (moment(startDate).add(-i, 'weeks').format('YYYY-MM-DD'))
    }

     axios.all(promises).then((responses) => {
      let temp = responses.map(r => r.data)
      res.send(temp)
    }).catch((errors) => {
      res.send(errors)
    })
  }
});


app.listen(app.get('port'), function() {
  console.log('http://localhost:%s  and waiting for requests', PORT);
});
