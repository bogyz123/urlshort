const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const helmet = require('helmet');

const connectionUrl = "mongodb+srv://bogdandjakovic123:somethingverysecret@cluster0.gp1nf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(connectionUrl);
app.use(cors());
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://0382-178-223-10-224.ngrok-free.app"]
    }
  }));
const connectToServer = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB.");
    } catch (err) {
        console.error("Failed to connect to MongoDB.", err);
    }
};
connectToServer();

app.get("/", (req, res) => {
    res.send("body");
});

app.all("/getUrl/:url", async (req, res) => {
    const url = req.params.url; 
    if (url) {
        console.log(url);
        const collection = client.db("shortbase").collection("urls");
        const schema = { short: url };
        const doc = await collection.findOne(schema);
        if (!doc) {
            return res.send({ statusCode: 404, body: "The document is not found." }); 
        }
        return res.send({ statusCode: 200, original: doc.original }); 
    } else {
        return res.send({ statusCode: 404, body: "URL Not Found." }); 
    }
});
app.all("/shortenUrl/:url", async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = req.params.url;
    if (url) {
        const doc = {original: url};
        const collection = client.db("shortbase").collection("urls");
        const document = await collection.findOne(doc);
        if (document) {
            return res.send({statusCode: 200, short: document.short, original: document.original});
        }
        const random = uuidv4();
        await collection.insertOne({original: url, short: random});
        console.log("successful!")
        res.setHeader('Content-Type', 'application/json');

        res.send({statusCode: 200, short: random});
    }
    else {
        return res.send({statusCode: 404, body: "URL Not Found"});
    }
});
app.listen(1337, () => {
    console.log("Listening on port 1337");
});
