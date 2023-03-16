const express = require('express');
const app = express();
const url ="mongodb+srv://userb:userbpassword@cluster0.7qdbv1x.mongodb.net/UserDB?retryWrites=true&w=majority"
const database ='userDB'
const PORT =3030;
const { MongoClient } = require("mongodb");
const client = new MongoClient(url);
const user =require('./authapi/User')
const { ObjectId } = require("mongodb");
const mongoose =require('mongoose')

app.use(express.json());

app.get('/helloo',(req,res)=>{
    res.send("jai mata di")
})
app.get('/users', async(req,res)=>{
    const connection = await client.connect();
    const db = connection.db(database);
    const collection = db.collection("users");
   // console.log(collection);
    let users = [];
        const response = await collection.find().forEach(user => {
            users.push(user);
         return users;
        }).then(()=>{
            console.log(users)
            res.send(users)
        }).catch(err=>{
            console.log(err);
        })
})
app.use(user);

app.get("/user/:id", async (req, res) => {
    const connection = await client.connect();
    const db = connection.db(database);
    const collection = db.collection("users");
    const theId = new ObjectId(req.params.id);
        db.collection("users").findOne({ _id: theId }).then(doc => {
            res.status(200).json(doc);
        }).catch(err => {
            res.status(500).json({ err: "could not fetch the document" });
        });
})

app.post("/user", async (req, res) => {
    const user = req.body;
    const connection = await client.connect();
    const db = connection.db(database);
    const collection = db.collection("users");
    db.collection("users").insertOne(user).then(result => {
        res.send(result)
    }).catch((err)=>{
        console.log(err);
    })
})

app.delete("/user/:id", async (req, res) => {
    const connection = await client.connect();
    const db = connection.db(database);
    const collection = db.collection("users");
    const theId = new ObjectId(req.params.id);
        db.collection("users").deleteOne({ _id: theId }).then(result=>{
            res.send(result)
        }).catch(err=>{
            console.log(err)
        })
})

//const CONNECTION_URL = 'mongodb+srv://js_mastery:123123123@practice.jto9p.mongodb.net/test';
//const PORT = process.env.PORT|| 5000;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

//mongoose.set(useFindAndModify, false);