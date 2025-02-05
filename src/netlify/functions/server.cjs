const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json()); 


app.get("/", (req, res) => {
  res.status(404).json({ oops: "we dont serve that here, looking for /checkProxy or /shortener?" });
});


async function runServer() {
  try {
    await client.connect();
    await client.db("shortbase").command({ ping: 1 });
    console.log("MongoDB connected successfully.");
  } catch (ex) {
    console.error("MongoDB connection failed: ", ex);
  }
}

runServer();


app.get("/shortener/v1/getUrl/:url", async (req, res) => {
  const { url } = req.params;

  try {
    const db = client.db("shortbase");
    const schema = { short: url };
    const doc = await db.collection("shorturls").findOne(schema);

    if (!doc) {
      return res.status(404).json({ status: 404, message: "Not Found" });
    }
    res.status(200).json({ status: 200, message: doc });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
});


app.post("/shortener/v1/shorten", async (req, res) => {
  const { url } = req.body; 

  if (!url) {
    return res.status(400).json({ status: 400, message: "URL is required." });
  }

  try {
    const response = await shortenURL(url);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ status: "Error!", message: err.message });
  }
});


async function shortenURL(url) {
  const randomUrl = generateShortURL();

  try {
    const database = client.db("shortbase");
    const result = await database.collection("shorturls").insertOne({
      original: url,
      short: randomUrl,
    });

    return { result: result, oldUrl: url, newUrl: randomUrl };
  } catch (error) {
    throw new Error("Error while inserting URL: " + error.message);
  }
}


function generateShortURL() {
  const possibilities = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  let shortUrl = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * possibilities.length);
    shortUrl += possibilities[randomIndex];
  }

  return shortUrl;
}


module.exports.handler = serverless(app);
