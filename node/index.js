const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 8080;

const config = {
    host: "db",
    user: "root",
    password: "root",
    database: "nodedb",
};
const connection = mysql.createConnection(config);

const createTable = () => {
    return new Promise((resolve, reject) => {
        const sqlCreateTable = `CREATE TABLE IF NOT EXISTS people (id int, name varchar(255))`;
        connection.query(sqlCreateTable, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const insertName = (name) => {
    return new Promise((resolve, reject) => {
        const sqlInsert = `INSERT INTO people (name) VALUES (?)`;
        connection.query(sqlInsert, [name], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getNames = () => {
    return new Promise((resolve, reject) => {
        const sqlSelect = `SELECT name FROM people`;
        connection.query(sqlSelect, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

app.get("/", async (req, res) => {
    try {
        await createTable();

        await insertName("Bruno");

        const results = await getNames();

        const nameList = results.map((row) => row.name);

        const message = `
            <h1>Full Cycle Rocks!</h1>
            <p>- Lista de nomes cadastrados no banco de dados.</p>
            <ul>
                ${nameList.map((name) => `<li>${name}</li>`).join("")}
            </ul>
         `;

        res.send(message);
    } catch (error) {
        res.status(500).send("Server error: " + error);
    }
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
