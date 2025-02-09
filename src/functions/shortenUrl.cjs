const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

exports.handler = async (e) => {
    const client = new MongoClient("mongodb+srv://bogdandjakovic123:teemo123321@cluster0.gp1nf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });


    try {

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
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({ oldUrl: url, newUrl: randomUrl }),
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
