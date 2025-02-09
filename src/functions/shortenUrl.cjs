const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

exports.handler = async (e) => {
    const client = new MongoClient(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });

    try {
        await client.connect(); 

        const url = e.path.split("/").pop(); 
        if (url) {
            const database = client.db("shortbase");
            const collection = database.collection("urls");

            const randomUrl = uuidv4(); 
            const newDoc = {
                short: randomUrl,
                original: url
            };

           await collection.insertOne(newDoc); 

            return { 
                statusCode: 200, 
                body: JSON.stringify({ oldUrl: url, newUrl: randomUrl }) 
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({ message: "No URL provided." }),
        };

    } catch (err) {
        console.error("Error saving URL:", err);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error saving document.", error: err.message }),
        };
    } finally {
        await client.close(); 
    }
};
