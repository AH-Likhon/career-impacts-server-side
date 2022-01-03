const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3g5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        // console.log('Databse Connected');
        const database = client.db('CareerImpacts');
        const jobs = database.collection('jobs');
        const usersCollection = database.collection('Users');


        // get jobs api
        app.get("/jobs", async (req, res) => {
            const result = await jobs.find({}).toArray();
            console.log(req.body);
            res.send(result);
        });

        // Delete/remove single jobs 
        app.delete("/jobs/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await jobs.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });


        // insert job api
        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobs.insertOne(job);
            console.log(result);

            res.json(result);
        });

        // find a single job api
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await jobs.findOne(query);
            // console.log('Find with id', id);
            res.send(result);
        });

        // update single job
        app.put('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updateData
            };
            const result = await jobs.updateOne(filter, updateDoc, options);

            console.log(result);
            // console.log(req.body);
            res.json(result);
        })


        // // get my myAttendance api
        // app.get('/allAttendance', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email };
        //     const cursor = recordTime.find(query);
        //     const result = await cursor.toArray();
        //     console.log(result);
        //     res.send(result);
        // });



        // // get admin user
        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     let isAdmin = false;
        //     if (user?.role === 'Admin') {
        //         isAdmin = true;
        //     }
        //     res.json({ admin: isAdmin })
        // })


        // //get all users api
        // app.get("/members", async (req, res) => {
        //     const result = await usersCollection.find({}).toArray();
        //     // console.log(req.body);
        //     res.send(result);
        // });

        // // get specific user information api
        // app.get('/members/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await usersCollection.findOne(query);
        //     // console.log('Find with id', id);
        //     res.send(result);
        // });

        // // update specific users information api 
        // app.put('/members/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updateData = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             displayName: updateData.displayName,
        //             email: updateData.email,
        //             password: updateData.password,
        //             role: updateData.role,
        //             entryDate: updateData.entryDate,
        //         },
        //     };
        //     const result = await usersCollection.updateOne(filter, updateDoc, options);

        //     console.log(result);
        //     // console.log(req.body);
        //     res.json(result);
        // })

        // // Delete/remove specific users
        // app.delete("/users/:id", async (req, res) => {
        //     console.log(req.params.id);
        //     const result = await usersCollection.deleteOne({
        //         _id: ObjectId(req.params.id),
        //     });
        //     res.send(result);
        // });

        // // insert a user
        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     const result = await usersCollection.insertOne(user);
        //     console.log(result);
        //     res.json(result);
        // });


        // // update a user
        // app.put('/users', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             user

        //         }
        //     };
        //     const result = await usersCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // });


        // // update user role
        // app.put('/users/admin', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const updateDoc = { $set: { role: 'Admin' } };
        //     const result = await usersCollection.updateOne(filter, updateDoc);
        //     console.log('put', result);
        //     res.json(result);
        // })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Career Impacts Server')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})