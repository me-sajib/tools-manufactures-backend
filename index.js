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
  } finally {
    // await client.close();
  }
}
run().catch((e) => console.error(e));
app.listen(port, () => console.log(`Listening on port ${port}`));
