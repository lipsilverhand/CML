import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const keywords = ["vision", "skills", "knowledge share", "team company", "linkedin"];


var userIsAuthorised = false
function passwordCheck(req, res, next) {
    const password = req.body["password"];
    if (password === "cmlevergreen") {
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

app.get('/teamA.ejs', async (req, res) => {
    try {
        const A_studentResults = await scrapeStudents(A_students);
        res.render('teamA.ejs', {A_studentResults});
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/teamB.ejs', async (req, res) => {
    try {
        const B_studentResults = await scrapeStudents(B_students);
        res.render('teamB.ejs', {B_studentResults});
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/teamC.ejs', async (req, res) => {
    try {
        const C_studentResults = await scrapeStudents(C_students);
        res.render('teamC.ejs', {C_studentResults});
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/teamD.ejs', async (req, res) => {
    try {
        const D_studentResults = await scrapeStudents(D_students);
        res.render('teamD.ejs', {D_studentResults});
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});


async function scrapeStudents(students) {
    const studentResults = [];

    try {
        await Promise.all(students.map(async (student) => {
            const response = await axios.get(student.url);

            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const missingParts = [];

                const paragraphs = $('p').toArray();

                for (const keyword of keywords) {
                    const found = paragraphs.some((paragraph) =>
                        $(paragraph).text().toLowerCase().includes(keyword)
                    );

                    if (!found) {
                        missingParts.push(keyword);
                    }
                }

                studentResults.push({
                    studentName: student.name,
                    url: student.url,
                    missingParts: missingParts.length > 0 ? missingParts.join(', ') : null,
                });
            } else {
                studentResults.push({
                    studentName: student.name,
                    url: student.url,
                    missingParts: "Failed to retrieve the webpage",
                });
            }
        }));
    } catch (error) {
        console.error(`Error scraping students: ${error.message}`);
    }

    return studentResults;
}

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});


const A_students = [
    { name: "Zachary Wood", url: "https://wordpress.evergreen.edu/zachintegrity/" },
    { name: "Bowen Kennedy", url: "https://wordpress.evergreen.edu/bowenfc/2023/10/05/hello-world/" },
    { name: "Brendan Gribek", url: "https://wordpress.evergreen.edu/brendanfutbol/personal-vision/" },
    { name: "Matthew Jordan", url: "https://wordpress.evergreen.edu/matthewhealing/" },
    { name: "Deacon Merrin", url: "https://wordpress.evergreen.edu/deaconhappiness/ " },
    { name: "Julian Chown", url: "https://wordpress.evergreen.edu" },
    { name: "Anna Hughes", url: "https://wordpress.evergreen.edu/annacreate/" },
    { name: "Duc Nguyen", url: "https://wordpress.evergreen.edu/ducretake/" },
    { name: "Madison Hagen", url: "https://wordpress.evergreen.edu/maddyimpactful/" },
    { name: "Fin DeGeare", url: "https://wordpress.evergreen.edu/finformation/" },
    { name: "Emma LeFever", url: "https://wordpress.evergreen.edu/emmastories/" },
    { name: "Jayden Upshaw", url: "https://wordpress.evergreen.edu/jaydenimaginative/" },
    { name: "Carter Middleton", url: "https://wordpress.evergreen.edu/carterpursuit/" },
];

const B_students = [
    { name: "Tom Olson", url: "https://wordpress.evergreen.edu/tomservantleader/" },

];

const C_students = [
    { name: "Philip Huynh", url: "https://wordpress.evergreen.edu/philiphuynh/" },
    { name: "Jessy Turnbull", url: "https://wordpress.evergreen.edu/jessyalign/" },
    { name: "Brielle Johnson", url: "https://wordpress.evergreen.edu/bjohnson/sample-page/" },
    { name: "Evan Wagoner", url: "https://wordpress.evergreen.edu/evanreconnect/" },
];

const D_students = [
    { name: "Mike Williams", url: "https://wordpress.evergreen.edu/mikeexplore/" },
    { name: "Joe", url: "https://wordpress.evergreen.edu/joeg/" },
];