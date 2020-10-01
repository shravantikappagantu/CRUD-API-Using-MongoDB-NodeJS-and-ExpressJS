var express = require('express');
var app = express();

const MongoClient = require('mongodb').MongoClient;

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
app.get('/hospitaldetails', function(req,res){
    console.log("Fetching data from Hospital collection");
    var data = db.collection('HospitalDetails').find().toArray()
        .then(result => res.json(result));
}); 


// Fetching Ventilator Details
app.get('/ventilatordetails', function(req,res){
    console.log("Fetching data from Ventilator collection");
    var data = db.collection('VentilatorDetails').find().toArray()
        .then(result => res.json(result));
}); 

// Search Ventilators by Status AND hospital name
app.get('/ventilatorSearch', function(req,res){
    console.log("searching ventilators by status and hospital name");
    var data = db.collection('VentilatorDetails').find({"status":req.query.status,"name":req.query.name}).toArray()
        .then(result => res.json(result));
});

// Search Hospital by name
app.get('/hospitalname', function(req,res){
    var data = db.collection('HospitalDetails').find({"name":req.query.name}).toArray()
        .then(result => res.json(result));
});

// Update ventilator Details
app.get('/updateV', function(req,res){
    console.log("updating ventilator details");
    var update1 = db.collection('VentilatorDetails').update({"ventilatorID":req.query.vid},{$set:{"status":req.query.newstatus}});
    var data = db.collection('VentilatorDetails').find({"ventilatorID":req.query.vid}).toArray()
        .then(result => res.json(result));
    res.send("Updated!");
});

// Delete ventilator by vid
app.get('/delV', function(req,res){
    console.log("updating ventilator details");
    var delete1 = db.collection('VentilatorDetails').deleteOne({"VentilatorID":req.query.vid});
    res.send("Deleted 1 record!");
});

// Add ventilators 
app.get('/insertV', function(req,res){
    console.log("inserting ventilator details");
    var insert1 = db.collection('VentilatorDetails')
        .insertOne({"hID":req.query.hid,"ventilatorID":req.query.vid,"status":req.query.status,"name":req.query.name});
    res.send("Inserted 1 record!");
});

app.listen(3000);
