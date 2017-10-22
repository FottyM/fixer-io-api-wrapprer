// Call all deps
const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    axios = require('axios'),
    moment = require('moment'),
    _ = require('lodash');

//
const app = express();
const PORT =  5000;
app.set('port', (process.env.PORT || 5000));

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
});

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
        const base = req.query.base;
        let startDate = req.query.startDate;
        const target = req.query.target;
        const endDate = req.query.endDate;
        const chunk = {};
        const promises = []
        const diff = moment(startDate).diff(endDate, 'weeks');

        res.setHeader('content-type', 'application/json');

        for (let i = 1; i <= diff; i ++){
            // if(moment(startDate).diff(endDate, 'weeks') >= 0 ){

                promises.push(axios.get('https://api.fixer.io/'+ startDate + '?' +'base='+ base + '&' + 'symbols=' + target ));
                startDate = ( moment(startDate).add(-i, 'weeks').format('YYYY-MM-DD'))
            // }

        }

        axios.all(promises)
            .then(function (responses) {
                responses.forEach(function (response, i) {
                    chunk[i+''] += response.data
                    console.log(response.data)
                    // res.write(response.data)
                })
            }).catch(function (erros) {
            res.json(erros)
        });
        console.log(chunk, 'chunkiiii')
        res.json(chunk)
        res.end()


    }

});

app.listen(app.get('port'), function() {
    console.log('http://localhost:%s  and waiting for requests', PORT);
});
