// Call all deps
const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    axios = require('axios'),
    moment = require('moment');

//
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
    axios.get('https://api.fixer.io/latest')
        .then(function (response) {
            res.send(response.data);
        })
        .catch(function (error) {
            console.log(error)
        })
})

app.get('/range', function (req, res) {

    if ( Object.keys(req.query).length === 0 && req.query.constructor === Object ){
        axios.get('https://api.fixer.io/latest')
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error)
            })
    }else{
        let keys = Object.keys(req.query);
        console.log(keys)
        res.send(req.query)
    }

})


app.listen(PORT, function () {
    console.log('server running on http://localhost:' + PORT )
})