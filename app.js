const bodyParser = require('body-parser');
const express = require('express')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongoose = require('mongoose');

var port = normalizePort(process.env.PORT || '3000');

const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://aviwashere:aviwashere@cluster0.ajf7l.mongodb.net/<dbname>?retryWrites=true&w=majority";


app.listen(port);

app.get('/', function(req, res) {
  res.send('Hello Worldd');
})


app.get('/search/:topic', function(req, res) {
  var topic = req.params.topic;
  console.log(topic);

  if (topic == 'all questions')
  {
    getAllQuestions(function(questionNums)
    {
      res.send(Array.from(questionNums));
    });
  }
  else
  {
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
  }
})

function getTopics(rootSearch, callback)
{

  var topicQueue = [rootSearch];
  var topicTree = [rootSearch];

  MongoClient.connect(uri, async function(err, client){

    if (err)
    {
      console.log('An error occurred connecting to MongoDB: ', err);
    }

    var db = client.db('Pncl');
    const rootQuery = { "topic": rootSearch };

    var seen = new Set();

    var rootResult = await db.collection("Topics").findOne(rootQuery);
    if (rootResult)
    {
      while (topicQueue.length != 0)
      {
        var topic = topicQueue.shift();

        if (!seen.has(topic))
        {
          seen.add(topic);

          const topicQuery = { "topic": topic };
          var result = await db.collection("Topics").findOne(topicQuery);
  
          for (val of result['subtopics'])
          {
            topicQueue.push(val);
            topicTree.push(val);
          }
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

function getAllQuestions(callback)
{
  MongoClient.connect(uri, function(err, client){

    var db = client.db('Pncl');

    res = new Set();
    
    var cursor = db.collection("Questions").find();
    cursor.forEach(function(doc,err){
      for (question of doc['questions'])
      {
        res.add(question);
      }
    }, function()
    {
      callback(res);
    });
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

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

