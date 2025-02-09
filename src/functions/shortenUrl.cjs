const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

exports.handler = async (e) => {
    const mongoUri = "mongodb+srv://bogdandjakovic123:teemo123321@cluster0.gp1nf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(mongoUri);

    try {
        console.log("called shortenUrl")
        // Check if the request contains a valid URL
        if (!e.path || e.path.split("/").length < 2) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid request. No URL provided." }),
            };
        }

        const url = e.path.split("/").pop();
        const database = client.db("shortbase");
        const collection = database.collection("urls");

        // Check if the URL already exists in the database
        const existingDoc = await collection.findOne({ original: url });
        if (existingDoc) {
            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ oldUrl: url, newUrl: existingDoc.short }),
            };
        }

        // Generate a new short URL and save it
        const randomUrl = uuidv4();
        const newDoc = { short: randomUrl, original: url };
        await collection.insertOne(newDoc);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ oldUrl: url, newUrl: randomUrl }),
        };

    } catch (err) {
        console.error("Error occurred:", err);

        let errorMessage = "An unexpected error occurred.";
        let statusCode = 500;

        if (err.name === "MongoNetworkError") {
            errorMessage = "Database connection failed.";
            statusCode = 503;
        } else if (err.name === "MongoServerError") {
            errorMessage = "Database operation failed.";
            statusCode = 500;
        } else if (err.message.includes("ECONNREFUSED")) {
            errorMessage = "Database connection was refused.";
            statusCode = 503;
        }

        return {
            statusCode,
            body: JSON.stringify({ error: errorMessage, details: err.message }),
        };

    } finally {
        await client.close();
    }
};
