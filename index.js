const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());
// mongodb atlas

const uri = `mongodb+srv://manufactureAdmin:mCneSDP76AWkNoQG@cluster0.oxomu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const port = process.env.PORT || 5000;
const tokens =
  "75babbdf74b9d467f7b086ee158e84ced9e82b280aea25e6fe43fe222b019d5ba1f40b35cea5d43e1aceb1d1a40df215ae0b96ffbe7488a2c9d1529479c40871";
app.get("/", (req, res) => {
  res.send({ express: "Hello From Express" });
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, tokens, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    await client.connect();
    const toolsCollection = client.db("manufacture").collection("tools");
    const orderCollection = client.db("manufacture").collection("order");
    const reviewCollection = client.db("manufacture").collection("review");
    const usersCollection = client.db("manufacture").collection("users");
    const userInformationCollection = client
      .db("manufacture")
      .collection("userInformation");

    // get all tools
    app.get("/tools", async (req, res) => {
      const result = await toolsCollection.find({}).toArray();
      res.send(result);
    });

    // get tool by id
    app.get("/tools/:id", async (req, res) => {
      const id = req.params.id;
      const result = await toolsCollection.findOne(ObjectId(id));
      res.send(result);
    });

    // post user purchase order
    app.post("/order", async (req, res) => {
      const body = req.body;
      const result = await orderCollection.insertOne(body);
      res.send(result);
    });

    // get user orders
    app.get("/order/:email", async (req, res) => {
      const email = req.params.email;
      const result = await orderCollection.find({ email }).toArray();
      res.send(result);
    });

    // post user review
    app.post("/review", async (req, res) => {
      const body = req.body;
      const result = await reviewCollection.insertOne(body);
      res.send(result);
    });

    // get all user reviews
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });

    // show all user
    app.get("/users", verifyJWT, async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.send(users);
    });

    // store user
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const token = jwt.sign({ email: email }, tokens, { expiresIn: "1d" });
      res.send({ result, token });
    });

    // update user information
    app.patch("/userInformation/:email", async (req, res) => {
      const email = req.params.email;
      const body = req.body;
      const result = await userInformationCollection.updateOne(
        { email },
        { $set: body }
      );
      res.send(result);
    });

    // get user information
    app.get("/userInformation/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userInformationCollection.findOne({ email });
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch((e) => console.error(e));
app.listen(port, () => console.log(`Listening on port ${port}`));
