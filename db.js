const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "studenthub",
    password: "Happy123",
    port: 5433
});

pool.connect()
    .then(() => {
        console.log("🐘 PostgreSQL connected!");
    })
    .catch((error) => {
        console.error("❌ PostgreSQL connection failed:");
        console.error(error.message);
    });

module.exports = pool;