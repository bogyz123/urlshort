const { MongoClient } = require("mongodb");


exports.handler = async (e) => {
    const client = new MongoClient("mongodb+srv://bogdandjakovic123:teemo123321@cluster0.gp1nf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    try {
        const url = e.path.split("/").pop();
        const db = client.db("shortbase");
        const schema = { short: url };
        const doc = await db.collection("urls").findOne(schema);
    console.log(schema);
        if (!doc) {
          return {statusCode: 404, body: "Failed to get URL."}
        }
        console.log(doc);
       return {statusCode:200,headers: {"Access-Control-Allow-Origin": "*"}, body:JSON.stringify({original: doc.original})}
      } catch (err) {
        console.log(err);
      }
};
