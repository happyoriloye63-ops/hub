
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("./db");

const app = express();

const PORT = 5000;

// Secret key for JWT
const SECRET_KEY = "studenthub_secret_key_change_later";


// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());


// ================================
// HOME
// ================================

app.get("/", (req, res) => {

    res.json({
        message: "🎓 StudentHub API is running!"
    });

});


// ================================
// GET ALL STUDENTS
// ================================

app.get("/students", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT id, fullname, email, created_at FROM students ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "❌ Failed to get students"
        });

    }

});


// ================================
// SIGNUP
// ================================

app.post("/auth/signup", async (req, res) => {

    try {

        const {
            fullname,
            email,
            password
        } = req.body;


        // Check required fields

        if (!fullname || !email || !password) {

            return res.status(400).json({
                message: "Please fill in all fields"
            });

        }


        // Check password length

        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });

        }


        // Check if email already exists

        const existingUser = await pool.query(
            "SELECT id FROM students WHERE email = $1",
            [email]
        );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                message: "Email is already registered"
            });

        }


        // Hash password

        const hashedPassword = await bcrypt.hash(password, 10);


        // Save student

        const result = await pool.query(
            `INSERT INTO students
            (fullname, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, fullname, email, created_at`,
            [
                fullname,
                email,
                hashedPassword
            ]
        );


        res.status(201).json({

            message: "🎉 Account created successfully",

            student: result.rows[0]

        });

    } catch (error) {

        console.error("Signup error:", error);

        res.status(500).json({
            message: "❌ Server error during signup"
        });

    }

});


// ================================
// LOGIN
// ================================

app.post("/auth/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check fields

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }


        // Find student

        const result = await pool.query(
            "SELECT * FROM students WHERE email = $1",
            [email]
        );


        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        const student = result.rows[0];


        // Compare password

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Create JWT

        const token = jwt.sign(
            {
                id: student.id,
                email: student.email
            },
            SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );


        res.json({

            message: "✅ Login successful",

            token: token,

            student: {
                id: student.id,
                fullname: student.fullname,
                email: student.email
            }

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "❌ Server error during login"
        });

    }

});


// ================================
// AUTHENTICATION MIDDLEWARE
// ================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;


    if (!authHeader) {

        return res.status(401).json({
            message: "No token provided"
        });

    }


    const token = authHeader.split(" ")[1];


    if (!token) {

        return res.status(401).json({
            message: "Invalid token format"
        });

    }


    try {

        const decoded = jwt.verify(
            token,
            SECRET_KEY
        );

        req.student = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: "Invalid or expired token"
        });

    }

}


// ================================
// PROFILE
// ================================

app.get("/auth/profile", authenticateToken, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT id, fullname, email, created_at
             FROM students
             WHERE id = $1`,
            [req.student.id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        res.json({
            student: result.rows[0]
        });

    } catch (error) {

        console.error("Profile error:", error);

        res.status(500).json({
            message: "❌ Failed to get profile"
        });

    }

});


// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(
        `🎓 StudentHub server running on http://localhost:${PORT}`
    );

});