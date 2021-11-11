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
  const reviewCollection = client.db("samsung_bd").collection("reviews");

  //   Users
  app.get("/users", async (req, res) => {
    const result = await userCollection.find({}).toArray();
    res.send(result);
  });

  app.get("/users/:uid", async (req, res) => {
    const id = req.params.uid;
    const query = { uid: id };
    const result = await userCollection.findOne(query);
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
    const query = { _id: ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.json(result);
  });

  //   Orders
  app.post("/orders", async (req, res) => {
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.json(result);
  });

  app.put("/orders/:id", async (req, res) => {
    const id = req.params.id;
    const query = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = { $set: query };
    const result = await orderCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  });

  app.get("/orders/:id", async (req, res) => {
    const id = req.params.id;
    const query = { itemid: id };
    const result = await orderCollection.findOne(query);
    res.send(result);
  });

  app.get("/orders", async (req, res) => {
    const result = await orderCollection.find({}).toArray();
    res.send(result);
  });

  app.get("/order", async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const result = await orderCollection.find(query).toArray();
    res.json(result);
  });

  app.delete("/orders/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.json(result);
  });

  app.delete("/order/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await orderCollection.deleteMany(query);
    res.json(result);
  });

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
    const item = req.body;
    const filter = { name: item.name };
    const options = { upsert: true };
    const updateDoc = { $set: item };
    const result = await productCollection.updateOne(
      filter,
      updateDoc,
      options
    );
    res.json(result);
  });

  //   Reviews
  app.get("/reviews", async (req, res) => {
    const result = await reviewCollection.find({}).toArray();
    res.send(result);
  });

  app.put("/reviews", async (req, res) => {
    const review = req.body;
    const filter = { email: review.email };
    const options = { upsert: true };
    const updateDoc = { $set: review };
    const result = await reviewCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  });

  app.delete("/review/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await reviewCollection.deleteMany(query);
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
