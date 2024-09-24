const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const employeeService = require('./employeeService');

// route to handle POST requests
router.post("/register", async (req, res) => {
    const user = req.body;
    const result = await employeeService.registerUser(user);

    if (result.success) {
        res.status(201).json({
            message: "User registered successfully"
        });
    } else {
        res.status(400).json({
            message: result.message
        });
    }
});


// Route to handle user login
router.post("/login", async (req, res) => {
    const {email, Password} = req.body;
    const result = await employeeService.loginUser(req, email, Password);

    if (result.success) {
        req.session.user = email; // Store the user email in the session
        console.log("Session after login:", req.session); // Log session object
        res.status(200).json({ message: result.message });
    } else {
        res.status(400).json({ message: result.message });
    }
});


// Route to handle logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Could not log out" });
        }
        res.status(200).json({ message: "Logged out successfully" });
    });
});

module.exports = router;