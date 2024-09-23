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



module.exports = router;