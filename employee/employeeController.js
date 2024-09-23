const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const employeeService = require('./employeeService');

// route to handle POST requests
router.post("/register", async (req, res) => {
    const jsonData = req.body;
    const result = await employeeService.registerUser(jsonData);

    if(result.success){
        res.status(201).json({
            message: "User registered successfully"
        });
    }else{
        res.status(400).json({
            message: result.message
        });
    }
});


// Route to handle user login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const result = await employeeService.loginUser(email, password);
    if (result.success) {
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