const bodyParser = require('body-parser');
const express = require('express')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongoose = require('mongoose');

const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://aviwashere:aviwashere@cluster0.ajf7l.mongodb.net/<dbname>?retryWrites=true&w=majority";


app.get('/', function(req, res) {
  res.send('Hello Worldd');
})


app.get('/search/:topic', function(req, res) {
  var topic = req.params.topic;
  console.log(topic);

  getTopics(topic, function(topicTree){
    if (topicTree != null)
    {
      getQuestions(topicTree, function(questionNums)
      {
        if(questionNums)
        {
          res.send(Array.from(questionNums));
        }
        else
        {
          res.send("no questions found");
        }
      });
    }
    else
    {
      res.send("bad query");
    }

  });
})

function getTopics(rootSearch, callback)
{

  var topicQueue = [rootSearch];
  var topicTree = [rootSearch];

  MongoClient.connect(uri, async function(err, client){

    var db = client.db('Pncl');
    const rootQuery = { "topic": rootSearch };

    var rootResult = await db.collection("Topics").findOne(rootQuery);
    if (rootResult)
    {
      while (topicQueue.length != 0)
      {
        var topic = topicQueue.shift();
        const topicQuery = { "topic": topic };
        var result = await db.collection("Topics").findOne(topicQuery);//.then(topicResult => {

        for (val of result['subtopics'])
        {
          topicQueue.push(val);
          topicTree.push(val);
        }

      }
      callback(topicTree);
    }
    else
    {
      callback(null);
    }
  });

}

function getQuestions(topicTree, callback)
{

  var questionSet = new Set();

  MongoClient.connect(uri, async function(err, client){

    var db = client.db('Pncl');

    for (topic of topicTree)
    {
      const query = { "topic": topic }
      var queryResult = await db.collection("Questions").findOne(query);
      if (queryResult != null)
      {
        console.log(queryResult);

        for (q of queryResult['questions'])
        {
          questionSet.add(q);
        }
      }
    }
    callback(questionSet);

  });
}

app.listen(3000)
