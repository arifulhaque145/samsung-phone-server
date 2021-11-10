require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

// database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbdvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const userCollection = client.db("samsung_bd").collection("users");
  const orderCollection = client.db("samsung_bd").collection("orders");
  const productCollection = client.db("samsung_bd").collection("products");

  //   Users
  app.get("/users", async (req, res) => {
    const result = await userCollection.find({}).toArray();
    res.send(result);
  });

  app.put("/users", async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  });

  app.put("/users/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = { $set: { role: "admin" } };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  });

  app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.json(result);
  });

  //   Orders

  //   Products
  app.get("/products", async (req, res) => {
    const result = await productCollection.find({}).toArray();
    res.send(result);
  });

  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await productCollection.findOne(query);
    res.send(result);
  });

  app.put("/products", async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await productCollection.updateOne(
      filter,
      updateDoc,
      options
    );
    res.json(result);
  });

  //   client.close();
});

app.get("/", async (req, res) => {
  res.send("Hello Server");
});

app.listen(port, () => {
  console.log("Server is running", port);
});
