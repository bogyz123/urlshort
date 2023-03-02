const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dbSchema = require("../models/shortened");
const shortid = require("shortid");
const path = require('path');





app.use(express.static("../public")); //  express cita staticne fajlove sa ovog dir-a
app.set('view engine', 'ejs') // View engine koji koristimo za template
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))






const connectDatabase = async () => { // Konekcija na mongodb, awaited je da preventujemo errore sa modelom.
    try {
        await mongoose.connect(`mongodb+srv://bogdandj1337:teemo123321@cluster0.6o5p5v5.mongodb.net/?retryWrites=true&w=majority`);

        console.log("connected to database");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
connectDatabase();



app.get('/', async (req, res) => {
    res.render('index', { oldUrl: "", newUrl: "", display: 'none', shortUrl: "", clicks: '' });
}); // Index page renderujemo, ove varijable ce kasnije biti popunjene kada budemo zvali render() na index a trenutno ne smeju biti null?

app.post("/new", (req, res) => { // Generisemo random link, vracamo se na '/' ovog puta dajemo te iste varijable koje se i renderuju u ejs fajlu.
    if (!req.body.url) {
        res.sendStatus(404);
        return;
    }
    var date = new Date();

    const short = shortid.generate();
    const dataSnapshot = {
        originalUrl: req.body.url,
        shortenedUrl: short,
        createdAt: date.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
        clicks: 0,
        clicksPerMonth: {
            "January:": 0,
            "February": 0,
            "March": 0,
            "June": 0,
            "July": 0,
            "August": 0,
            "September": 0,
            "October": 0,
            "November": 0,
            "December": 0
        }
    }
    dbSchema.create(dataSnapshot);
    tableData = dataSnapshot;
    res.render("index", { oldUrl: req.body.url, newUrl: "bogyz123.online/" + short, shortUrl: short, display: 'block', clicks: 0 });
});
app.get("/statistics/:statisticID", async (req, res) => {
    const params = req.params.statisticID;
    const query = await dbSchema.findOne({ shortenedUrl: params });


    if (!query) {
        return res.sendStatus(404);
    }
    res.render("statistics", { shortUrl: params, originalUrl: query.originalUrl, clicks: query.clicks, createdAt: query.createdAt, clicksPerMonth: query.clicksPerMonth });

});
app.get("/:url", async (req, res) => {
    const params = req.params.url;
    const query = await dbSchema.findOne({ shortenedUrl: params });
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });

    if (query === null) {
        return res.sendStatus(404);
    }

    await query.updateOne({
        $inc: { clicks: 1 },
        $inc: { [`clicksPerMonth.${month}`]: 1 }
    }).exec();

    res.redirect(query.originalUrl);
});
app.listen(process.env.PORT || 5173, () => { // Slusamo na port 5173 ukoliko app nije deployed
    console.log("Listening");
});