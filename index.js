const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51L0gOaCq7ZcflQjlxFmjnCXsSKqsrHNibU7lLjXK0OM06AC7yKbrlQkSxh9UQRctY1knD6QCT9G7kL9jasGdrOJ700oqYb1LLj"
);
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


app.listen(port, () => console.log(`Listening on port ${port}`));
