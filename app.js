import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "changemaker",
    password: "Liphuynh99!",
    port: 5432,
});

db.connect();

db.query("SELECT * FROM changemakers WHERE team = 'B' AND (NOT vision_board OR learning_compass OR NOT group_kpi OR NOT vision_statement OR NOT company_iceberg OR NOT knowledge_sharing OR NOT three_skills OR NOT links", (err, res) => {
    if(!err) {
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    db.end;
})