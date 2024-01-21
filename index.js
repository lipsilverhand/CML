import express from 'express';
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var userIsAuthorised = false
function passwordCheck(req, res, next) {
    const password = req.body["password"];
    if (password === "test") {
        userIsAuthorised = true;
    }
    next();
}
app.use(passwordCheck);

app.get('/', (req,res) => {
    res.render("login.ejs");
});

app.post("/", (req, res) => {
    if (userIsAuthorised) {
        res.redirect("/index.ejs");
    } else {
        res.redirect("/");
    }
});


app.get('/index.ejs', (req,res) => {
    res.render("index.ejs");
});


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "changemaker",
    password: "Liphuynh99!",
    port: 5432,
});
  
db.connect();

app.get('/teamA.ejs', (req, res) => {
    db.query("SELECT * FROM changemakers WHERE team = 'A' AND (NOT vision_board OR learning_compass OR NOT group_kpi OR NOT vision_statement OR NOT company_iceberg OR NOT knowledge_sharing OR NOT three_skills OR NOT links)" , (err, result) => {
        if (!err) {
            const dataA = result.rows;
            res.render('teamA.ejs', { dataA });
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error');
        }
        db.end;
    });
});

app.get('/teamB.ejs', (req, res) => {
    db.query("SELECT * FROM changemakers WHERE team = 'B' AND (NOT vision_board OR learning_compass OR NOT group_kpi OR NOT vision_statement OR NOT company_iceberg OR NOT knowledge_sharing OR NOT three_skills OR NOT links)" , (err, result) => {
        if (!err) {
            const dataB = result.rows;
            res.render('teamB.ejs', { dataB });
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error');
        }
        db.end;
    });
});

app.get('/teamC.ejs', async (req, res) => {
    db.query("SELECT * FROM changemakers WHERE team = 'C' AND (NOT vision_board OR learning_compass OR NOT group_kpi OR NOT vision_statement OR NOT company_iceberg OR NOT knowledge_sharing OR NOT three_skills OR NOT links)" , (err, result) => {
        if (!err) {
            const dataC = result.rows;
            res.render('teamC.ejs', { dataC });
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error');
        }
        db.end;
    });
});

app.get('/teamD.ejs', async (req, res) => {
    db.query("SELECT * FROM changemakers WHERE team = 'D' AND (NOT vision_board OR learning_compass OR NOT group_kpi OR NOT vision_statement OR NOT company_iceberg OR NOT knowledge_sharing OR NOT three_skills OR NOT links)" , (err, result) => {
        if (!err) {
            const dataD = result.rows;
            res.render('teamD.ejs', { dataD });
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error');
        }
        db.end;
    });
});    


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

