var mongoose = require('mongoose');

const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://aviwashere:aviwashere@cluster0.ajf7l.mongodb.net/<dbname>?retryWrites=true&w=majority";
const csv  = require('csvtojson');

var questionDict = {};

(async () => {
  const questions = await csv().fromFile("Questions.csv");

  questions.forEach(function(item, i)
  {
    var annotation1 = item["Annotation 1"];
    if (annotation1 != "")
    {
      if (annotation1 in questionDict)
      {
        var questionBank = questionDict[annotation1];
        questionBank.push(item["Question number"]);
      }
      else
      {
        var questionBank = [item["Question number"]];
        questionDict[annotation1] = questionBank;
      }
    }

    var annotation2 = item["Annotation 2"];
    if (annotation1 != "")
    {
      if (annotation2 in questionDict)
      {
        var questionBank = questionDict[annotation1];
        questionBank.push(item["Question number"]);
      }
      else
      {
        var questionBank = [item["Question number"]];
        questionDict[annotation2] = questionBank;
      }
    }

    var annotation3 = item["Annotation 3"];
    if (annotation3 != "")
    {
      if (annotation3 in questionDict)
      {
        var questionBank = questionDict[annotation3];
        questionBank.push(item["Question number"]);
      }
      else
      {
        var questionBank = [item["Question number"]];
        questionDict[annotation3] = questionBank;
      }
    }

    var annotation4 = item["Annotation 4"];
    if (annotation4 != "")
    {
      if (annotation4 in questionDict)
      {
        var questionBank = questionDict[annotation4];
        questionBank.push(item["Question number"]);
      }
      else
      {
        var questionBank = [item["Question number"]];
        questionDict[annotation4] = questionBank;
      }
    }

    var annotation5 = item["Annotation 5"];
    if (annotation5 != "")
    {
      if (annotation5 in questionDict)
      {
        var questionBank = questionDict[annotation5];
        questionBank.push(item["Question number"]);
      }
      else
      {
        var questionBank = [item["Question number"]];
        questionDict[annotation5] = questionBank;
      }
    }

    var annotation6 = item["Annotation 6"];
    if (annotation6 != "")
    {
      if (annotation6 in questionDict)
      {
        var questionBank = questionDict[annotation6];
        questionBank.push(item["Question number"]);
      }
      else
      {
        var questionBank = [item["Question number"]];
        questionDict[annotation6] = questionBank;
      }
    }
  });

  MongoClient.connect(uri, function(err, client){

    var db = client.db('Pncl');
    db.collection("Questions").drop();
    
    for (var i in questionDict)
    {
      var payload = {};
      payload['topic'] = i;
      payload['questions'] = questionDict[i];
    
      //console.log(payload);
    
      db.collection("Questions").insertOne(payload, function(err,result){
        if (err == null)
        {
          client.close();
        }
        else
        {
          console.log(err);
        }
      });
    }
  });

  MongoClient.connect(uri, function(err, client){

    var db = client.db('Pncl');

    res = [];
    var cursor = db.collection("Questions").find();
    cursor.forEach(function(doc,err){
      res.push(doc)
    }, function(){
      client.close();
      console.log('questions', res);
    });
  });
})();

var topicDict = {};

(async () => {
  const topics = await csv().fromFile("Topics.csv");

  topics.forEach(function(row, i)
  {
    var root = row["Topic Level 1"];
    if (root != "")
    {
      var rootSet = topicDict[root] || new Set();
      topicDict[root] = rootSet;

      var lv2 = row["Topic Level 2"];
      if (lv2 != "")
      {
        rootSet.add(lv2);

        var lv2Set = topicDict[lv2] || new Set();
        topicDict[lv2] = lv2Set;

        var lv3 = row["Topic Level 3"];
        if (lv3 != "")
        {
          lv2Set.add(lv3);

          var lv3Set = topicDict[lv3] || new Set();
          topicDict[lv3] = lv3Set;
        }
      }
    }
  });

  MongoClient.connect(uri, function(err, client){
    //db created
    var db = client.db('Pncl');
    db.collection("Topics").drop();

    for (var i in topicDict)
    {
      var payload = {};
      payload['topic'] = i;
      payload['subtopics'] = Array.from(topicDict[i]);
    
      //payload[i] = Array.from(topicDict[i]);
      console.log('res', payload);
    
      db.collection("Topics").insertOne(payload, function(err,result){
        if (err == null)
        {
          client.close();
        }
        else
        {
          console.log(err);
        }
      });
    }
  });


  MongoClient.connect(uri, function(err, client){

    var db = client.db('Pncl');

    res = [];
    var cursor = db.collection("Questions").find();
    cursor.forEach(function(doc,err){
      res.push(doc)
    }, function(){
      client.close();
      console.log('questionssss', res);
    });
  });
})();