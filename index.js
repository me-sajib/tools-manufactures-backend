const express = require("express");
const cors = require("cors");
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

app.get("/", (req, res) => {
  res.send({ express: "Hello From Express" });
});

async function run() {
  try {
    await client.connect();
    const toolsCollection = client.db("manufacture").collection("tools");
    const orderCollection = client.db("manufacture").collection("order");
    const reviewCollection = client.db("manufacture").collection("review");
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

    // update user information
    app.patch("/updateProfile/:email", async (req, res) => {
      const email = req.params.email;
      const body = req.body;
      const result = await userInformationCollection.updateOne(
        { email },
        { $set: body }
      );
      res.send(result);
    });

    // get user information
    app.get("/information/:email", async (req, res) => {
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
