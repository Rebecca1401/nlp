const dotenv = require('dotenv');
dotenv.config();
var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
// provides request and get methods that behave identically to those found on the native http and https modules
var https = require('follow-redirects').https;
//var. that we will accept in it  url from client side
var urll
const app = express()
let port = 3013
app.use(cors())
// to use json
app.use(bodyParser.json())
// to use url encoded values
//to be able to send url in the api  url
app.use(bodyParser.urlencoded({
    extended: true
}))
//main file that will run the project
app.use(express.static('dist'))
//create server
app.listen(port, function() {
    //console.log(`running on localhost: ${port}`);
})
//html file that will open when we create the  server
app.get('/', function(req, res) {
    res.sendFile('dist/index.html')
})

var AylienNewsApi = require("aylien-news-api");
var defaultClient = AylienNewsApi.ApiClient.instance;
var app_id = defaultClient.authentications["app_id"];
app_id.apiKey = process.env.API_ID;
var app_key = defaultClient.authentications["app_key"];
app_key.apiKey = process.env.API_KEY;
var api = new AylienNewsApi.DefaultApi();


function doRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(responseBody));
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(JSON.stringify(data))
        req.end();
    });
}

/**
 * meaningcloud solution
 * This endpoint uses the meaning cloud solution
 */
app.post('/meaningcloud', async (req, res) => {
    const targetURL = req.body.formText;
    const path = `/sentiment-2.1?key=${process.env.MC_API_KEY}&lang=auto&url=${encodeURIComponent(targetURL)}&model=general`;
    //put data in object to send to api
    var options = {
        'method': 'POST',
        'hostname': 'api.meaningcloud.com',
        'path': path,
        'headers': {},
        'maxRedirects': 20
    };
    const answer = await doRequest(options, {});
    res.writeHead(200, {"Content-Type": "application/json"});
    let result = {
        success: true,
        messageRaw: answer,
        items: []
    };
    /*
    result.items.push({
        title: data.stories[i].title,
        source: data.stories[i].source.name,
        body: data.stories[i].body,
        polarity: data.stories[i].sentiment.polarity,
        polarityScore: data.stories[i].sentiment.score
    })*/
    res.end(JSON.stringify(result));
});


/**
 * Aylien solution
 * This endpoint uses the Aylien solution
 */

app.post('/aylien', async (req, res) => {
    const keyword = req.body.formText;
    res.writeHead(200, {"Content-Type": "application/json"});
    var opts = {
        title: keyword,
        publishedAtStart: "NOW-7DAYS",
        publishedAtEnd: "NOW",
        'sentiment_title_polarity': 'sentiment_title_polarity_example',
        'not_sentiment_title_polarity': 'sentiment_title_polarity_example',
        'sentiment_body_polarity': 'sentiment_body_polarity_example',
        'not_sentiment_body_polarity': 'sentiment_body_polarity_example',
    };

    const callback = function(error, data, response) {
        if (error) {
            let result = {
                success: false,
                messageRaw : error
            }
            console.error(error);
            res.end(JSON.stringify(result));
        } else {
            let result = {
                success: true,
                messageRaw: data,
                items: []
            };
            for (var i = 0; i < data.stories.length; i++) {
                result.items.push({
                    title: data.stories[i].title,
                    source: data.stories[i].source.name,
                    body: data.stories[i].body,
                    polarity: data.stories[i].sentiment.body.polarity,
                    polarityScore: data.stories[i].sentiment.body.score
                })
            }
            res.end(JSON.stringify(result));
        }

    };

    api.listStories(opts, callback);


});
