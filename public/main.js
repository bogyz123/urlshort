const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dbSchema = require("../models/shortened");
const shortid = require("shortid");






app.use(express.static("../public")); //  express cita staticne fajlove sa ovog dir-a
app.set('view engine', 'ejs') // View engine koji koristimo za template
app.use(express.urlencoded({ extended: true }))




const connectDatabase = async () => { // Konekcija na mongodb, awaited je da preventujemo errore sa modelom.
    try {

        await mongoose.connect(`mongodb+srv://bogdandj1337:${import.meta.env.VITE_MONGO_PASSWORD}@cluster0.6o5p5v5.mongodb.net/?retryWrites=true&w=majority`);

        console.log("connected to database");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
connectDatabase();

var tableData = {};


app.get('/', async (req, res) => {
    res.render('index', { oldUrl: "", newUrl: "", display: 'none', shortUrl: "" });
}); // Index page renderujemo, ove varijable ce kasnije biti popunjene kada budemo zvali render() na index a trenutno ne smeju biti null?

app.post("/new", (req, res) => { // Generisemo random link, vracamo se na '/' ovog puta dajemo te iste varijable koje se i renderuju u ejs fajlu.
    if (!req.body.url) {
        res.sendStatus(404);
        return;
    }
    const short = shortid.generate();
    const dataSnapshot = {
        originalUrl: req.body.url,
        shortenedUrl: short,
        createdAt: new Date().getFullYear(),
        clicks: 0
    }
    dbSchema.create(dataSnapshot);
    tableData = dataSnapshot;
    res.render("index", { oldUrl: req.body.url, newUrl: "localhost:5173/" + short, shortUrl: short, display: 'block' });
});
app.get("/:url", async (req, res) => { // Svaki individualni url se hendluje ovde
    const params = req.params.url;
    const query = await dbSchema.findOne({ shortenedUrl: params });

    if (query === null) {
        return res.sendStatus(404);
    }
    await query.updateOne({ $inc: { clicks: 1 } }).exec();
    res.redirect(query.originalUrl);
});
app.listen(process.env.PORT || 5173, () => { // Slusamo na port 5173 ukoliko app nije deployed
    console.log("Listening");
});