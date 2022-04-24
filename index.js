const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cdkzf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {

    await client.connect();
    const servicesCollection = client.db("geniusCar").collection("services");

    // Get all services
    app.get('/services', async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });

    /// Get a service by id
    app.get('/service/:id', async (req, res) => {
        const query = { _id: ObjectId(req.params.id) };
        const result = await servicesCollection.findOne(query);
        res.send(result);
    });

    /// Post a service
    app.post('/services', async (req, res) => {
        const result = await servicesCollection.insertOne(req.body);
        res.send(result);
    });

    // Delete a service
    app.delete('/service/:id', async (req, res) => {
        const query = { _id: ObjectId(req.params.id) };
        const result = await servicesCollection.deleteOne(query);
        res.send(result);
    });

    // Update a service
    app.put('/service/:id', async (req, res) => {
        const query = { _id: ObjectId(req.params.id) };
        const result = await servicesCollection.updateOne(query, { $set: req.body });
        res.send(result);
    });

    console.log("Db Connected");

  } finally {
      //
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Listening Port: ", port);
});
