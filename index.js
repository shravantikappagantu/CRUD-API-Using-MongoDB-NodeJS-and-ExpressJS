var express = require('express');
var app = express();

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connecting server file for AWT
let middleware = require('./middleware');
let server=require('./server');

//mongodb
const MongoClient = require('mongodb').MongoClient;

// database connection
const url = 'mongodb://127.0.0.1:27017/';
const dbName='hospitalManagement';

let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});

// Fetching Hospital Details
app.get('/hospitaldetails',middleware.checkToken, function(req,res){
    console.log("Fetching data from Hospital collection");
    var data = db.collection('HospitalDetails').find().toArray((function(err,doc){
        if (err) console.log(err);
        res.json(doc);
    }));      
}); 


// Fetching Ventilator Details
app.get('/ventilatordetails',middleware.checkToken, function(req,res){
    console.log("Fetching data from Ventilator collection");
    var data = db.collection('VentilatorDetails').find().toArray((function(err,doc){
        if (err) console.log(err);
        res.json(doc);
    })); 
}); 

// Search Ventilators by  hospital name
app.post('/searchventbyname',middleware.checkToken, function(req,res) {
    var name = req.body.name;
    console.log("searching ventilator by name");
    var data = db.collection('VentilatorDetails').find({"name":new RegExp(name,'i')}).toArray()
        .then(result => res.json(result));
});

// Search Ventilators by  "status"
app.post('/searchventbystatus',middleware.checkToken, function(req,res) {
    var name = req.body.status;
    console.log("searching ventilator by status");
    var data = db.collection('VentilatorDetails').find({"status":name}).toArray((function(err,doc){
        if (err) console.log(err);
        res.json(doc);
    }));      
});

// Search Hospital by name
app.post('/hospitalname',middleware.checkToken, function(req,res){
    var name = req.body.name;
    console.log("Searching hospitals by hospital name "+name);
    var data = db.collection('HospitalDetails').find({"name":new RegExp(name,'i')}).toArray(function(err,doc){
        if (err) console.log(err);
        res.json(doc);
    });
});

// Update ventilator Details
app.put('/updateV',middleware.checkToken, function(req,res){
    var vid={ventilatorID:req.body.vid};
    var newstatus={$set:{"status":req.body.status}}
    console.log("Updating ventilator details");
    db.collection('VentilatorDetails').updateOne(vid,newstatus);
    db.collection('VentilatorDetails').findOne({"ventilatorID":req.query.vid},function(err,doc){
      if (err) throw err;
      res.send("updated 1 record");
    });
});

// Delete ventilator by vid
app.delete('/deletevent',middleware.checkToken, function(req,res){
    var vid={ventilatorID:req.body.vid};
    console.log("Deleting ventilator details");
    db.collection('VentilatorDetails').deleteOne(vid);
    res.send("deleted 1 record");
});

// Add ventilators 
app.post('/insertvent',middleware.checkToken, function(req,res){
    var hid = req.body.hid;
      var vid=req.body.vid;
      var status=req.body.status;
      var name=req.body.name;
      var insert=
      {
        hID:hid,ventilatorID:vid,status:status,name:name
      };
    console.log("Inserting ventilator details");
    var data = db.collection('VentilatorDetails').insertOne(insert,function(err,result){
      res.json("item Inserted");
    });
  });

app.listen(3000);
