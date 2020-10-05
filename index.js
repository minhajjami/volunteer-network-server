const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = 5000
const ObjectID = require('mongodb').ObjectID;

const pass = 'zmrokhqPrwzBT4Eb'

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fuyuk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const volunteerCollection = client.db("volunteerNetwork").collection("volunteers");
    // perform actions on the collection object

    //add volunteer 
    app.post('/addVolunteer', (req, res) => {
        volunteerCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    // get all events ny user
    app.get('/getEventsByUser', (req, res) => { 
        const userEmail = req.query.email;
        volunteerCollection.find({ email: userEmail })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //get volunteer
    app.get('/getVolunteers', (req, res) => {
        volunteerCollection.find({})
            .toArray((err, documents) => {
                res.status(200).send(documents);
            })
    });

    //delete volunteer
    app.delete('/delete/:id', (req, res) => {
        volunteerCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT||port)