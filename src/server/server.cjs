const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://bogdandj1337:teemo123321@cluster0.6o5p5v5.mongodb.net/?retryWrites=true&w=majority";
const cors = require('cors');


app.use(cors());


app.get("/", (req, res) => {
  res.status(404).json({oops: 'we dont serve that here, looking for /checkProxy or /shortener?'});
});




const client = new MongoClient(uri);
async function RunServer() {
    try{
        await client.connect();
        await client.db("shortbase").command({ping: 1});
        console.log("good")
    }
    catch (ex) {
        
    }
    finally {
        client.close();
    }
}
 RunServer();
app.get("/shortener/v1/getUrl/:url", async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ status: 405, message: "Method Not Allowed" });
    return; 
  }

  const { url } = req.params;
  let server;

  try {
    server = await client.connect();
    const db = server.db("shortbase");
    const schema = {
      short: url
    };

    const doc = await db.collection("shorturls").findOne(schema);

    if (!doc) {
      res.status(404).json({ status: 404, message: "Not Found" });
      return; 
    }
    res.status(200).json({ status: 200, message: doc });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  } finally {
    if (server) {
      server.close(); 
    }
  }
});

app.post("/shortener/v1/shorten", async (req,res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ status: 405, message: "Method Not Allowed" });
    }
    const {url} = req.headers; 
    ShortenURL(url).then((response) => {
        res.status(200).json({...response});
    }).catch((err) => {
        res.status(400).json({status: "Error! - " + err});
    });
});
async function ShortenURL(url) {
    let server;
    try {
         server = await client.connect();
        const database = server.db("shortbase");
        const randomUrl = GetShortURL();
        
        const result = await database.collection("shorturls").insertOne({
            original: url,
            short: randomUrl
        });

        return {result: result, oldUrl: url, newUrl: randomUrl};
    } catch (error) {
        throw error; 
    } finally {
            if (server) {
                server.close();
            }
    }
}

 function GetShortURL() {
    var shortUrl = "";
    var possibilities = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    for (let i = 0; i < 6; i++) {
        var randomIndex = Math.floor(Math.random() * possibilities.length);
        shortUrl+=  possibilities[randomIndex];
    }
    return shortUrl;
}

app.listen(1331, () => {
  console.log('Server started on port 1331');
});